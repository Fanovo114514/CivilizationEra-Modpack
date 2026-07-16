package com.civilizationera.core.foundation.utility;

import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;

public class InventoryUtils {

    public static int countItem(Player player, Item item) {
        int count = 0;
        for (ItemStack stack : player.getInventory().items) {
            if (stack.is(item)) {
                count += stack.getCount();
            }
        }
        return count;
    }

    public static boolean hasItem(Player player, Item item, int amount) {
        return countItem(player, item) >= amount;
    }

    public static void consumeItem(Player player, Item item, int amount) {
        int remaining = amount;
        for (int i = 0; i < player.getInventory().items.size() && remaining > 0; i++) {
            ItemStack stack = player.getInventory().items.get(i);
            if (stack.is(item)) {
                int toConsume = Math.min(stack.getCount(), remaining);
                stack.shrink(toConsume);
                remaining -= toConsume;
            }
        }
    }
}
