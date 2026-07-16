package com.civilizationera.core;

import com.civilizationera.core.content.item.AllItems;
import com.civilizationera.core.foundation.capability.CapabilityHandler;
import net.minecraftforge.common.MinecraftForge;
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

        modEventBus.addListener(CapabilityHandler::registerCapabilities);
        MinecraftForge.EVENT_BUS.register(new CapabilityHandler());

        MinecraftForge.EVENT_BUS.register(this);
    }

    public static CivilizationCore getInstance() {
        return instance;
    }
}
