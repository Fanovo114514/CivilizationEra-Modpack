package com.civilizationera.core.content.era;

import net.minecraft.resources.ResourceLocation;

public enum Era {
    PRIMITIVE_WILDERNESS(0, "primitive_wilderness", "蛮荒纪元"),
    PRIMITIVE_AGE(1, "primitive_age", "原始时代"),
    SLASH_AND_BURN(2, "slash_and_burn", "刀耕火种"),
    IRON_FORGING(3, "iron_forging", "炼造铁器"),
    STEAM_REVOLUTION(4, "steam_revolution", "蒸汽革命"),
    ELECTRIC_DISCOVERY(5, "electric_discovery", "发现电气"),
    INFORMATION_LEGEND(6, "information_legend", "信息传说"),
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
