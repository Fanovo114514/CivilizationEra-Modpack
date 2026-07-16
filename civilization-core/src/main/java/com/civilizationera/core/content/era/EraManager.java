package com.civilizationera.core.content.era;

import com.civilizationera.core.api.CivilizationEraAPI;
import net.minecraftforge.common.MinecraftForge;

public class EraManager implements CivilizationEraAPI {
    private static Era currentEra = Era.PRIMITIVE_WILDERNESS;
    private static EraManager instance;

    public static void init() {
        instance = new EraManager();
        MinecraftForge.EVENT_BUS.register(instance);
    }

    public static EraManager getInstance() {
        return instance;
    }

    public Era getCurrentEra() {
        return currentEra;
    }

    public void setCurrentEra(Era era) {
        if (era.getIndex() > currentEra.getIndex()) {
            Era previousEra = currentEra;
            currentEra = era;
            MinecraftForge.EVENT_BUS.post(new EraChangeEvent(previousEra, era));
        }
    }

    public boolean isEraUnlocked(Era era) {
        return currentEra.isAtLeast(era);
    }

    public boolean canAdvanceEra(Era targetEra) {
        return targetEra.getIndex() == currentEra.getIndex() + 1;
    }

    public static class EraChangeEvent extends net.minecraftforge.eventbus.api.Event {
        private final Era previousEra;
        private final Era newEra;

        public EraChangeEvent(Era previousEra, Era newEra) {
            this.previousEra = previousEra;
            this.newEra = newEra;
        }

        public Era getPreviousEra() {
            return previousEra;
        }

        public Era getNewEra() {
            return newEra;
        }
    }
}
