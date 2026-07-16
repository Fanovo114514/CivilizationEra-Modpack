// ============================================================
// 文明纪元 - 纪元解锁事件
// 处理纪元推进的条件和逻辑
// ============================================================

const { ERAS, ERA_NAMES, setCurrentEra } = global.CivilizationEra

function checkEraAdvancement(player) {
  let currentEra = player.persistentData.getInt('civilization_era') || 0
  let nextEra = currentEra + 1

  if (nextEra >= ERA_NAMES.length) return false

  let canAdvance = false

  switch (nextEra) {
    case ERAS.PRIMITIVE:
      canAdvance = checkPrimitiveRequirements(player)
      break
    case ERAS.AGRICULTURAL:
      canAdvance = checkAgriculturalRequirements(player)
      break
    case ERAS.IRON:
      canAdvance = checkIronRequirements(player)
      break
    case ERAS.STEAM:
      canAdvance = checkSteamRequirements(player)
      break
    case ERAS.ELECTRIC:
      canAdvance = checkElectricRequirements(player)
      break
    case ERAS.INFORMATION:
      canAdvance = checkInformationRequirements(player)
      break
    case ERAS.INTERSTELLAR:
      canAdvance = checkInterstellarRequirements(player)
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

function checkPrimitiveRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  return fragments >= 5
}

function checkAgriculturalRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasWheat = player.inventory.contains('minecraft:wheat_seeds')
  return fragments >= 20 && hasWheat
}

function checkIronRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasBronze = player.inventory.contains('minecraft:iron_ore')
  return fragments >= 50 && hasBronze
}

function checkSteamRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasIronBlock = player.inventory.contains('minecraft:iron_block')
  return fragments >= 100 && hasIronBlock
}

function checkElectricRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasRedstone = player.inventory.contains('minecraft:redstone')
  return fragments >= 200 && hasRedstone
}

function checkInformationRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasDiamond = player.inventory.contains('minecraft:diamond')
  return fragments >= 400 && hasDiamond
}

function checkInterstellarRequirements(player) {
  let fragments = player.persistentData.getInt('evolution_fragments') || 0
  let hasNetherite = player.inventory.contains('minecraft:netherite_ingot')
  return fragments >= 800 && hasNetherite
}

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
    player.tell(Text.of('[文明纪元] ').gold().append(Text.of('欢迎来到文明纪元！你现在处于蛮荒时代。').white()))
    player.tell(Text.of('[文明纪元] ').gold().append(Text.of('收集进化碎片来解锁新的纪元！').gray()))
  }
})

ItemEvents.entityInteracted(event => {
  let entity = event.target
  let player = event.player

  if (entity.type === 'minecraft:zombie' || entity.type === 'minecraft:skeleton' ||
      entity.type === 'minecraft:spider' || entity.type === 'minecraft:creeper') {
    if (!entity.isAlive()) {
      let currentEra = player.persistentData.getInt('civilization_era') || 0
      let fragmentAmount = 1 + currentEra

      let currentFragments = player.persistentData.getInt('evolution_fragments') || 0
      player.persistentData.putInt('evolution_fragments', currentFragments + fragmentAmount)

      player.tell(Text.of(`获得 ${fragmentAmount} 个进化碎片`).aqua())
    }
  }
})
