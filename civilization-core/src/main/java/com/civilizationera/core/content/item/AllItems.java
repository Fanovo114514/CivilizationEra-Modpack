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

    public static CreativeModeTab CIVILIZATION_TAB;

    public static void register(IEventBus eventBus) {
        ITEMS.register(eventBus);
    }

    public static void registerCreativeTab() {
        CIVILIZATION_TAB = CreativeModeTab.builder()
                .icon(() -> new ItemStack(EVOLUTION_FRAGMENT.get()))
                .title(net.minecraft.network.chat.Component.translatable("itemGroup.civilization_core"))
                .displayItems((parameters, output) -> {
                    output.accept(EVOLUTION_FRAGMENT.get());
                    output.accept(COPPER_COIN.get());
                    output.accept(SILVER_COIN.get());
                    output.accept(GOLD_COIN.get());
                })
                .build();
    }
}
