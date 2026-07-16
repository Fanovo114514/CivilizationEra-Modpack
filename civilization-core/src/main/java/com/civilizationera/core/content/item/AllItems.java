package com.civilizationera.core.content.item;

import com.civilizationera.core.CivilizationCore;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class AllItems {
    public static final DeferredRegister<Item> ITEMS = DeferredRegister.create(ForgeRegistries.ITEMS, CivilizationCore.MOD_ID);

    public static final RegistryObject<Item> EVOLUTION_FRAGMENT = ITEMS.register("evolution_fragment",
            () -> new Item(new Item.Properties()));

    public static final RegistryObject<Item> COPPER_COIN = ITEMS.register("copper_coin",
            () -> new Item(new Item.Properties()));

    public static final RegistryObject<Item> SILVER_COIN = ITEMS.register("silver_coin",
            () -> new Item(new Item.Properties()));

    public static final RegistryObject<Item> GOLD_COIN = ITEMS.register("gold_coin",
            () -> new Item(new Item.Properties()));

    public static final DeferredRegister<CreativeModeTab> CREATIVE_MODE_TABS = DeferredRegister.create(ForgeRegistries.CREATIVE_MODE_TAB, CivilizationCore.MOD_ID);

    public static final RegistryObject<CreativeModeTab> CIVILIZATION_TAB = CREATIVE_MODE_TABS.register("civilization_tab",
            () -> CreativeModeTab.builder().icon(() -> new ItemStack(EVOLUTION_FRAGMENT.get())).build());

    public static void register(IEventBus eventBus) {
        ITEMS.register(eventBus);
        CREATIVE_MODE_TABS.register(eventBus);
    }
}
