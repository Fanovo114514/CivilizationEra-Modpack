package com.civilizationera.core.foundation.utility;

import net.minecraft.ChatFormatting;
import net.minecraft.network.chat.Component;
import net.minecraft.network.chat.MutableComponent;

public class TextUtils {

    public static MutableComponent translate(String key) {
        return Component.translatable(key);
    }

    public static MutableComponent translate(String key, Object... args) {
        return Component.translatable(key, args);
    }

    public static MutableComponent literal(String text) {
        return Component.literal(text);
    }

    public static MutableComponent eraName(String eraName) {
        return Component.literal(eraName).withStyle(ChatFormatting.GOLD);
    }

    public static MutableComponent success(String text) {
        return Component.literal(text).withStyle(ChatFormatting.GREEN);
    }

    public static MutableComponent failure(String text) {
        return Component.literal(text).withStyle(ChatFormatting.RED);
    }

    public static MutableComponent info(String text) {
        return Component.literal(text).withStyle(ChatFormatting.AQUA);
    }
}
