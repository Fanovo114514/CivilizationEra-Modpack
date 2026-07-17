// ============================================================
// 文明纪元 - 市场配置共享常量（server/client 都能读）
// ============================================================

const MARKET_CONFIG = {
  currency: {
    base_unit: '金币',
    copper_to_silver: 100,
    silver_to_gold: 100
  },
  market_settings: {
    update_interval_ticks: 24000,
    daily_price_change_limit: 0.15,
    decay_rate_per_day: 0.03,
    target_inventory_days: 7,
    price_adjustment_speed: 0.3,
    min_price_ratio: 0.3,
    max_price_ratio: 3.0,
    supply_shock_min: 0.85,
    supply_shock_max: 1.15
  },
  items: {
    'minecraft:wheat': { base_price: 2, base_supply_per_day: 100, base_demand_per_day: 80, price_elasticity: -0.4, category: 'food', era: 2, faction: 'farmers_union' },
    'minecraft:bread': { base_price: 5, base_supply_per_day: 50, base_demand_per_day: 60, price_elasticity: -0.5, category: 'food', era: 2, faction: 'farmers_union' },
    'minecraft:carrot': { base_price: 3, base_supply_per_day: 80, base_demand_per_day: 70, price_elasticity: -0.4, category: 'food', era: 2, faction: 'farmers_union' },
    'minecraft:potato': { base_price: 3, base_supply_per_day: 80, base_demand_per_day: 70, price_elasticity: -0.4, category: 'food', era: 2, faction: 'farmers_union' },
    'minecraft:iron_ingot': { base_price: 15, base_supply_per_day: 30, base_demand_per_day: 25, price_elasticity: -0.8, category: 'mineral', era: 3, faction: 'miners_guild' },
    'minecraft:gold_ingot': { base_price: 50, base_supply_per_day: 10, base_demand_per_day: 15, price_elasticity: -0.9, category: 'mineral', era: 4, faction: 'miners_guild' },
    'minecraft:copper_ingot': { base_price: 8, base_supply_per_day: 50, base_demand_per_day: 40, price_elasticity: -0.7, category: 'mineral', era: 2, faction: 'miners_guild' },
    'minecraft:coal': { base_price: 4, base_supply_per_day: 100, base_demand_per_day: 90, price_elasticity: -0.6, category: 'mineral', era: 2, faction: 'miners_guild' },
    'minecraft:diamond': { base_price: 200, base_supply_per_day: 3, base_demand_per_day: 5, price_elasticity: -1.0, category: 'gem', era: 5, faction: 'industrial_consortium' },
    'minecraft:netherite_ingot': { base_price: 1000, base_supply_per_day: 0.5, base_demand_per_day: 1, price_elasticity: -1.2, category: 'gem', era: 6, faction: 'industrial_consortium' },
    'minecraft:redstone': { base_price: 10, base_supply_per_day: 20, base_demand_per_day: 25, price_elasticity: -0.7, category: 'tech', era: 5, faction: 'industrial_consortium' },
    'minecraft:lapis_lazuli': { base_price: 12, base_supply_per_day: 15, base_demand_per_day: 20, price_elasticity: -0.8, category: 'gem', era: 5, faction: 'academy' },
    'minecraft:ender_pearl': { base_price: 80, base_supply_per_day: 2, base_demand_per_day: 3, price_elasticity: -1.1, category: 'rare', era: 6, faction: 'underground_market' },
    'minecraft:iron_sword': { base_price: 25, base_supply_per_day: 5, base_demand_per_day: 8, price_elasticity: -0.9, category: 'weapon', era: 3, faction: 'guard_corps' },
    'minecraft:iron_pickaxe': { base_price: 30, base_supply_per_day: 5, base_demand_per_day: 6, price_elasticity: -0.8, category: 'tool', era: 3, faction: 'miners_guild' },
    'minecraft:shield': { base_price: 35, base_supply_per_day: 3, base_demand_per_day: 5, price_elasticity: -0.7, category: 'armor', era: 3, faction: 'guard_corps' },
    'minecraft:golden_apple': { base_price: 300, base_supply_per_day: 1, base_demand_per_day: 2, price_elasticity: -1.5, category: 'luxury', era: 4, faction: 'underground_market' },
    'minecraft:tnt': { base_price: 40, base_supply_per_day: 5, base_demand_per_day: 4, price_elasticity: -1.0, category: 'explosive', era: 4, faction: 'industrial_consortium' }
  }
}

global.MARKET_CONFIG = MARKET_CONFIG
