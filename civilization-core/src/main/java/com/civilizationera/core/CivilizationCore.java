package com.civilizationera.core;

import com.civilizationera.core.content.item.AllItems;
import net.minecraft.world.item.CreativeModeTabs;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.event.BuildCreativeModeTabContentsEvent;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(CivilizationCore.MOD_ID)
public class CivilizationCore {
    public static final String MOD_ID = "civilization_core";

    private static CivilizationCore instance;

    public CivilizationCore() {
        instance = this;
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();

        AllItems.register(modEventBus);

        modEventBus.addListener(this::buildCreativeTabContents);

        MinecraftForge.EVENT_BUS.register(this);
    }

    private void buildCreativeTabContents(BuildCreativeModeTabContentsEvent event) {
        if (event.getTabKey() == CreativeModeTabs.INGREDIENTS) {
            event.accept(AllItems.EVOLUTION_FRAGMENT.get());
            event.accept(AllItems.COPPER_COIN.get());
            event.accept(AllItems.SILVER_COIN.get());
            event.accept(AllItems.GOLD_COIN.get());
        }
    }

    public static CivilizationCore getInstance() {
        return instance;
    }
}
