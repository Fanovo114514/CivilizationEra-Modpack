// ============================================================
// 文明纪元 - 时代锁核心配置（启动脚本 - 仅用于启动阶段注册）
// 注意：服务器逻辑请使用 server_scripts/era_config.js
//       客户端逻辑请使用 client_scripts/ 下对应文件
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

function getCurrentEra(event) {
  let player = event.player
  if (!player) return ERAS.PRIMITIVE_WILDERNESS

  let era = player.persistentData.getInt('civilization_era')
  if (era === undefined || era === null) {
    era = ERAS.PRIMITIVE_WILDERNESS
    player.persistentData.putInt('civilization_era', era)
  }
  return era
}

function setCurrentEra(player, era) {
  player.persistentData.putInt('civilization_era', era)
  player.tell(Text.of('[文明纪元] ').gold().append(Text.of(`恭喜进入 ${ERA_NAMES[era]}！`).yellow()))
}

function isEraUnlocked(event, era) {
  return getCurrentEra(event) >= era
}

function canAdvanceTo(event, targetEra) {
  return getCurrentEra(event) + 1 === targetEra
}

// ============================================================
// 蓝图系统 - 单个物品提前解锁
// ============================================================

function getUnlockedBlueprints(player) {
  let data = player.persistentData.get('unlocked_blueprints')
  if (!data) return []
  return data
}

function isBlueprintUnlocked(player, itemId) {
  let blueprints = getUnlockedBlueprints(player)
  return blueprints.includes(itemId)
}

function unlockBlueprint(player, itemId) {
  let blueprints = getUnlockedBlueprints(player)
  if (!blueprints.includes(itemId)) {
    blueprints.push(itemId)
    player.persistentData.put('unlocked_blueprints', blueprints)
    player.tell(Text.of('[蓝图解锁] ').aqua().append(Text.of(`获得新蓝图：${itemId}`).white()))
    player.playSound('minecraft:entity.experience_orb.pickup', 1, 1.2)
    return true
  }
  return false
}

// 综合判断物品是否可用：时代解锁 OR 蓝图解锁
function isItemUnlocked(player, itemId, itemEra) {
  let currentEra = player.persistentData.getInt('civilization_era') || 0
  if (currentEra >= itemEra) return true
  return isBlueprintUnlocked(player, itemId)
}

global.CivilizationEra = {
  ERAS: ERAS,
  ERA_NAMES: ERA_NAMES,
  getCurrentEra: getCurrentEra,
  setCurrentEra: setCurrentEra,
  isEraUnlocked: isEraUnlocked,
  canAdvanceTo: canAdvanceTo,
  getUnlockedBlueprints: getUnlockedBlueprints,
  isBlueprintUnlocked: isBlueprintUnlocked,
  unlockBlueprint: unlockBlueprint,
  isItemUnlocked: isItemUnlocked
}
