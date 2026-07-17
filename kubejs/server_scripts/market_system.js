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

const CATEGORY_NAMES = {
  'food': '食物',
  'mineral': '矿物',
  'gem': '宝石',
  'tool': '工具',
  'weapon': '武器',
  'armor': '防具',
  'magic': '魔法',
  'rare': '稀有',
  'legendary': '传说',
  'collectible': '收藏',
  'nature': '自然',
  'misc': '杂项'
}

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

          return showMarketPage(player, items, 1, null, 'price_asc')
        })
        .then(Commands.argument('page', Arguments.INTEGER.create(ctx))
          .executes(ctx => {
            let player = ctx.source.player
            let level = player.level
            let currentEra = player.persistentData.getInt('civilization_era') || 0
            let page = Arguments.INTEGER.getResult(ctx, 'page')
            let items = getAvailableItems(level, currentEra)

            return showMarketPage(player, items, page, null, 'price_asc')
          })
        )
      )
      .then(Commands.literal('category')
        .then(Commands.argument('cat', Arguments.STRING.create(ctx))
          .executes(ctx => {
            let player = ctx.source.player
            let level = player.level
            let currentEra = player.persistentData.getInt('civilization_era') || 0
            let cat = Arguments.STRING.getResult(ctx, 'cat')
            let items = getAvailableItems(level, currentEra)
            let filtered = items.filter(i => i.category === cat)

            return showMarketPage(player, filtered, 1, cat, 'price_asc')
          })
          .then(Commands.argument('page', Arguments.INTEGER.create(ctx))
            .executes(ctx => {
              let player = ctx.source.player
              let level = player.level
              let currentEra = player.persistentData.getInt('civilization_era') || 0
              let cat = Arguments.STRING.getResult(ctx, 'cat')
              let page = Arguments.INTEGER.getResult(ctx, 'page')
              let items = getAvailableItems(level, currentEra)
              let filtered = items.filter(i => i.category === cat)

              return showMarketPage(player, filtered, page, cat, 'price_asc')
            })
          )
        )
      )
      .then(Commands.literal('search')
        .then(Commands.argument('keyword', Arguments.STRING.create(ctx))
          .executes(ctx => {
            let player = ctx.source.player
            let level = player.level
            let currentEra = player.persistentData.getInt('civilization_era') || 0
            let keyword = Arguments.STRING.getResult(ctx, 'keyword').toLowerCase()
            let items = getAvailableItems(level, currentEra)
            let filtered = items.filter(i => i.itemId.toLowerCase().includes(keyword))

            return showMarketPage(player, filtered, 1, `搜索:${keyword}`, 'price_asc')
          })
        )
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
      .then(Commands.literal('categories')
        .executes(ctx => {
          let player = ctx.source.player
          let level = player.level
          let currentEra = player.persistentData.getInt('civilization_era') || 0
          let items = getAvailableItems(level, currentEra)

          let catCounts = {}
          for (let item of items) {
            catCounts[item.category] = (catCounts[item.category] || 0) + 1
          }

          player.tell(Text.of('=== 市场分类 ===').gold())
          for (let [cat, count] of Object.entries(catCounts)) {
            let catName = CATEGORY_NAMES[cat] || cat
            player.tell(Text.of(`  ${catName} (${cat}): ${count} 种`).white()
              .append(Text.of(`  [/market category ${cat}]`).gray()))
          }
          player.tell(Text.of(`你的金币：${player.persistentData.getInt('coins') || 0}`).gold())

          return 1
        })
      )
      .then(Commands.literal('info')
        .then(Commands.argument('item', Arguments.STRING.create(ctx))
          .executes(ctx => {
            let player = ctx.source.player
            let level = player.level
            let itemId = Arguments.STRING.getResult(ctx, 'item')
            let info = getItemInfo(level, itemId)

            if (!info) {
              player.tell(Text.of(`未找到物品：${itemId}`).red())
              return 0
            }

            let trendText = info.trend === 'rising' ? '📈 上涨' : info.trend === 'falling' ? '📉 下跌' : '➡️ 稳定'
            let eraName = ERA_NAMES[info.era] || '蛮荒'
            let catName = CATEGORY_NAMES[info.category] || info.category

            player.tell(Text.of(`=== ${info.itemId} ===`).gold())
            player.tell(Text.of(`分类：${catName}`).white())
            player.tell(Text.of(`时代：${eraName}`).yellow())
            player.tell(Text.of(`买入价：${info.buy_price} 金币`).aqua())
            player.tell(Text.of(`卖出价：${info.sell_price} 金币`).green())
            player.tell(Text.of(`基准价：${info.base_price} 金币`).gray())
            player.tell(Text.of(`价格比：${info.price_ratio}x`).white())
            player.tell(Text.of(`趋势：${trendText}`).white())
            player.tell(Text.of(`库存：${info.inventory}`).gray())
            player.tell(Text.of(`价格弹性：${info.elasticity}`).gray())

            return 1
          })
        )
      )
  )
})

function showMarketPage(player, items, page, title, sortBy) {
  let pageSize = 10
  let totalPages = Math.ceil(items.length / pageSize)
  if (page < 1) page = 1
  if (page > totalPages) page = totalPages

  let sorted = [...items]
  if (sortBy === 'price_asc') {
    sorted.sort((a, b) => a.buy_price - b.buy_price)
  } else if (sortBy === 'price_desc') {
    sorted.sort((a, b) => b.buy_price - a.buy_price)
  }

  let start = (page - 1) * pageSize
  let end = start + pageSize
  let pageItems = sorted.slice(start, end)

  let titleText = title ? `=== 市场行情 - ${title} ===` : '=== 市场行情 ==='
  player.tell(Text.of(titleText).gold())
  player.tell(Text.of(`第 ${page}/${totalPages} 页  共 ${items.length} 种`).gray())

  for (let info of pageItems) {
    let trendIcon = info.trend === 'rising' ? '📈' : info.trend === 'falling' ? '📉' : '➡️'
    let catName = CATEGORY_NAMES[info.category] || info.category
    player.tell(Text.of(`${trendIcon} ${info.itemId}`).white()
      .append(Text.of(`  买:${info.buy_price}`).aqua())
      .append(Text.of(` 卖:${info.sell_price}`).green())
      .append(Text.of(`  库:${info.inventory}`).gray())
      .append(Text.of(`  [${catName}]`).yellow()))
  }

  player.tell(Text.of('--------------------').gray())
  player.tell(Text.of('命令：').white()
    .append(Text.of('/market list [页数] ').aqua())
    .append(Text.of('/market category <分类> ').aqua())
    .append(Text.of('/market search <关键词>').aqua()))
  player.tell(Text.of('交易：').white()
    .append(Text.of('/market buy <物品> <数量> ').green())
    .append(Text.of('/market sell <物品> <数量> ').red())
    .append(Text.of('/market info <物品>').gray()))
  player.tell(Text.of(`你的金币：${player.persistentData.getInt('coins') || 0}`).gold())

  return 1
}

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
