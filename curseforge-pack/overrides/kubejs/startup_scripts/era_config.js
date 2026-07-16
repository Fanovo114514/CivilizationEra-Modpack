// ============================================================
// 文明纪元 - 时代锁核心配置
// ============================================================

const ERAS = {
  PRIMITIVE_WILDERNESS: 0,
  PRIMITIVE: 1,
  AGRICULTURAL: 2,
  IRON: 3,
  STEAM: 4,
  ELECTRIC: 5,
  INFORMATION: 6,
  INTERSTELLAR: 7
}

const ERA_NAMES = [
  '蛮荒',
  '原始',
  '农耕',
  '铁器',
  '蒸汽',
  '电气',
  '信息',
  '星际'
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
  player.tell(Text.of('[文明纪元] ').gold().append(Text.of(`恭喜进入 ${ERA_NAMES[era]} 时代！`).yellow()))
}

function isEraUnlocked(event, era) {
  return getCurrentEra(event) >= era
}

function canAdvanceTo(event, targetEra) {
  return getCurrentEra(event) + 1 === targetEra
}

global.CivilizationEra = {
  ERAS: ERAS,
  ERA_NAMES: ERA_NAMES,
  getCurrentEra: getCurrentEra,
  setCurrentEra: setCurrentEra,
  isEraUnlocked: isEraUnlocked,
  canAdvanceTo: canAdvanceTo
}
