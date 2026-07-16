package com.civilizationera.core.content.era;

import net.minecraft.resources.ResourceLocation;

public enum Era {
    PRIMITIVE_WILDERNESS(0, "primitive_wilderness", "蛮荒"),
    PRIMITIVE(1, "primitive", "原始"),
    AGRICULTURAL(2, "agricultural", "农耕"),
    IRON(3, "iron", "铁器"),
    STEAM(4, "steam", "蒸汽"),
    ELECTRIC(5, "electric", "电气"),
    INFORMATION(6, "information", "信息"),
    INTERSTELLAR(7, "interstellar", "星际");

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
