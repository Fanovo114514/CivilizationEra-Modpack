// ============================================================
// 文明纪元 - 配方时代锁
// 根据当前纪元禁用/启用配方
// ============================================================

const { ERAS, isEraUnlocked } = global.CivilizationEra

const RECIPE_ERA_MAP = {
  [ERAS.PRIMITIVE_WILDERNESS]: [],
  [ERAS.PRIMITIVE]: [
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
  ],
  [ERAS.AGRICULTURAL]: [
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
  ],
  [ERAS.IRON]: [
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
  ],
  [ERAS.STEAM]: [
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
  ],
  [ERAS.ELECTRIC]: [
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
    'minecraft:firework_star'
  ]
}

ServerEvents.recipes(event => {
  function isRecipeAllowed(recipeId, player) {
    if (!player) return true

    let currentEra = player.persistentData.getInt('civilization_era') || 0

    for (let era = 0; era <= currentEra; era++) {
      let recipes = RECIPE_ERA_MAP[era]
      if (recipes && recipes.includes(recipeId)) {
        return true
      }
    }

    let isLocked = false
    for (let era = currentEra + 1; era < ERA_NAMES.length; era++) {
      let recipes = RECIPE_ERA_MAP[era]
      if (recipes && recipes.includes(recipeId)) {
        isLocked = true
        break
      }
    }

    return !isLocked
  }

  function checkAndUnlockRecipes(player) {
    let currentEra = player.persistentData.getInt('civilization_era') || 0
    let unlockedRecipes = player.persistentData.get('unlocked_recipes') || []

    for (let era = 0; era <= currentEra; era++) {
      let recipes = RECIPE_ERA_MAP[era]
      if (recipes) {
        recipes.forEach(recipeId => {
          if (!unlockedRecipes.includes(recipeId)) {
            player.award(recipeId)
            unlockedRecipes.push(recipeId)
          }
        })
      }
    }

    player.persistentData.put('unlocked_recipes', unlockedRecipes)
  }

  global.checkAndUnlockRecipes = checkAndUnlockRecipes
})
