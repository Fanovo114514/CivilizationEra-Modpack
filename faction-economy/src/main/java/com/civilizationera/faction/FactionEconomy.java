package com.civilizationera.faction;

import com.civilizationera.faction.content.faction.FactionManager;
import com.civilizationera.faction.content.economy.MarketManager;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(FactionEconomy.MOD_ID)
public class FactionEconomy {
    public static final String MOD_ID = "faction_economy";

    private static FactionEconomy instance;

    public FactionEconomy() {
        instance = this;
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();

        FactionManager.init();
        MarketManager.init();

        MinecraftForge.EVENT_BUS.register(this);
    }

    public static FactionEconomy getInstance() {
        return instance;
    }
}
