package com.civilizationera.core;

import com.civilizationera.core.content.item.AllItems;
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

        MinecraftForge.EVENT_BUS.register(this);
    }

    public static CivilizationCore getInstance() {
        return instance;
    }
}
