package com.civilizationera.barbarian.content.trap;

import net.minecraft.core.BlockPos;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.LivingEntity;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;

public class TrapManager {
    private static TrapManager instance;

    public static void init() {
        instance = new TrapManager();
    }

    public static TrapManager getInstance() {
        return instance;
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

        livingEntity.hurt(level.damageSources().generic(), 2.0f);
        livingEntity.setDeltaMovement(livingEntity.getDeltaMovement().multiply(0.1, 1, 0.1));
    }
}
