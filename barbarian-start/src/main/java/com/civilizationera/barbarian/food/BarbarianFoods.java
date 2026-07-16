package com.civilizationera.barbarian.food;

import net.minecraft.world.food.FoodProperties;

public class BarbarianFoods {
    public static final FoodProperties COOKED_MEAT_ON_STICK = new FoodProperties.Builder()
            .nutrition(6)
            .saturationMod(0.8f)
            .meat()
            .build();
}
