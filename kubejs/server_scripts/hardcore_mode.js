// ============================================================
// 文明纪元 - 硬核化调整
// 理念：蛮荒起步很难，越发展越强
// ============================================================

const { ERAS, ERA_NAMES } = global.CivilizationEra

// ============================================================
// 初始能力限制
// ============================================================

PlayerEvents.loggedIn(event => {
  let player = event.player
  if (player.level.isClientSide) return

  let currentEra = player.persistentData.getInt('civilization_era') || 0

  applyHardcoreStats(player, currentEra)
})

PlayerEvents.tick(event => {
  let player = event.player
  if (player.level.isClientSide) return

  if (player.tickCount % 200 === 0) {
    let currentEra = player.persistentData.getInt('civilization_era') || 0
    applyHardcoreStats(player, currentEra)
  }
})

function applyHardcoreStats(player, era) {
  try {
    let healthScale = 1.0
    let speedScale = 1.0
    let attackScale = 1.0

    if (era === ERAS.PRIMITIVE_WILDERNESS) {
      healthScale = 0.7
      speedScale = 0.9
      attackScale = 0.8
    } else if (era === ERAS.PRIMITIVE_AGE) {
      healthScale = 0.8
      speedScale = 0.95
      attackScale = 0.9
    } else if (era === ERAS.SLASH_AND_BURN) {
      healthScale = 0.9
      speedScale = 1.0
      attackScale = 0.95
    } else if (era === ERAS.IRON_FORGING) {
      healthScale = 1.0
      speedScale = 1.0
      attackScale = 1.0
    } else if (era >= ERAS.STEAM_REVOLUTION) {
      healthScale = 1.0
      speedScale = 1.05
      attackScale = 1.0
    }

    let maxHealthAttr = player.getAttribute('minecraft:generic.max_health')
    if (maxHealthAttr) {
      let base = 20
      let newMax = base * healthScale
      if (Math.abs(maxHealthAttr.baseValue - newMax) > 0.1) {
        maxHealthAttr.baseValue = newMax
      }
    }

    let speedAttr = player.getAttribute('minecraft:generic.movement_speed')
    if (speedAttr) {
      let base = 0.1
      let newSpeed = base * speedScale
      if (Math.abs(speedAttr.baseValue - newSpeed) > 0.001) {
        speedAttr.baseValue = newSpeed
      }
    }

    let attackAttr = player.getAttribute('minecraft:generic.attack_damage')
    if (attackAttr) {
      let base = 1.0
      let newAtk = base * attackScale
      if (Math.abs(attackAttr.baseValue - newAtk) > 0.01) {
        attackAttr.baseValue = newAtk
      }
    }
  } catch (e) {}
}

// ============================================================
// 撸树限制 - 蛮荒纪元拳头伤害低，鼓励用燧石
// ============================================================

BlockEvents.broken(event => {
  let player = event.player
  if (!player || player.level.isClientSide) return

  let currentEra = player.persistentData.getInt('civilization_era') || 0
  let blockId = event.block.id

  if (currentEra === ERAS.PRIMITIVE_WILDERNESS) {
    let isWood = blockId.includes('log') || blockId.includes('wood')
    if (isWood && player.mainHandItem.id === 'minecraft:air') {
      event.cancel()
      player.tell(Text.of('[硬核] ').red().append(Text.of('赤手空拳撸不动木头！先去找燧石吧！').white()))
    }
  }
})

// ============================================================
// 饥饿系统加强 - 蛮荒纪元消耗更快
// ============================================================

PlayerEvents.tick(event => {
  let player = event.player
  if (player.level.isClientSide) return

  let currentEra = player.persistentData.getInt('civilization_era') || 0

  if (currentEra <= ERAS.PRIMITIVE_AGE) {
    if (player.tickCount % 600 === 0 && player.foodLevel > 0) {
      if (Math.random() < 0.3) {
        player.foodLevel = Math.max(0, player.foodLevel - 1)
      }
    }
  }
})

// ============================================================
// 死亡惩罚 - 掉更多经验和物品
// ============================================================

PlayerEvents.death(event => {
  let player = event.entity
  let currentEra = player.persistentData.getInt('civilization_era') || 0

  if (currentEra <= ERAS.SLASH_AND_BURN) {
    player.persistentData.putInt('coins', Math.floor((player.persistentData.getInt('coins') || 0) * 0.5))
    player.tell(Text.of('[硬核] ').red().append(Text.of('死亡惩罚：损失了一半金币！').white()))
  }
})

// ============================================================
// 夜晚更危险 - 蛮荒纪元刷怪更多
// ============================================================

EntityEvents.spawned(event => {
  let entity = event.entity
  let level = entity.level

  if (level.isClientSide) return
  if (!entity.isLiving()) return

  let type = entity.type
  let isHostile = type === 'minecraft:zombie' || type === 'minecraft:skeleton' ||
                   type === 'minecraft:spider' || type === 'minecraft:creeper'

  if (!isHostile) return

  let players = level.players()
  if (players.length === 0) return

  let hasWildernessPlayer = false
  for (let p of players) {
    let era = p.persistentData.getInt('civilization_era') || 0
    if (era <= ERAS.PRIMITIVE_AGE) {
      hasWildernessPlayer = true
      break
    }
  }

  if (hasWildernessPlayer && Math.random() > 0.5) {
    event.cancel()
  }
})
