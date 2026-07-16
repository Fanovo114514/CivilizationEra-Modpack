package com.civilizationera.barbarian.fire;

import net.minecraft.core.BlockPos;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.Blocks;

public class FireMakingManager {
    private static FireMakingManager instance;

    public static void init() {
        instance = new FireMakingManager();
    }

    public static FireMakingManager getInstance() {
        return instance;
    }

    public boolean attemptStartFire(Level level, BlockPos pos, Player player) {
        if (level.isRainingAt(pos) || level.isRainingAt(pos.above())) {
            return false;
        }

        if (level.getBlockState(pos.below()).is(Blocks.NETHERRACK)) {
            level.setBlock(pos, Blocks.FIRE.defaultBlockState(), 11);
            return true;
        }

        if (player.getRandom().nextFloat() < 0.3f) {
            level.setBlock(pos, Blocks.FIRE.defaultBlockState(), 11);
            return true;
        }

        return false;
    }

    public boolean canCookOverFire(Level level, BlockPos firePos) {
        return level.getBlockState(firePos).is(Blocks.FIRE);
    }
}
