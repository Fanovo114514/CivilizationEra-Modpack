package com.civilizationera.barbarian;

import com.civilizationera.barbarian.content.fire.FireMakingManager;
import com.civilizationera.barbarian.content.trap.TrapManager;
import com.civilizationera.barbarian.content.item.AllItems;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(BarbarianStart.MOD_ID)
public class BarbarianStart {
    public static final String MOD_ID = "barbarian_start";

    private static BarbarianStart instance;

    public BarbarianStart() {
        instance = this;
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();

        AllItems.register(modEventBus);
        FireMakingManager.init();
        TrapManager.init();

        MinecraftForge.EVENT_BUS.register(this);
    }

    public static BarbarianStart getInstance() {
        return instance;
    }
}
