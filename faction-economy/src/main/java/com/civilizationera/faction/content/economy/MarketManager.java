package com.civilizationera.faction.content.economy;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class MarketManager {
    private static MarketManager instance;
    private final Map<String, Float> basePrices = new HashMap<>();
    private final Map<String, Float> priceModifiers = new HashMap<>();
    private final MarketConfig config;
    private final Random random = new Random();
    private int currentDay = 0;

    public static void init() {
        instance = new MarketManager();
    }

    public static MarketManager getInstance() {
        return instance;
    }

    public MarketManager() {
        this.config = loadConfig();
        initializeBasePrices();
    }

    private MarketConfig loadConfig() {
        try {
            InputStream is = getClass().getResourceAsStream("/assets/faction_economy/config/market_prices.json");
            if (is != null) {
                JsonObject json = new Gson().fromJson(new InputStreamReader(is), JsonObject.class);
                JsonObject fluct = json.getAsJsonObject("price_fluctuation");
                return new MarketConfig(
                    fluct.get("min_modifier").getAsFloat(),
                    fluct.get("max_modifier").getAsFloat(),
                    fluct.get("daily_change_range").getAsFloat(),
                    fluct.get("supply_demand_factor").getAsFloat(),
                    fluct.get("high_demand_threshold").getAsFloat(),
                    fluct.get("low_demand_threshold").getAsFloat()
                );
            }
        } catch (Exception ignored) {}
        return new MarketConfig(0.5f, 2.0f, 0.2f, 0.001f, 1.3f, 0.7f);
    }

    private void initializeBasePrices() {
        try {
            InputStream is = getClass().getResourceAsStream("/assets/faction_economy/config/market_prices.json");
            if (is != null) {
                JsonObject json = new Gson().fromJson(new InputStreamReader(is), JsonObject.class);
                Type type = new TypeToken<Map<String, Float>>() {}.getType();
                Map<String, Float> prices = new Gson().fromJson(json.getAsJsonObject("base_prices"), type);
                basePrices.putAll(prices);
                return;
            }
        } catch (Exception ignored) {}
        basePrices.put("wheat", 5.0f);
        basePrices.put("carrot", 8.0f);
        basePrices.put("potato", 7.0f);
        basePrices.put("iron_ingot", 20.0f);
        basePrices.put("gold_ingot", 50.0f);
        basePrices.put("diamond", 200.0f);
        basePrices.put("coal", 10.0f);
        basePrices.put("stone", 2.0f);
        basePrices.put("wood", 3.0f);
        basePrices.put("bread", 15.0f);
        basePrices.put("cooked_beef", 25.0f);
    }

    public float getPrice(String itemId) {
        float base = basePrices.getOrDefault(itemId, 10.0f);
        float modifier = priceModifiers.getOrDefault(itemId, 1.0f);
        return base * modifier;
    }

    public void updateMarket() {
        currentDay++;

        for (String itemId : basePrices.keySet()) {
            float change = (random.nextFloat() - 0.5f) * config.dailyChangeRange;
            float currentModifier = priceModifiers.getOrDefault(itemId, 1.0f);
            float newModifier = Math.max(config.minModifier, Math.min(config.maxModifier, currentModifier + change));
            priceModifiers.put(itemId, newModifier);
        }
    }

    public void applySupplyDemand(String itemId, int amountSold) {
        float currentModifier = priceModifiers.getOrDefault(itemId, 1.0f);
        float supplyImpact = amountSold * config.supplyDemandFactor;
        float newModifier = Math.max(config.minModifier, Math.min(config.maxModifier, currentModifier - supplyImpact));
        priceModifiers.put(itemId, newModifier);
    }

    public boolean isHighDemand(String itemId) {
        return priceModifiers.getOrDefault(itemId, 1.0f) > config.highDemandThreshold;
    }

    public boolean isLowDemand(String itemId) {
        return priceModifiers.getOrDefault(itemId, 1.0f) < config.lowDemandThreshold;
    }

    public int getCurrentDay() {
        return currentDay;
    }

    public MarketConfig getConfig() {
        return config;
    }

    public static class MarketConfig {
        public final float minModifier;
        public final float maxModifier;
        public final float dailyChangeRange;
        public final float supplyDemandFactor;
        public final float highDemandThreshold;
        public final float lowDemandThreshold;

        public MarketConfig(float minModifier, float maxModifier, float dailyChangeRange,
                            float supplyDemandFactor, float highDemandThreshold, float lowDemandThreshold) {
            this.minModifier = minModifier;
            this.maxModifier = maxModifier;
            this.dailyChangeRange = dailyChangeRange;
            this.supplyDemandFactor = supplyDemandFactor;
            this.highDemandThreshold = highDemandThreshold;
            this.lowDemandThreshold = lowDemandThreshold;
        }
    }
}
