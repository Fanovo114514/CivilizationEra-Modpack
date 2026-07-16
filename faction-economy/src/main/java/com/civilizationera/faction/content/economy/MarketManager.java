package com.civilizationera.faction.content.economy;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class MarketManager {
    private static MarketManager instance;
    private final Map<String, Float> basePrices = new HashMap<>();
    private final Map<String, Float> priceModifiers = new HashMap<>();
    private final Random random = new Random();
    private int currentDay = 0;

    public static void init() {
        instance = new MarketManager();
    }

    public static MarketManager getInstance() {
        return instance;
    }

    public MarketManager() {
        initializeBasePrices();
    }

    private void initializeBasePrices() {
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
            float change = (random.nextFloat() - 0.5f) * 0.2f;
            float currentModifier = priceModifiers.getOrDefault(itemId, 1.0f);
            float newModifier = Math.max(0.5f, Math.min(2.0f, currentModifier + change));
            priceModifiers.put(itemId, newModifier);
        }
    }

    public void applySupplyDemand(String itemId, int amountSold) {
        float currentModifier = priceModifiers.getOrDefault(itemId, 1.0f);
        float supplyImpact = amountSold * 0.001f;
        float newModifier = Math.max(0.5f, Math.min(2.0f, currentModifier - supplyImpact));
        priceModifiers.put(itemId, newModifier);
    }

    public boolean isHighDemand(String itemId) {
        return priceModifiers.getOrDefault(itemId, 1.0f) > 1.3f;
    }

    public boolean isLowDemand(String itemId) {
        return priceModifiers.getOrDefault(itemId, 1.0f) < 0.7f;
    }

    public int getCurrentDay() {
        return currentDay;
    }
}
