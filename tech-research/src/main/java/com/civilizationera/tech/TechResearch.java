package com.civilizationera.tech;

import com.civilizationera.tech.research.ResearchManager;
import com.civilizationera.tech.item.TechItems;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(TechResearch.MOD_ID)
public class TechResearch {
    public static final String MOD_ID = "tech_research";

    public TechResearch() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();

        TechItems.register(modEventBus);
        ResearchManager.init();

        MinecraftForge.EVENT_BUS.register(this);
    }
}
