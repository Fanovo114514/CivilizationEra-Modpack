package com.civilizationera.core;

import com.civilizationera.core.era.EraManager;
import com.civilizationera.core.item.CoreItems;
import com.civilizationera.core.capability.CapabilityHandler;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(CivilizationCore.MOD_ID)
public class CivilizationCore {
    public static final String MOD_ID = "civilization_core";

    public CivilizationCore() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();

        CoreItems.register(modEventBus);
        EraManager.init();

        modEventBus.addListener(CapabilityHandler::registerCapabilities);
        MinecraftForge.EVENT_BUS.register(new CapabilityHandler());

        MinecraftForge.EVENT_BUS.register(this);
    }
}
