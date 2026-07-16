package com.civilizationera.barbarian;

import com.civilizationera.barbarian.fire.FireMakingManager;
import com.civilizationera.barbarian.trap.TrapManager;
import com.civilizationera.barbarian.item.BarbarianItems;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(BarbarianStart.MOD_ID)
public class BarbarianStart {
    public static final String MOD_ID = "barbarian_start";

    public BarbarianStart() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();

        BarbarianItems.register(modEventBus);
        FireMakingManager.init();
        TrapManager.init();

        MinecraftForge.EVENT_BUS.register(this);
    }
}
