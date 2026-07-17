// ============================================================
// 文明纪元 - JEI 物品显示（时代锁 + 蓝图系统）
// 有蓝图的物品即使时代没到也能显示
// ============================================================

const ERAS = {
  PRIMITIVE_WILDERNESS: 0,
  PRIMITIVE_AGE: 1,
  SLASH_AND_BURN: 2,
  IRON_FORGING: 3,
  STEAM_REVOLUTION: 4,
  ELECTRIC_DISCOVERY: 5,
  INFORMATION_LEGEND: 6,
  STARFARER: 7
}

const ERA_NAMES = [
  '蛮荒纪元',
  '原始时代',
  '刀耕火种',
  '炼造铁器',
  '蒸汽革命',
  '发现电气',
  '信息传说',
  '星际远征'
]

// ============================================================
// 物品-时代对应表（与 server 端保持一致）
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
  'minecraft:wheat',
  'minecraft:wheat_seeds',
  'minecraft:bread',
  'minecraft:carrot',
  'minecraft:potato',
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
  'minecraft:iron_ore',
  'minecraft:deepslate_iron_ore',
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
  'minecraft:gold_ore',
  'minecraft:deepslate_gold_ore',
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
  'minecraft:diamond_ore',
  'minecraft:deepslate_diamond_ore',
  'minecraft:redstone',
  'minecraft:redstone_block',
  'minecraft:redstone_ore',
  'minecraft:deepslate_redstone_ore',
  'minecraft:redstone_repeater',
  'minecraft:redstone_comparator',
  'minecraft:daylight_detector',
  'minecraft:note_block',
  'minecraft:lapis_lazuli',
  'minecraft:lapis_block',
  'minecraft:lapis_ore',
  'minecraft:deepslate_lapis_ore'
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
  'minecraft:ancient_debris',
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
  'minecraft:firework_star',
  'minecraft:shulker_shell',
  'minecraft:shulker_box'
].forEach(id => registerItemEra(id, ERAS.STARFARER))

// ============================================================
// JEI 显示控制
// ============================================================

JEIAdditionEvents.removeItems(event => {
  let player = event.player
  if (!player) return

  let currentEra = player.persistentData.getInt('civilization_era') || 0
  let unlockedBlueprints = player.persistentData.get('unlocked_blueprints') || []

  for (let [itemId, itemEra] of Object.entries(ITEM_ERA_MAP)) {
    if (itemEra > currentEra && !unlockedBlueprints.includes(itemId)) {
      event.remove(itemId)
    }
  }
})

// ============================================================
// JEI 分类隐藏
// ============================================================

JEIAdditionEvents.hideCategories(event => {
  let player = event.player
  if (!player) return

  let currentEra = player.persistentData.getInt('civilization_era') || 0

  if (currentEra < ERAS.STEAM_REVOLUTION) {
    try { event.hide('create:mechanical_crafting') } catch (e) {}
  }
  if (currentEra < ERAS.ELECTRIC_DISCOVERY) {
    try { event.hide('mekanism:enriching') } catch (e) {}
    try { event.hide('mekanism:crushing') } catch (e) {}
    try { event.hide('thermal:pulverizer') } catch (e) {}
    try { event.hide('thermal:furnace') } catch (e) {}
  }
})
