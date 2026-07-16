package com.civilizationera.barbarian.content.fire;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import net.minecraft.core.BlockPos;
import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.Blocks;

import java.io.InputStream;
import java.io.InputStreamReader;

public class FireMakingManager {
    private static FireMakingManager instance;
    private final FireConfig config;

    public static void init() {
        instance = new FireMakingManager();
    }

    public static FireMakingManager getInstance() {
        return instance;
    }

    public FireMakingManager() {
        this.config = loadConfig();
    }

    private FireConfig loadConfig() {
        try {
            InputStream is = getClass().getResourceAsStream("/assets/barbarian_start/config/barbarian_settings.json");
            if (is != null) {
                JsonObject json = new Gson().fromJson(new InputStreamReader(is), JsonObject.class);
                JsonObject fire = json.getAsJsonObject("fire_making");
                JsonObject messages = json.getAsJsonObject("messages");
                return new FireConfig(
                    fire.get("base_success_rate").getAsFloat(),
                    fire.get("dry_bonus").getAsFloat(),
                    fire.get("rain_penalty").getAsFloat(),
                    fire.get("underground_bonus").getAsFloat(),
                    fire.get("nether_auto_ignite").getAsBoolean(),
                    fire.get("durability_cost").getAsInt(),
                    fire.get("max_durability").getAsInt(),
                    messages.get("rain_too_wet").getAsString(),
                    messages.get("success").getAsString(),
                    messages.get("failure").getAsString()
                );
            }
        } catch (Exception ignored) {}
        return new FireConfig(0.3f, 0.15f, 0.25f, 0.1f, true, 1, 32,
            "雨太大了，打不着火...", "成功点着了火！", "没能点着火，再试试...");
    }

    public boolean attemptStartFire(Level level, BlockPos pos, Player player, ItemStack fireStarter) {
        if (level.dimensionType().ultraWarm() && config.netherAutoIgnite) {
            level.setBlock(pos, Blocks.FIRE.defaultBlockState(), 11);
            return true;
        }

        if (level.isRainingAt(pos) || level.isRainingAt(pos.above())) {
            if (!level.isClientSide) {
                player.displayClientMessage(Component.literal(config.rainTooWetMsg), true);
            }
            return false;
        }

        if (fireStarter != null && !level.isClientSide) {
            fireStarter.hurtAndBreak(config.durabilityCost, player, p -> {});
        }

        float chance = config.baseSuccessRate;

        if (!level.canSeeSky(pos)) {
            chance += config.undergroundBonus;
        }

        boolean isDry = !level.isRaining() && level.getBiome(pos).value().getBaseTemperature() > 0.5f;
        if (isDry) {
            chance += config.dryBonus;
        }

        if (player.getRandom().nextFloat() < chance) {
            level.setBlock(pos, Blocks.FIRE.defaultBlockState(), 11);
            if (!level.isClientSide) {
                player.displayClientMessage(Component.literal(config.successMsg), true);
            }
            return true;
        }

        if (!level.isClientSide) {
            player.displayClientMessage(Component.literal(config.failureMsg), true);
        }
        return false;
    }

    public boolean attemptStartFire(Level level, BlockPos pos, Player player) {
        return attemptStartFire(level, pos, player, null);
    }

    public boolean canCookOverFire(Level level, BlockPos firePos) {
        return level.getBlockState(firePos).is(Blocks.FIRE);
    }

    public FireConfig getConfig() {
        return config;
    }

    public static class FireConfig {
        public final float baseSuccessRate;
        public final float dryBonus;
        public final float rainPenalty;
        public final float undergroundBonus;
        public final boolean netherAutoIgnite;
        public final int durabilityCost;
        public final int maxDurability;
        public final String rainTooWetMsg;
        public final String successMsg;
        public final String failureMsg;

        public FireConfig(float baseSuccessRate, float dryBonus, float rainPenalty,
                          float undergroundBonus, boolean netherAutoIgnite,
                          int durabilityCost, int maxDurability,
                          String rainTooWetMsg, String successMsg, String failureMsg) {
            this.baseSuccessRate = baseSuccessRate;
            this.dryBonus = dryBonus;
            this.rainPenalty = rainPenalty;
            this.undergroundBonus = undergroundBonus;
            this.netherAutoIgnite = netherAutoIgnite;
            this.durabilityCost = durabilityCost;
            this.maxDurability = maxDurability;
            this.rainTooWetMsg = rainTooWetMsg;
            this.successMsg = successMsg;
            this.failureMsg = failureMsg;
        }
    }
}
