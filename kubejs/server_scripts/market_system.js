// ============================================================
// 文明纪元 - 动态市场经济系统
// 基于：供需-价格离散时间模型 + 价格弹性 + 库存系统 + 市场护栏
// 参考文档：市场经济运行原理（微观经济学 + 博弈论）
// ============================================================

const { ERAS, ERA_NAMES } = global.CivilizationEra

// ============================================================
// 市场状态（全局持久化）
// ============================================================

function getMarketState(level) {
  if (!level.persistentData.contains('market_state')) {
    let state = {
      last_update_day: 0,
      items: {}
    }
    level.persistentData.put('market_state', state)
    return state
  }
  return level.persistentData.get('market_state')
}

function saveMarketState(level, state) {
  level.persistentData.put('market_state', state)
}

// ============================================================
// 初始化市场
// ============================================================

function initMarketIfNeeded(level) {
  let state = getMarketState(level)

  if (!state.items || Object.keys(state.items).length === 0) {
    state.items = {}

    for (let [itemId, config] of Object.entries(MARKET_CONFIG.items)) {
      state.items[itemId] = {
        current_price: config.base_price,
        inventory: config.base_supply_per_day * 7,
        daily_supply: config.base_supply_per_day,
        daily_demand: config.base_demand_per_day,
        price_history: [config.base_price],
        supply_shock: 1.0,
        demand_shock: 1.0
      }
    }

    saveMarketState(level, state)
    console.log('[市场经济] 市场初始化完成')
  }

  return state
}

// ============================================================
// 核心：每日市场更新（供需-价格离散时间模型）
//
// 算法（来自经济学文档 8.1）：
//   供给 = 基础供给 × 供给冲击系数
//   需求 = 基础需求 × (当前价格/基准价格)^弹性系数
//   库存 = max(0, 库存 + 供给 - 需求 - 消耗率×库存)
//   价格 = 价格 × (1 - 调整系数 × (库存天数 - 目标天数)/目标天数)
//   价格变动限制在 ±每日涨跌停 以内
// ============================================================

function updateMarketDaily(level) {
  let state = initMarketIfNeeded(level)
  let settings = MARKET_CONFIG.market_settings
  let currentDay = Math.floor(level.dayTime / 24000)

  if (currentDay <= state.last_update_day) return

  let daysPassed = currentDay - state.last_update_day
  if (daysPassed > 30) daysPassed = 30

  for (let day = 0; day < daysPassed; day++) {
    for (let [itemId, itemState] of Object.entries(state.items)) {
      let config = MARKET_CONFIG.items[itemId]
      if (!config) continue

      let supply = config.base_supply_per_day * itemState.supply_shock
      let priceRatio = itemState.current_price / config.base_price
      let demand = config.base_demand_per_day * Math.pow(priceRatio, config.price_elasticity)
      demand = demand * itemState.demand_shock

      let decay = itemState.inventory * settings.decay_rate_per_day
      itemState.inventory = Math.max(0, itemState.inventory + supply - demand - decay)

      let avgDailyDemand = config.base_demand_per_day
      let inventoryDays = avgDailyDemand > 0 ? itemState.inventory / avgDailyDemand : 0

      let priceChange = -settings.price_adjustment_speed * (inventoryDays - settings.target_inventory_days) / settings.target_inventory_days
      priceChange = Math.max(-settings.daily_price_change_limit, Math.min(settings.daily_price_change_limit, priceChange))

      itemState.current_price = itemState.current_price * (1 + priceChange)

      let minPrice = config.base_price * settings.min_price_ratio
      let maxPrice = config.base_price * settings.max_price_ratio
      itemState.current_price = Math.max(minPrice, Math.min(maxPrice, itemState.current_price))

      itemState.price_history.push(itemState.current_price)
      if (itemState.price_history.length > 30) {
        itemState.price_history.shift()
      }

      itemState.supply_shock = settings.supply_shock_min + Math.random() * (settings.supply_shock_max - settings.supply_shock_min)
      itemState.demand_shock = 0.9 + Math.random() * 0.2
    }
  }

  state.last_update_day = currentDay
  saveMarketState(level, state)
}

// ============================================================
// 玩家交易（买/卖）
// ============================================================

function buyItem(player, itemId, quantity) {
  let level = player.level
  let state = initMarketIfNeeded(level)
  let itemState = state.items[itemId]
  let config = MARKET_CONFIG.items[itemId]

  if (!itemState || !config) return { success: false, message: '该物品不在市场交易列表中' }

  let currentEra = player.persistentData.getInt('civilization_era') || 0
  if (currentEra < config.era) {
    return { success: false, message: `该物品属于${ERA_NAMES[config.era]}，时代未解锁！` }
  }

  if (itemState.inventory < quantity) {
    return { success: false, message: `库存不足！当前库存：${Math.floor(itemState.inventory)}` }
  }

  let totalPrice = Math.ceil(itemState.current_price * quantity * 1.1)
  let playerCoins = player.persistentData.getInt('coins') || 0

  if (playerCoins < totalPrice) {
    return { success: false, message: `金币不足！需要 ${totalPrice} 金币，你有 ${playerCoins} 金币` }
  }

  player.persistentData.putInt('coins', playerCoins - totalPrice)
  itemState.inventory -= quantity

  let demandShock = 1 + quantity * 0.01
  itemState.demand_shock = Math.min(itemState.demand_shock * demandShock, 2.0)

  saveMarketState(level, state)

  player.give(itemId, quantity)

  return {
    success: true,
    message: `购买成功！花费 ${totalPrice} 金币，获得 ${quantity} 个 ${itemId}`,
    totalPrice: totalPrice,
    quantity: quantity
  }
}

function sellItem(player, itemId, quantity) {
  let level = player.level
  let state = initMarketIfNeeded(level)
  let itemState = state.items[itemId]
  let config = MARKET_CONFIG.items[itemId]

  if (!itemState || !config) return { success: false, message: '该物品不在市场交易列表中' }

  let currentEra = player.persistentData.getInt('civilization_era') || 0
  if (currentEra < config.era) {
    return { success: false, message: `该物品属于${ERA_NAMES[config.era]}，时代未解锁！` }
  }

  let playerItem = player.inventory.find(itemId)
  if (!playerItem || playerItem.count < quantity) {
    return { success: false, message: `物品不足！你只有 ${playerItem ? playerItem.count : 0} 个` }
  }

  let sellPrice = Math.floor(itemState.current_price * quantity * 0.85)
  let playerCoins = player.persistentData.getInt('coins') || 0

  player.inventory.clear(itemId, quantity)
  player.persistentData.putInt('coins', playerCoins + sellPrice)

  itemState.inventory += quantity

  let supplyShock = 1 + quantity * 0.005
  itemState.supply_shock = Math.min(itemState.supply_shock * supplyShock, 2.0)

  saveMarketState(level, state)

  return {
    success: true,
    message: `出售成功！获得 ${sellPrice} 金币，出售 ${quantity} 个 ${itemId}`,
    totalPrice: sellPrice,
    quantity: quantity
  }
}

// ============================================================
// 获取物品价格和库存信息
// ============================================================

function getItemInfo(level, itemId) {
  let state = initMarketIfNeeded(level)
  let itemState = state.items[itemId]
  let config = MARKET_CONFIG.items[itemId]

  if (!itemState || !config) return null

  let priceRatio = itemState.current_price / config.base_price
  let trend = 'stable'
  if (itemState.price_history.length >= 3) {
    let recent = itemState.price_history.slice(-3)
    let avg = recent.reduce((a, b) => a + b, 0) / recent.length
    if (itemState.current_price > avg * 1.02) trend = 'rising'
    else if (itemState.current_price < avg * 0.98) trend = 'falling'
  }

  return {
    itemId: itemId,
    current_price: Math.ceil(itemState.current_price),
    base_price: config.base_price,
    buy_price: Math.ceil(itemState.current_price * 1.1),
    sell_price: Math.floor(itemState.current_price * 0.85),
    inventory: Math.floor(itemState.inventory),
    price_ratio: priceRatio.toFixed(2),
    trend: trend,
    category: config.category,
    era: config.era,
    faction: config.faction,
    elasticity: config.price_elasticity
  }
}

function getAvailableItems(level, playerEra) {
  let state = initMarketIfNeeded(level)
  let result = []

  for (let itemId of Object.keys(state.items)) {
    let info = getItemInfo(level, itemId)
    if (info && info.era <= playerEra) {
      result.push(info)
    }
  }

  return result.sort((a, b) => a.era - b.era || a.current_price - b.current_price)
}

// ============================================================
// 事件处理
// ============================================================

LevelEvents.tick(event => {
  let level = event.level
  if (level.isClientSide) return

  if (level.dayTime % 24000 === 0) {
    updateMarketDaily(level)
  }
})

PlayerEvents.loggedIn(event => {
  let player = event.player
  let level = player.level

  initMarketIfNeeded(level)

  if (!player.persistentData.contains('coins')) {
    player.persistentData.putInt('coins', 50)
    player.tell(Text.of('[市场经济] ').gold().append(Text.of('初始资金 50 金币已到账！').white()))
  }
})

// ============================================================
// 市场命令系统
// ============================================================

ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event

  event.register(
    Commands.literal('market')
      .then(Commands.literal('list')
        .executes(ctx => {
          let player = ctx.source.player
          let level = player.level
          let currentEra = player.persistentData.getInt('civilization_era') || 0
          let items = getAvailableItems(level, currentEra)

          player.tell(Text.of('=== 市场行情 ===').gold())
          for (let info of items) {
            let trendIcon = info.trend === 'rising' ? '📈' : info.trend === 'falling' ? '📉' : '➡️'
            let eraName = ERA_NAMES[info.era] || '蛮荒'
            player.tell(Text.of(`${trendIcon} ${info.itemId}`).white()
              .append(Text.of(`  买:${info.buy_price} 卖:${info.sell_price}`).aqua())
              .append(Text.of(`  库:${info.inventory}`).gray())
              .append(Text.of(`  [${eraName}]`).yellow()))
          }
          player.tell(Text.of('使用 /market buy <物品id> <数量> 购买').gray())
          player.tell(Text.of('使用 /market sell <物品id> <数量> 出售').gray())
          player.tell(Text.of(`你的金币：${player.persistentData.getInt('coins') || 0}`).gold())

          return 1
        })
      )
      .then(Commands.literal('buy')
        .then(Commands.argument('item', Arguments.STRING.create(ctx))
          .then(Commands.argument('amount', Arguments.INTEGER.create(ctx))
            .executes(ctx => {
              let player = ctx.source.player
              let itemId = Arguments.STRING.getResult(ctx, 'item')
              let amount = Arguments.INTEGER.getResult(ctx, 'amount')

              let result = buyItem(player, itemId, amount)
              player.tell(Text.of(result.message).result.success ? Text.green() : Text.red()))

              return result.success ? 1 : 0
            })
          )
        )
      )
      .then(Commands.literal('sell')
        .then(Commands.argument('item', Arguments.STRING.create(ctx))
          .then(Commands.argument('amount', Arguments.INTEGER.create(ctx))
            .executes(ctx => {
              let player = ctx.source.player
              let itemId = Arguments.STRING.getResult(ctx, 'item')
              let amount = Arguments.INTEGER.getResult(ctx, 'amount')

              let result = sellItem(player, itemId, amount)
              player.tell(Text.of(result.message).result.success ? Text.green() : Text.red()))

              return result.success ? 1 : 0
            })
          )
        )
      )
  )
})

// ============================================================
// 导出到全局
// ============================================================

global.MarketSystem = {
  buyItem: buyItem,
  sellItem: sellItem,
  getItemInfo: getItemInfo,
  getAvailableItems: getAvailableItems,
  updateMarketDaily: updateMarketDaily,
  initMarketIfNeeded: initMarketIfNeeded
}
