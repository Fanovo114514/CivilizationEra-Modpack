package com.civilizationera.tech;

import com.civilizationera.tech.content.research.ResearchManager;
import com.civilizationera.tech.content.item.AllItems;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(TechResearch.MOD_ID)
public class TechResearch {
    public static final String MOD_ID = "tech_research";

    private static TechResearch instance;

    public TechResearch() {
        instance = this;
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();

        AllItems.register(modEventBus);
        ResearchManager.init();

        MinecraftForge.EVENT_BUS.register(this);
    }

    public static TechResearch getInstance() {
        return instance;
    }
}
