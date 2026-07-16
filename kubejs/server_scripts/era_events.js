// ============================================================
// 文明纪元 - 纪元解锁事件 & 蓝图系统
// ============================================================

const { ERAS, ERA_NAMES, setCurrentEra, unlockBlueprint } = global.CivilizationEra

// ============================================================
// 蓝图掉落表 - 不同途径能掉什么时代的蓝图
// ============================================================

const BLUEPRINT_POOL = {
  mining: {
    [ERAS.STONE_AGE]: ['minecraft:stone_pickaxe', 'minecraft:stone_axe', 'minecraft:furnace'],
    [ERAS.BRONZE_AGE]: ['minecraft:copper_ingot', 'minecraft:brick', 'minecraft:shears'],
    [ERAS.IRON_AGE]: ['minecraft:iron_pickaxe', 'minecraft:iron_sword', 'minecraft:iron_ingot', 'minecraft:shield'],
    [ERAS.STEAM_REVOLUTION]: ['minecraft:gold_ingot', 'minecraft:gold_pickaxe', 'minecraft:hopper', 'minecraft:piston'],
    [ERAS.ELECTRIC_REVOLUTION]: ['minecraft:redstone', 'minecraft:diamond', 'minecraft:lapis_lazuli', 'minecraft:redstone_repeater'],
    [ERAS.INFORMATION_REVOLUTION]: ['minecraft:netherite_ingot', 'minecraft:netherite_scrap', 'minecraft:ender_eye', 'minecraft:beacon'],
    [ERAS.STARFARER]: ['minecraft:elytra', 'minecraft:nether_star', 'minecraft:shulker_shell']
  },
  mob: {
    [ERAS.STONE_AGE]: ['minecraft:stone_sword', 'minecraft:shield', 'minecraft:bow'],
    [ERAS.BRONZE_AGE]: ['minecraft:iron_sword', 'minecraft:chainmail_chestplate'],
    [ERAS.IRON_AGE]: ['minecraft:iron_sword', 'minecraft:iron_chestplate', 'minecraft:crossbow'],
    [ERAS.STEAM_REVOLUTION]: ['minecraft:golden_sword', 'minecraft:golden_apple', 'minecraft:tnt'],
    [ERAS.ELECTRIC_REVOLUTION]: ['minecraft:diamond_sword', 'minecraft:diamond_chestplate', 'minecraft:ender_pearl'],
    [ERAS.INFORMATION_REVOLUTION]: ['minecraft:netherite_sword', 'minecraft:end_crystal', 'minecraft:firework_rocket'],
    [ERAS.STARFARER]: ['minecraft:elytra', 'minecraft:dragon_egg']
  },
  trading: {
    [ERAS.STONE_AGE]: ['minecraft:bread', 'minecraft:fence', 'minecraft:fence_gate'],
    [ERAS.BRONZE_AGE]: ['minecraft:stone_pickaxe', 'minecraft:brick', 'minecraft:flower_pot'],
    [ERAS.IRON_AGE]: ['minecraft:iron_ingot', 'minecraft:bucket', 'minecraft:minecart'],
    [ERAS.STEAM_REVOLUTION]: ['minecraft:gold_ingot', 'minecraft:clock', 'minecraft:compass'],
    [ERAS.ELECTRIC_REVOLUTION]: ['minecraft:redstone', 'minecraft:map', 'minecraft:book'],
    [ERAS.INFORMATION_REVOLUTION]: ['minecraft:diamond', 'minecraft:ender_eye', 'minecraft:experience_bottle'],
    [ERAS.STARFARER]: ['minecraft:elytra', 'minecraft:firework_rocket']
  }
}

// 获取下一个时代的索引（蓝图能掉未来多少时代的）
function getNextEraForBlueprints(currentEra) {
  return currentEra + 1
}

// 从池子随机选一个蓝图
function rollBlueprint(player, poolType) {
  let currentEra = player.persistentData.getInt('civilization_era') || 0
  let nextEra = getNextEraForBlueprints(currentEra)

  if (nextEra >= ERA_NAMES.length) return null

  let pool = BLUEPRINT_POOL[poolType][nextEra]
  if (!pool || pool.length === 0) return null

  return pool[Math.floor(Math.random() * pool.length)]
}

// ============================================================
// 纪元推进检查
// ============================================================

function checkEraAdvancement(player) {
  let currentEra = player.persistentData.getInt('civilization_era') || 0
  let nextEra = currentEra + 1

  if (nextEra >= ERA_NAMES.length) return false

  let canAdvance = false

  switch (nextEra) {
    case ERAS.STONE_AGE:
      canAdvance = checkStoneAgeRequirements(player)
      break
    case ERAS.BRONZE_AGE:
      canAdvance = checkBronzeAgeRequirements(player)
      break
    case ERAS.IRON_AGE:
      canAdvance = checkIronAgeRequirements(player)
      break
    case ERAS.STEAM_REVOLUTION:
      canAdvance = checkSteamRequirements(player)
      break
    case ERAS.ELECTRIC_REVOLUTION:
      canAdvance = checkElectricRequirements(player)
      break
    case ERAS.INFORMATION_REVOLUTION:
      canAdvance = checkInformationRequirements(player)
      break
    case ERAS.STARFARER:
      canAdvance = checkStarfarerRequirements(player)
      break
  }

  if (canAdvance) {
    setCurrentEra(player, nextEra)
    if (global.checkAndUnlockRecipes) {
      global.checkAndUnlockRecipes(player)
    }
    return true
  }

  return false
}

function checkStoneAgeRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasFlint = player.inventory.contains('minecraft:flint')
  return fragments >= 5 && hasFlint
}

function checkBronzeAgeRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasCopper = player.inventory.contains('minecraft:copper_ingot')
  return fragments >= 20 && hasCopper
}

function checkIronAgeRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasIron = player.inventory.contains('minecraft:iron_ingot')
  return fragments >= 50 && hasIron
}

function checkSteamRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasIronBlock = player.inventory.contains('minecraft:iron_block')
  let hasFurnace = player.inventory.contains('minecraft:furnace')
  return fragments >= 100 && hasIronBlock && hasFurnace
}

function checkElectricRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasRedstone = player.inventory.contains('minecraft:redstone')
  let hasLapis = player.inventory.contains('minecraft:lapis_lazuli')
  return fragments >= 200 && hasRedstone && hasLapis
}

function checkInformationRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasDiamond = player.inventory.contains('minecraft:diamond')
  let hasGold = player.inventory.contains('minecraft:gold_ingot')
  return fragments >= 400 && hasDiamond && hasGold
}

function checkStarfarerRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasNetherite = player.inventory.contains('minecraft:netherite_ingot')
  let hasEnderEye = player.inventory.contains('minecraft:ender_eye')
  return fragments >= 800 && hasNetherite && hasEnderEye
}

// ============================================================
// 事件处理
// ============================================================

PlayerEvents.tick(event => {
  let player = event.player
  if (player.level.isClientSide) return

  if (player.tickCount % 100 === 0) {
    checkEraAdvancement(player)
  }
})

PlayerEvents.loggedIn(event => {
  let player = event.player
  if (!player.persistentData.contains('civilization_era')) {
    player.persistentData.putInt('civilization_era', ERAS.PRIMITIVE_WILDERNESS)
    player.persistentData.putInt('evolution_fragments', 0)
    player.persistentData.put('unlocked_blueprints', [])
    player.tell(Text.of('[文明纪元] ').gold().append(Text.of('欢迎来到文明纪元！你现在处于蛮荒时代。').white()))
    player.tell(Text.of('[文明纪元] ').gold().append(Text.of('收集进化碎片来解锁新的纪元！').gray()))
    player.tell(Text.of('[文明纪元] ').gold().append(Text.of('挖矿、打怪、交易有机会获得蓝图，提前解锁物品！').aqua()))
  }
})

// 打怪掉落进化碎片 + 概率掉蓝图
EntityEvents.death(event => {
  let entity = event.entity
  let source = event.source
  let killer = source.actual

  if (!killer || !killer.player) return

  let player = killer

  if (entity.type === 'minecraft:zombie' || entity.type === 'minecraft:skeleton' ||
      entity.type === 'minecraft:spider' || entity.type === 'minecraft:creeper') {
    let currentEra = player.persistentData.getInt('civilization_era') || 0
    let fragmentAmount = 1 + currentEra

    let currentFragments = player.persistentData.getInt('evolution_fragments') || 0
    player.persistentData.putInt('evolution_fragments', currentFragments + fragmentAmount)

    player.tell(Text.of(`获得 ${fragmentAmount} 个进化碎片`).aqua())

    // 5% 概率掉落怪物蓝图
    if (Math.random() < 0.05) {
      let bp = rollBlueprint(player, 'mob')
      if (bp) {
        unlockBlueprint(player, bp)
      }
    }
  }
})

// 挖矿有概率掉蓝图
BlockEvents.broken(event => {
  let player = event.player
  if (!player || player.level.isClientSide) return

  let blockId = event.block.id

  // 只有矿石有概率掉蓝图
  let isOre = blockId.includes('_ore') || blockId.includes('ore') || blockId.includes('deepslate_')
  if (!isOre) return

  // 3% 概率掉落挖矿蓝图
  if (Math.random() < 0.03) {
    let bp = rollBlueprint(player, 'mining')
    if (bp) {
      unlockBlueprint(player, bp)
    }
  }
})

// 村民交易有概率掉蓝图
EntityEvents.takeItem(event => {
  let entity = event.entity
  let item = event.item
  let player = event.player

  if (!player || !entity || entity.type !== 'minecraft:villager') return

  // 10% 概率掉落交易蓝图
  if (Math.random() < 0.1) {
    let bp = rollBlueprint(player, 'trading')
    if (bp) {
      unlockBlueprint(player, bp)
    }
  }
})
