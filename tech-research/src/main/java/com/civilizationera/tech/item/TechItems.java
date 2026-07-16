package com.civilizationera.tech.item;

import com.civilizationera.tech.TechResearch;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class TechItems {
    public static final DeferredRegister<Item> ITEMS = DeferredRegister.create(ForgeRegistries.ITEMS, TechResearch.MOD_ID);

    public static final RegistryObject<Item> TECH_FRAGMENT = ITEMS.register("tech_fragment",
            () -> new Item(new Item.Properties()));

    public static final RegistryObject<Item> BLUEPRINT = ITEMS.register("blueprint",
            () -> new Item(new Item.Properties().stacksTo(1)));

    public static final RegistryObject<Item> RESEARCH_TABLE = ITEMS.register("research_table",
            () -> new Item(new Item.Properties()));

    public static final DeferredRegister<CreativeModeTab> CREATIVE_MODE_TABS = DeferredRegister.create(ForgeRegistries.CREATIVE_MODE_TAB, TechResearch.MOD_ID);

    public static final RegistryObject<CreativeModeTab> TECH_TAB = CREATIVE_MODE_TABS.register("tech_tab",
            () -> CreativeModeTab.builder().icon(() -> new ItemStack(TECH_FRAGMENT.get())).build());

    public static void register(IEventBus eventBus) {
        ITEMS.register(eventBus);
        CREATIVE_MODE_TABS.register(eventBus);
    }
}
