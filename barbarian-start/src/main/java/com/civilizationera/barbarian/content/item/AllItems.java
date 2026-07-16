package com.civilizationera.barbarian.content.item;

import com.civilizationera.barbarian.BarbarianStart;
import net.minecraft.world.food.FoodProperties;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class AllItems {
    public static final DeferredRegister<Item> ITEMS = DeferredRegister.create(ForgeRegistries.ITEMS, BarbarianStart.MOD_ID);

    public static final FoodProperties COOKED_MEAT_ON_STICK = new FoodProperties.Builder()
            .nutrition(6)
            .saturationMod(0.8f)
            .meat()
            .build();

    public static final RegistryObject<Item> FLINT_STRIKER = ITEMS.register("flint_striker",
            () -> new Item(new Item.Properties().durability(32)));

    public static final RegistryObject<Item> PRIMITIVE_TRAP = ITEMS.register("primitive_trap",
            () -> new Item(new Item.Properties()));

    public static final RegistryObject<Item> STONE_CLUB = ITEMS.register("stone_club",
            () -> new Item(new Item.Properties().stacksTo(1)));

    public static final RegistryObject<Item> RAW_MEAT_ON_STICK = ITEMS.register("raw_meat_on_stick",
            () -> new Item(new Item.Properties()));

    public static final RegistryObject<Item> COOKED_MEAT_ON_STICK_ITEM = ITEMS.register("cooked_meat_on_stick",
            () -> new Item(new Item.Properties().food(COOKED_MEAT_ON_STICK)));

    public static final DeferredRegister<CreativeModeTab> CREATIVE_MODE_TABS = DeferredRegister.create(ForgeRegistries.CREATIVE_MODE_TAB, BarbarianStart.MOD_ID);

    public static final RegistryObject<CreativeModeTab> BARBARIAN_TAB = CREATIVE_MODE_TABS.register("barbarian_tab",
            () -> CreativeModeTab.builder().icon(() -> new ItemStack(STONE_CLUB.get())).build());

    public static void register(IEventBus eventBus) {
        ITEMS.register(eventBus);
        CREATIVE_MODE_TABS.register(eventBus);
    }
}
