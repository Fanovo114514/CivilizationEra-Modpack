package com.civilizationera.faction;

import com.civilizationera.faction.faction.FactionManager;
import com.civilizationera.faction.economy.MarketManager;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(FactionEconomy.MOD_ID)
public class FactionEconomy {
    public static final String MOD_ID = "faction_economy";

    public FactionEconomy() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();

        FactionManager.init();
        MarketManager.init();

        MinecraftForge.EVENT_BUS.register(this);
    }
}
