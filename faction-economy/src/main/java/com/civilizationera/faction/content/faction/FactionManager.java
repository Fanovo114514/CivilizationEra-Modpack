package com.civilizationera.faction.content.faction;

import java.util.EnumMap;
import java.util.Map;

public class FactionManager {
    private static FactionManager instance;
    private final Map<FactionType, Integer> reputation = new EnumMap<>(FactionType.class);

    public static void init() {
        instance = new FactionManager();
    }

    public static FactionManager getInstance() {
        return instance;
    }

    public FactionManager() {
        for (FactionType faction : FactionType.values()) {
            reputation.put(faction, 0);
        }
    }

    public int getReputation(FactionType faction) {
        return reputation.getOrDefault(faction, 0);
    }

    public void addReputation(FactionType faction, int amount) {
        int current = reputation.getOrDefault(faction, 0);
        reputation.put(faction, Math.max(-100, Math.min(100, current + amount)));

        adjustOpposingFactions(faction, -amount / 2);
    }

    private void adjustOpposingFactions(FactionType changedFaction, int amount) {
        for (FactionType faction : FactionType.values()) {
            if (faction != changedFaction && isOpposing(changedFaction, faction)) {
                int current = reputation.getOrDefault(faction, 0);
                reputation.put(faction, Math.max(-100, Math.min(100, current + amount)));
            }
        }
    }

    private boolean isOpposing(FactionType a, FactionType b) {
        if (a == FactionType.FARMERS_ALLIANCE && b == FactionType.INDUSTRIAL_CONSORTIUM) return true;
        if (a == FactionType.INDUSTRIAL_CONSORTIUM && b == FactionType.FARMERS_ALLIANCE) return true;
        if (a == FactionType.ACADEMY && b == FactionType.UNDERGROUND_MARKET) return true;
        if (a == FactionType.UNDERGROUND_MARKET && b == FactionType.ACADEMY) return true;
        return false;
    }

    public ReputationLevel getReputationLevel(FactionType faction) {
        int rep = getReputation(faction);
        if (rep >= 80) return ReputationLevel.EXALTED;
        if (rep >= 60) return ReputationLevel.HONORED;
        if (rep >= 40) return ReputationLevel.LIKED;
        if (rep >= 20) return ReputationLevel.FRIENDLY;
        if (rep >= -20) return ReputationLevel.NEUTRAL;
        if (rep >= -40) return ReputationLevel.UNFRIENDLY;
        if (rep >= -60) return ReputationLevel.HOSTILE;
        return ReputationLevel.HATED;
    }

    public enum ReputationLevel {
        EXALTED(80, "崇拜"),
        HONORED(60, "尊敬"),
        LIKED(40, "友善"),
        FRIENDLY(20, "友好"),
        NEUTRAL(0, "中立"),
        UNFRIENDLY(-20, "冷淡"),
        HOSTILE(-40, "敌对"),
        HATED(-60, "仇恨");

        private final int threshold;
        private final String displayName;

        ReputationLevel(int threshold, String displayName) {
            this.threshold = threshold;
            this.displayName = displayName;
        }

        public int getThreshold() {
            return threshold;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
