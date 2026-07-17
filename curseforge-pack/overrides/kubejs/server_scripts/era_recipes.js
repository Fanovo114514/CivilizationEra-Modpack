// ============================================================
// 文明纪元 - 配方时代锁 + 蓝图系统
// 物品可用条件：时代解锁 OR 蓝图解锁
// ============================================================

const { ERAS, ERA_NAMES, isEraUnlocked, isBlueprintUnlocked, unlockBlueprint } = global.CivilizationEra

// ============================================================
// 物品-时代对应表（该物品属于哪个时代）
// ============================================================

const ITEM_ERA_MAP = {}

function registerItemEra(itemId, era) {
  ITEM_ERA_MAP[itemId] = era
}

// 原始时代
[
  'minecraft:crafting_table',
  'minecraft:furnace',
  'minecraft:wooden_pickaxe',
  'minecraft:wooden_axe',
  'minecraft:wooden_shovel',
  'minecraft:wooden_sword',
  'minecraft:wooden_hoe',
  'minecraft:stick',
  'minecraft:planks',
  'minecraft:fence',
  'minecraft:fence_gate'
].forEach(id => registerItemEra(id, ERAS.PRIMITIVE_AGE))

// 刀耕火种
[
  'minecraft:stone_pickaxe',
  'minecraft:stone_axe',
  'minecraft:stone_shovel',
  'minecraft:stone_sword',
  'minecraft:stone_hoe',
  'minecraft:wheat_seeds',
  'minecraft:bread',
  'minecraft:farmland',
  'minecraft:water_bucket',
  'minecraft:brick',
  'minecraft:clay_ball',
  'minecraft:flower_pot'
].forEach(id => registerItemEra(id, ERAS.SLASH_AND_BURN))

// 炼造铁器
[
  'minecraft:iron_pickaxe',
  'minecraft:iron_axe',
  'minecraft:iron_shovel',
  'minecraft:iron_sword',
  'minecraft:iron_hoe',
  'minecraft:iron_ingot',
  'minecraft:iron_block',
  'minecraft:bucket',
  'minecraft:shears',
  'minecraft:shield',
  'minecraft:minecart',
  'minecraft:rail',
  'minecraft:powered_rail',
  'minecraft:detector_rail',
  'minecraft:activator_rail'
].forEach(id => registerItemEra(id, ERAS.IRON_FORGING))

// 蒸汽革命
[
  'minecraft:gold_pickaxe',
  'minecraft:gold_axe',
  'minecraft:gold_shovel',
  'minecraft:gold_sword',
  'minecraft:gold_hoe',
  'minecraft:gold_ingot',
  'minecraft:gold_block',
  'minecraft:hopper',
  'minecraft:dispenser',
  'minecraft:dropper',
  'minecraft:observer',
  'minecraft:piston',
  'minecraft:sticky_piston'
].forEach(id => registerItemEra(id, ERAS.STEAM_REVOLUTION))

// 发现电气
[
  'minecraft:diamond_pickaxe',
  'minecraft:diamond_axe',
  'minecraft:diamond_shovel',
  'minecraft:diamond_sword',
  'minecraft:diamond_hoe',
  'minecraft:diamond',
  'minecraft:diamond_block',
  'minecraft:redstone',
  'minecraft:redstone_block',
  'minecraft:redstone_repeater',
  'minecraft:redstone_comparator',
  'minecraft:daylight_detector',
  'minecraft:note_block'
].forEach(id => registerItemEra(id, ERAS.ELECTRIC_DISCOVERY))

// 信息传说
[
  'minecraft:netherite_pickaxe',
  'minecraft:netherite_axe',
  'minecraft:netherite_shovel',
  'minecraft:netherite_sword',
  'minecraft:netherite_hoe',
  'minecraft:netherite_ingot',
  'minecraft:netherite_scrap',
  'minecraft:netherite_block',
  'minecraft:beacon',
  'minecraft:conduit',
  'minecraft:ender_eye',
  'minecraft:ender_pearl'
].forEach(id => registerItemEra(id, ERAS.INFORMATION_LEGEND))

// 星际远征
[
  'minecraft:nether_star',
  'minecraft:dragon_egg',
  'minecraft:elytra',
  'minecraft:firework_rocket',
  'minecraft:firework_star'
].forEach(id => registerItemEra(id, ERAS.STARFARER))

// ============================================================
// 核心逻辑：物品是否可用（时代解锁 OR 蓝图解锁）
// ============================================================

function isItemAvailable(player, itemId) {
  let itemEra = ITEM_ERA_MAP[itemId]
  if (itemEra === undefined) return true

  let currentEra = player.persistentData.getInt('civilization_era') || 0
  if (currentEra >= itemEra) return true

  return isBlueprintUnlocked(player, itemId)
}

// ============================================================
// 配方事件 - 阻止未解锁物品的合成
// ============================================================

ServerEvents.recipes(event => {
  // 注意：KubeJS 的 recipes 事件在服务器启动时执行一次，
  // 玩家级别的配方锁需要用 PlayerEvents.crafting 或其他方式
})

// 玩家合成时检查解锁状态
PlayerEvents.crafted(event => {
  let player = event.player
  let item = event.item
  let itemId = item.id

  if (!isItemAvailable(player, itemId)) {
    event.cancel()
    let itemEra = ITEM_ERA_MAP[itemId]
    let eraName = ERA_NAMES[itemEra] || '未知'
    player.tell(Text.of(`[未解锁] 该物品属于${eraName}时代，先搞到蓝图或者推进时代吧！`).red())
  }
})

// ============================================================
// 时代推进时解锁该时代所有配方
// ============================================================

function checkAndUnlockRecipes(player) {
  let currentEra = player.persistentData.getInt('civilization_era') || 0
  let unlockedRecipes = player.persistentData.get('unlocked_recipes') || []

  for (let [itemId, era] of Object.entries(ITEM_ERA_MAP)) {
    if (era <= currentEra && !unlockedRecipes.includes(itemId)) {
      try {
        player.award(itemId)
      } catch (e) {}
      unlockedRecipes.push(itemId)
    }
  }

  player.persistentData.put('unlocked_recipes', unlockedRecipes)
}

global.checkAndUnlockRecipes = checkAndUnlockRecipes
global.isItemAvailable = isItemAvailable
global.ITEM_ERA_MAP = ITEM_ERA_MAP
