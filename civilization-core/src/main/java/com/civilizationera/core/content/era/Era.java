package com.civilizationera.core.content.era;

import net.minecraft.resources.ResourceLocation;

public enum Era {
    PRIMITIVE_WILDERNESS(0, "primitive_wilderness", "蛮荒时代"),
    STONE_AGE(1, "stone_age", "石器时代"),
    BRONZE_AGE(2, "bronze_age", "青铜时代"),
    IRON_AGE(3, "iron_age", "铁器时代"),
    STEAM_REVOLUTION(4, "steam_revolution", "蒸汽革命"),
    ELECTRIC_REVOLUTION(5, "electric_revolution", "电气革命"),
    INFORMATION_REVOLUTION(6, "information_revolution", "信息革命"),
    STARFARER(7, "starfarer", "星际远征");

    private final int index;
    private final String name;
    private final String displayName;

    Era(int index, String name, String displayName) {
        this.index = index;
        this.name = name;
        this.displayName = displayName;
    }

    public int getIndex() {
        return index;
    }

    public String getName() {
        return name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public ResourceLocation getId() {
        return new ResourceLocation("civilization_core", name);
    }

    public boolean isAtLeast(Era other) {
        return this.index >= other.index;
    }

    public static Era getByIndex(int index) {
        for (Era era : values()) {
            if (era.index == index) {
                return era;
            }
        }
        return PRIMITIVE_WILDERNESS;
    }

    public static Era getByName(String name) {
        for (Era era : values()) {
            if (era.name.equalsIgnoreCase(name) || era.name().equalsIgnoreCase(name)) {
                return era;
            }
        }
        return PRIMITIVE_WILDERNESS;
    }

    public static Era getNext(Era current) {
        int nextIndex = current.index + 1;
        if (nextIndex < values().length) {
            return getByIndex(nextIndex);
        }
        return current;
    }
}
