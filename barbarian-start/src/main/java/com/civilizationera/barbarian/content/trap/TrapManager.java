package com.civilizationera.barbarian.content.trap;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import net.minecraft.core.BlockPos;
import net.minecraft.world.effect.MobEffectInstance;
import net.minecraft.world.effect.MobEffects;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.LivingEntity;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;

import java.io.InputStream;
import java.io.InputStreamReader;

public class TrapManager {
    private static TrapManager instance;
    private final TrapConfig config;

    public static void init() {
        instance = new TrapManager();
    }

    public static TrapManager getInstance() {
        return instance;
    }

    public TrapManager() {
        this.config = loadConfig();
    }

    private TrapConfig loadConfig() {
        try {
            InputStream is = getClass().getResourceAsStream("/assets/barbarian_start/config/barbarian_settings.json");
            if (is != null) {
                JsonObject json = new Gson().fromJson(new InputStreamReader(is), JsonObject.class);
                JsonObject trap = json.getAsJsonObject("trap");
                return new TrapConfig(
                    trap.get("spike_damage").getAsFloat(),
                    trap.get("bear_trap_damage").getAsFloat(),
                    trap.get("bear_trap_slow_duration").getAsInt()
                );
            }
        } catch (Exception ignored) {}
        return new TrapConfig(4.0f, 6.0f, 60);
    }

    public void triggerTrap(Level level, BlockPos pos, Entity entity) {
        if (!(entity instanceof LivingEntity)) {
            return;
        }

        LivingEntity livingEntity = (LivingEntity) entity;

        if (livingEntity instanceof Player) {
            Player player = (Player) livingEntity;
            if (player.isCreative()) {
                return;
            }
        }

        livingEntity.hurt(level.damageSources().cactus(), config.spikeDamage);
        livingEntity.setDeltaMovement(livingEntity.getDeltaMovement().multiply(0.1, 1, 0.1));
        livingEntity.addEffect(new MobEffectInstance(MobEffects.MOVEMENT_SLOWDOWN, config.bearTrapSlowDuration * 20, 1));
    }

    public TrapConfig getConfig() {
        return config;
    }

    public static class TrapConfig {
        public final float spikeDamage;
        public final float bearTrapDamage;
        public final int bearTrapSlowDuration;

        public TrapConfig(float spikeDamage, float bearTrapDamage, int bearTrapSlowDuration) {
            this.spikeDamage = spikeDamage;
            this.bearTrapDamage = bearTrapDamage;
            this.bearTrapSlowDuration = bearTrapSlowDuration;
        }
    }
}
