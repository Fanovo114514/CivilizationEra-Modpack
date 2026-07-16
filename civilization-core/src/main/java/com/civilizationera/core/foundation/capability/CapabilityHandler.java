package com.civilizationera.core.foundation.capability;

import com.civilizationera.core.CivilizationCore;
import com.civilizationera.core.api.CivilizationPlayerDataAPI;
import com.civilizationera.core.content.era.Era;
import net.minecraft.core.Direction;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.player.Player;
import net.minecraftforge.common.capabilities.*;
import net.minecraftforge.common.util.LazyOptional;
import net.minecraftforge.event.AttachCapabilitiesEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;

public class CapabilityHandler {
    public static final Capability<ICivilizationPlayer> CIVILIZATION_PLAYER_CAP = CapabilityManager.get(new CapabilityToken<>() {});

    public static final ResourceLocation CIVILIZATION_PLAYER_ID = new ResourceLocation(CivilizationCore.MOD_ID, "player_data");

    public static void registerCapabilities(RegisterCapabilitiesEvent event) {
        event.register(ICivilizationPlayer.class);
    }

    @SubscribeEvent
    public void attachPlayerCapabilities(AttachCapabilitiesEvent<Entity> event) {
        if (event.getObject() instanceof Player) {
            event.addCapability(CIVILIZATION_PLAYER_ID, new Provider());
        }
    }

    public interface ICivilizationPlayer extends CivilizationPlayerDataAPI {
        Era getCurrentEra();
        void setCurrentEra(Era era);
        CompoundTag saveNBT();
        void loadNBT(CompoundTag nbt);
    }

    public static class CivilizationPlayer implements ICivilizationPlayer {
        private Era currentEra = Era.PRIMITIVE_WILDERNESS;
        private int evolutionFragments = 0;
        private int coins = 0;

        @Override
        public Era getCurrentEra() {
            return currentEra;
        }

        @Override
        public void setCurrentEra(Era era) {
            this.currentEra = era;
        }

        @Override
        public int getEvolutionFragments() {
            return evolutionFragments;
        }

        @Override
        public void addEvolutionFragments(int amount) {
            this.evolutionFragments += amount;
        }

        @Override
        public boolean useEvolutionFragments(int amount) {
            if (this.evolutionFragments >= amount) {
                this.evolutionFragments -= amount;
                return true;
            }
            return false;
        }

        @Override
        public int getCoins() {
            return coins;
        }

        @Override
        public void addCoins(int amount) {
            this.coins += amount;
        }

        @Override
        public boolean useCoins(int amount) {
            if (this.coins >= amount) {
                this.coins -= amount;
                return true;
            }
            return false;
        }

        @Override
        public CompoundTag saveNBT() {
            CompoundTag nbt = new CompoundTag();
            nbt.putInt("Era", currentEra.getIndex());
            nbt.putInt("EvolutionFragments", evolutionFragments);
            nbt.putInt("Coins", coins);
            return nbt;
        }

        @Override
        public void loadNBT(CompoundTag nbt) {
            this.currentEra = Era.getByIndex(nbt.getInt("Era"));
            this.evolutionFragments = nbt.getInt("EvolutionFragments");
            this.coins = nbt.getInt("Coins");
        }
    }

    public static class Provider implements ICapabilitySerializable<CompoundTag> {
        private final CivilizationPlayer instance = new CivilizationPlayer();
        private final LazyOptional<ICivilizationPlayer> lazyOptional = LazyOptional.of(() -> instance);

        @Override
        public <T> LazyOptional<T> getCapability(Capability<T> cap, Direction side) {
            return CIVILIZATION_PLAYER_CAP.orEmpty(cap, lazyOptional.cast());
        }

        @Override
        public CompoundTag serializeNBT() {
            return instance.saveNBT();
        }

        @Override
        public void deserializeNBT(CompoundTag nbt) {
            instance.loadNBT(nbt);
        }
    }
}
