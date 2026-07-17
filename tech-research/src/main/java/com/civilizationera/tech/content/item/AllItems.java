package com.civilizationera.tech.content.item;

import com.civilizationera.tech.TechResearch;
import net.minecraft.world.item.Item;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class AllItems {
    public static final DeferredRegister<Item> ITEMS = DeferredRegister.create(ForgeRegistries.ITEMS, TechResearch.MOD_ID);

    public static final RegistryObject<Item> TECH_FRAGMENT = ITEMS.register("tech_fragment",
            () -> new Item(new Item.Properties()));

    public static final RegistryObject<Item> BLUEPRINT = ITEMS.register("blueprint",
            () -> new Item(new Item.Properties().stacksTo(1)));

    public static final RegistryObject<Item> RESEARCH_TABLE = ITEMS.register("research_table",
            () -> new Item(new Item.Properties()));

    public static void register(IEventBus eventBus) {
        ITEMS.register(eventBus);
    }
}
