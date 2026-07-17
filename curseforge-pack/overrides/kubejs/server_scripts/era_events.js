// ============================================================
// 文明纪元 - 纪元解锁事件 & 蓝图系统 & 怪物进化系统
// ============================================================

const { ERAS, ERA_NAMES, setCurrentEra, unlockBlueprint } = global.CivilizationEra

// ============================================================
// 怪物进化系统 - 每个时代的怪物强度
// ============================================================

const MONSTER_EVOLUTION = {
  [ERAS.PRIMITIVE_WILDERNESS]: {
    name: '路边一条',
    spawnMultiplier: 1.5,
    healthMultiplier: 0.8,
    damageMultiplier: 0.7,
    speedMultiplier: 0.9,
    hasArmor: false,
    hasSpecialAbility: false,
    description: '数量多，弱鸡'
  },
  [ERAS.PRIMITIVE_AGE]: {
    name: '普通人',
    spawnMultiplier: 1.0,
    healthMultiplier: 1.0,
    damageMultiplier: 1.0,
    speedMultiplier: 1.0,
    hasArmor: false,
    hasSpecialAbility: true,
    description: '有特殊能力的普通怪物'
  },
  [ERAS.SLASH_AND_BURN]: {
    name: '精英人士',
    spawnMultiplier: 0.9,
    healthMultiplier: 1.5,
    damageMultiplier: 1.3,
    speedMultiplier: 1.1,
    hasArmor: false,
    hasSpecialAbility: true,
    isMiniBoss: true,
    description: '小 Boss 级别，单挑要小心'
  },
  [ERAS.IRON_FORGING]: {
    name: '称霸一方',
    spawnMultiplier: 0.8,
    healthMultiplier: 2.0,
    damageMultiplier: 1.6,
    speedMultiplier: 1.2,
    hasArmor: true,
    armorLevel: 'iron',
    hasSpecialAbility: true,
    hasTactics: true,
    description: '穿护甲、拿武器、会战术'
  },
  [ERAS.STEAM_REVOLUTION]: {
    name: '改造体',
    spawnMultiplier: 0.7,
    healthMultiplier: 2.5,
    damageMultiplier: 1.8,
    speedMultiplier: 1.3,
    hasArmor: true,
    armorLevel: 'mechanical',
    hasSpecialAbility: true,
    isCyborg: true,
    description: '半机械怪物，蒸汽改造'
  },
  [ERAS.ELECTRIC_DISCOVERY]: {
    name: '电子级别',
    spawnMultiplier: 0.6,
    healthMultiplier: 3.0,
    damageMultiplier: 2.0,
    speedMultiplier: 1.4,
    hasArmor: true,
    armorLevel: 'electric',
    hasSpecialAbility: true,
    hasEMAttack: true,
    description: '电磁攻击，能瘫痪设备'
  },
  [ERAS.INFORMATION_LEGEND]: {
    name: 'AI生命',
    spawnMultiplier: 0.5,
    healthMultiplier: 3.5,
    damageMultiplier: 2.2,
    speedMultiplier: 1.5,
    hasArmor: true,
    armorLevel: 'nano',
    hasSpecialAbility: true,
    canUsePlayerFacilities: true,
    isAI: true,
    description: '会利用玩家设施的AI'
  },
  [ERAS.STARFARER]: {
    name: '行星级别',
    spawnMultiplier: 0.3,
    healthMultiplier: 5.0,
    damageMultiplier: 3.0,
    speedMultiplier: 1.6,
    hasArmor: true,
    armorLevel: 'cosmic',
    hasSpecialAbility: true,
    isWorldBoss: true,
    description: '终极 Boss，行星级威胁'
  }
}

function getCurrentMonsterLevel(player) {
  let currentEra = player.persistentData.getInt('civilization_era') || 0
  return MONSTER_EVOLUTION[currentEra] || MONSTER_EVOLUTION[ERAS.PRIMITIVE_WILDERNESS]
}

// ============================================================
// 蓝图掉落表 - 不同途径能掉什么时代的蓝图
// ============================================================

const BLUEPRINT_POOL = {
  mining: {
    [ERAS.PRIMITIVE_AGE]: ['minecraft:stone_pickaxe', 'minecraft:stone_axe', 'minecraft:furnace'],
    [ERAS.SLASH_AND_BURN]: ['minecraft:copper_ingot', 'minecraft:brick', 'minecraft:shears'],
    [ERAS.IRON_FORGING]: ['minecraft:iron_pickaxe', 'minecraft:iron_sword', 'minecraft:iron_ingot', 'minecraft:shield'],
    [ERAS.STEAM_REVOLUTION]: ['minecraft:gold_ingot', 'minecraft:gold_pickaxe', 'minecraft:hopper', 'minecraft:piston'],
    [ERAS.ELECTRIC_DISCOVERY]: ['minecraft:redstone', 'minecraft:diamond', 'minecraft:lapis_lazuli', 'minecraft:redstone_repeater'],
    [ERAS.INFORMATION_LEGEND]: ['minecraft:netherite_ingot', 'minecraft:netherite_scrap', 'minecraft:ender_eye', 'minecraft:beacon'],
    [ERAS.STARFARER]: ['minecraft:elytra', 'minecraft:nether_star', 'minecraft:shulker_shell']
  },
  mob: {
    [ERAS.PRIMITIVE_AGE]: ['minecraft:stone_sword', 'minecraft:shield', 'minecraft:bow'],
    [ERAS.SLASH_AND_BURN]: ['minecraft:iron_sword', 'minecraft:chainmail_chestplate'],
    [ERAS.IRON_FORGING]: ['minecraft:iron_sword', 'minecraft:iron_chestplate', 'minecraft:crossbow'],
    [ERAS.STEAM_REVOLUTION]: ['minecraft:golden_sword', 'minecraft:golden_apple', 'minecraft:tnt'],
    [ERAS.ELECTRIC_DISCOVERY]: ['minecraft:diamond_sword', 'minecraft:diamond_chestplate', 'minecraft:ender_pearl'],
    [ERAS.INFORMATION_LEGEND]: ['minecraft:netherite_sword', 'minecraft:end_crystal', 'minecraft:firework_rocket'],
    [ERAS.STARFARER]: ['minecraft:elytra', 'minecraft:dragon_egg']
  },
  trading: {
    [ERAS.PRIMITIVE_AGE]: ['minecraft:bread', 'minecraft:fence', 'minecraft:fence_gate'],
    [ERAS.SLASH_AND_BURN]: ['minecraft:stone_pickaxe', 'minecraft:brick', 'minecraft:flower_pot'],
    [ERAS.IRON_FORGING]: ['minecraft:iron_ingot', 'minecraft:bucket', 'minecraft:minecart'],
    [ERAS.STEAM_REVOLUTION]: ['minecraft:gold_ingot', 'minecraft:clock', 'minecraft:compass'],
    [ERAS.ELECTRIC_DISCOVERY]: ['minecraft:redstone', 'minecraft:map', 'minecraft:book'],
    [ERAS.INFORMATION_LEGEND]: ['minecraft:diamond', 'minecraft:ender_eye', 'minecraft:experience_bottle'],
    [ERAS.STARFARER]: ['minecraft:elytra', 'minecraft:firework_rocket']
  }
}

function getNextEraForBlueprints(currentEra) {
  return currentEra + 1
}

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
    case ERAS.PRIMITIVE_AGE:
      canAdvance = checkPrimitiveAgeRequirements(player)
      break
    case ERAS.SLASH_AND_BURN:
      canAdvance = checkSlashAndBurnRequirements(player)
      break
    case ERAS.IRON_FORGING:
      canAdvance = checkIronForgingRequirements(player)
      break
    case ERAS.STEAM_REVOLUTION:
      canAdvance = checkSteamRequirements(player)
      break
    case ERAS.ELECTRIC_DISCOVERY:
      canAdvance = checkElectricRequirements(player)
      break
    case ERAS.INFORMATION_LEGEND:
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
    let monsterLevel = MONSTER_EVOLUTION[nextEra]
    if (monsterLevel) {
      player.tell(Text.of('[怪物进化] ').red().append(Text.of(`怪物进化为「${monsterLevel.name}」等级！`).white()))
    }
    return true
  }

  return false
}

function checkPrimitiveAgeRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasFlint = player.inventory.contains('minecraft:flint')
  return fragments >= 5 && hasFlint
}

function checkSlashAndBurnRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasCopper = player.inventory.contains('minecraft:copper_ingot')
  return fragments >= 20 && hasCopper
}

function checkIronForgingRequirements(player) {
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
    player.tell(Text.of('[文明纪元] ').gold().append(Text.of('欢迎来到文明纪元！你现在处于蛮荒纪元。').white()))
    player.tell(Text.of('[文明纪元] ').gold().append(Text.of('收集进化碎片来解锁新的纪元！').gray()))
    player.tell(Text.of('[文明纪元] ').gold().append(Text.of('挖矿、打怪、交易有机会获得蓝图，提前解锁物品！').aqua()))
    player.tell(Text.of('[怪物进化] ').red().append(Text.of('当前怪物等级：路边一条（数量多但很弱）').white()))
  }
})

// 打怪掉落进化碎片 + 概率掉蓝图 + 怪物属性动态调整
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

// 怪物生成时根据时代调整属性
EntityEvents.spawned(event => {
  let entity = event.entity
  let level = entity.level

  if (level.isClientSide) return
  if (!entity.isLiving()) return

  let type = entity.type
  let isHostile = type === 'minecraft:zombie' || type === 'minecraft:skeleton' ||
                   type === 'minecraft:spider' || type === 'minecraft:creeper' ||
                   type === 'minecraft:husk' || type === 'minecraft:stray' ||
                   type === 'minecraft:drowned' || type === 'minecraft:witch'

  if (!isHostile) return

  let players = level.players()
  if (players.length === 0) return

  let nearestPlayer = null
  let minDist = Infinity
  for (let p of players) {
    let d = p.distanceTo(entity)
    if (d < minDist) {
      minDist = d
      nearestPlayer = p
    }
  }

  if (!nearestPlayer) return

  let monsterLevel = getCurrentMonsterLevel(nearestPlayer)

  // 调整血量
  let baseHealth = entity.health
  entity.health = baseHealth * monsterLevel.healthMultiplier

  // 调整移速
  if (entity.getAttribute) {
    try {
      let speedAttr = entity.getAttribute('minecraft:generic.movement_speed')
      if (speedAttr) {
        speedAttr.baseValue = speedAttr.baseValue * monsterLevel.speedMultiplier
      }
    } catch (e) {}
  }

  // 给怪物穿护甲（炼造铁器及以后）
  if (monsterLevel.hasArmor) {
    try {
      if (monsterLevel.armorLevel === 'iron') {
        entity.setItemSlot('chest', Item.of('minecraft:iron_chestplate'))
        entity.setItemSlot('head', Item.of('minecraft:iron_helmet'))
        entity.setItemSlot('mainhand', Item.of('minecraft:iron_sword'))
      } else if (monsterLevel.armorLevel === 'mechanical') {
        entity.setItemSlot('chest', Item.of('minecraft:iron_chestplate'))
        entity.setItemSlot('head', Item.of('minecraft:iron_helmet'))
        entity.setItemSlot('mainhand', Item.of('minecraft:iron_pickaxe'))
        entity.setItemSlot('offhand', Item.of('minecraft:shield'))
      } else if (monsterLevel.armorLevel === 'electric' || monsterLevel.armorLevel === 'nano') {
        entity.setItemSlot('chest', Item.of('minecraft:diamond_chestplate'))
        entity.setItemSlot('head', Item.of('minecraft:diamond_helmet'))
        entity.setItemSlot('mainhand', Item.of('minecraft:diamond_sword'))
        entity.setItemSlot('offhand', Item.of('minecraft:shield'))
      } else if (monsterLevel.armorLevel === 'cosmic') {
        entity.setItemSlot('chest', Item.of('minecraft:netherite_chestplate'))
        entity.setItemSlot('head', Item.of('minecraft:netherite_helmet'))
        entity.setItemSlot('mainhand', Item.of('minecraft:netherite_sword'))
        entity.setItemSlot('offhand', Item.of('minecraft:shield'))
      }
    } catch (e) {}
  }
})

// 挖矿有概率掉蓝图
BlockEvents.broken(event => {
  let player = event.player
  if (!player || player.level.isClientSide) return

  let blockId = event.block.id

  let isOre = blockId.includes('_ore') || blockId.includes('ore') || blockId.includes('deepslate_')
  if (!isOre) return

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

  if (Math.random() < 0.1) {
    let bp = rollBlueprint(player, 'trading')
    if (bp) {
      unlockBlueprint(player, bp)
    }
  }
})

global.MONSTER_EVOLUTION = MONSTER_EVOLUTION
global.getCurrentMonsterLevel = getCurrentMonsterLevel
