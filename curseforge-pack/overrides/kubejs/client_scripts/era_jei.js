// ============================================================
// 文明纪元 - 物品时代锁
// 未解锁纪元的物品无法在JEI中查看和使用
// ============================================================

const { ERAS } = global.CivilizationEra

const ITEM_ERA_MAP = {
  [ERAS.PRIMITIVE_WILDERNESS]: [],
  [ERAS.PRIMITIVE]: [
    'minecraft:crafting_table',
    'minecraft:furnace',
    'minecraft:wooden_pickaxe',
    'minecraft:wooden_axe',
    'minecraft:wooden_shovel',
    'minecraft:wooden_sword',
    'minecraft:wooden_hoe',
    'minecraft:fence',
    'minecraft:fence_gate'
  ],
  [ERAS.AGRICULTURAL]: [
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
  ],
  [ERAS.IRON]: [
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
  ],
  [ERAS.STEAM]: [
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
  ],
  [ERAS.ELECTRIC]: [
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
  ],
  [ERAS.INFORMATION]: [
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
  ],
  [ERAS.INTERSTELLAR]: [
    'minecraft:nether_star',
    'minecraft:dragon_egg',
    'minecraft:elytra',
    'minecraft:firework_rocket',
    'minecraft:firework_star',
    'minecraft:shulker_shell',
    'minecraft:shulker_box'
  ]
}

JEIAdditionEvents.removeItems(event => {
  let player = event.player
  if (!player) return

  let currentEra = player.persistentData.getInt('civilization_era') || 0

  for (let era = currentEra + 1; era < Object.keys(ITEM_ERA_MAP).length; era++) {
    let items = ITEM_ERA_MAP[era]
    if (items) {
      items.forEach(itemId => {
        event.remove(itemId)
      })
    }
  }
})

JEIAdditionEvents.hideCategories(event => {
  let player = event.player
  if (!player) return

  let currentEra = player.persistentData.getInt('civilization_era') || 0

  if (currentEra < ERAS.STEAM) {
    event.hide('create:mechanical_crafting')
  }
  if (currentEra < ERAS.ELECTRIC) {
    event.hide('mekanism:enriching')
    event.hide('mekanism:crushing')
    event.hide('thermal:pulverizer')
    event.hide('thermal:furnace')
  }
})
