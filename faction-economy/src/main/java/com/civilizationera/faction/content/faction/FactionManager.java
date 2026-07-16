package com.civilizationera.faction.content.faction;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

public class FactionManager {
    private static FactionManager instance;
    private final Map<FactionType, Integer> reputation = new EnumMap<>(FactionType.class);
    private final Set<Set<FactionType>> opposingPairs = new HashSet<>();
    private final List<ReputationLevel> reputationLevels = new ArrayList<>();
    private final FactionConfig config;

    public static void init() {
        instance = new FactionManager();
    }

    public static FactionManager getInstance() {
        return instance;
    }

    public FactionManager() {
        this.config = loadConfig();
        for (FactionType faction : FactionType.values()) {
            reputation.put(faction, 0);
        }
        loadOpposingFactions();
        loadReputationLevels();
    }

    private FactionConfig loadConfig() {
        try {
            InputStream is = getClass().getResourceAsStream("/assets/faction_economy/config/faction_relations.json");
            if (is != null) {
                JsonObject json = new Gson().fromJson(new InputStreamReader(is), JsonObject.class);
                JsonObject rep = json.getAsJsonObject("reputation");
                return new FactionConfig(
                    rep.get("min").getAsInt(),
                    rep.get("max").getAsInt(),
                    rep.get("opposing_decay_factor").getAsFloat()
                );
            }
        } catch (Exception ignored) {}
        return new FactionConfig(-100, 100, 0.5f);
    }

    private void loadOpposingFactions() {
        try {
            InputStream is = getClass().getResourceAsStream("/assets/faction_economy/config/faction_relations.json");
            if (is != null) {
                JsonObject json = new Gson().fromJson(new InputStreamReader(is), JsonObject.class);
                JsonArray pairs = json.getAsJsonArray("opposing_factions");
                for (int i = 0; i < pairs.size(); i++) {
                    JsonArray pair = pairs.get(i).getAsJsonArray();
                    FactionType a = FactionType.valueOf(pair.get(0).getAsString().toUpperCase());
                    FactionType b = FactionType.valueOf(pair.get(1).getAsString().toUpperCase());
                    opposingPairs.add(EnumSet.of(a, b));
                }
                return;
            }
        } catch (Exception ignored) {}
        opposingPairs.add(EnumSet.of(FactionType.FARMERS_ALLIANCE, FactionType.INDUSTRIAL_CONSORTIUM));
        opposingPairs.add(EnumSet.of(FactionType.ACADEMY, FactionType.UNDERGROUND_MARKET));
    }

    private void loadReputationLevels() {
        try {
            InputStream is = getClass().getResourceAsStream("/assets/faction_economy/config/faction_relations.json");
            if (is != null) {
                JsonObject json = new Gson().fromJson(new InputStreamReader(is), JsonObject.class);
                JsonArray levels = json.getAsJsonArray("reputation_levels");
                for (int i = 0; i < levels.size(); i++) {
                    JsonObject level = levels.get(i).getAsJsonObject();
                    reputationLevels.add(new ReputationLevel(
                        level.get("level").getAsString(),
                        level.get("threshold").getAsInt(),
                        level.get("display_name").getAsString()
                    ));
                }
                reputationLevels.sort(Comparator.comparingInt(l -> l.threshold));
                return;
            }
        } catch (Exception ignored) {}
        reputationLevels.add(new ReputationLevel("HATED", -60, "仇恨"));
        reputationLevels.add(new ReputationLevel("HOSTILE", -40, "敌对"));
        reputationLevels.add(new ReputationLevel("UNFRIENDLY", -20, "冷淡"));
        reputationLevels.add(new ReputationLevel("NEUTRAL", 0, "中立"));
        reputationLevels.add(new ReputationLevel("FRIENDLY", 20, "友好"));
        reputationLevels.add(new ReputationLevel("LIKED", 40, "友善"));
        reputationLevels.add(new ReputationLevel("HONORED", 60, "尊敬"));
        reputationLevels.add(new ReputationLevel("EXALTED", 80, "崇拜"));
    }

    public int getReputation(FactionType faction) {
        return reputation.getOrDefault(faction, 0);
    }

    public void addReputation(FactionType faction, int amount) {
        int current = reputation.getOrDefault(faction, 0);
        reputation.put(faction, Math.max(config.minRep, Math.min(config.maxRep, current + amount)));
        adjustOpposingFactions(faction, (int) (-amount * config.opposingDecayFactor));
    }

    private void adjustOpposingFactions(FactionType changedFaction, int amount) {
        for (FactionType faction : FactionType.values()) {
            if (faction != changedFaction && isOpposing(changedFaction, faction)) {
                int current = reputation.getOrDefault(faction, 0);
                reputation.put(faction, Math.max(config.minRep, Math.min(config.maxRep, current + amount)));
            }
        }
    }

    private boolean isOpposing(FactionType a, FactionType b) {
        return opposingPairs.contains(EnumSet.of(a, b));
    }

    public ReputationLevel getReputationLevel(FactionType faction) {
        int rep = getReputation(faction);
        ReputationLevel result = reputationLevels.get(0);
        for (ReputationLevel level : reputationLevels) {
            if (rep >= level.threshold) {
                result = level;
            }
        }
        return result;
    }

    public List<ReputationLevel> getReputationLevels() {
        return Collections.unmodifiableList(reputationLevels);
    }

    public FactionConfig getConfig() {
        return config;
    }

    public static class ReputationLevel {
        public final String name;
        public final int threshold;
        public final String displayName;

        public ReputationLevel(String name, int threshold, String displayName) {
            this.name = name;
            this.threshold = threshold;
            this.displayName = displayName;
        }

        public String getName() {
            return name;
        }

        public int getThreshold() {
            return threshold;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public static class FactionConfig {
        public final int minRep;
        public final int maxRep;
        public final float opposingDecayFactor;

        public FactionConfig(int minRep, int maxRep, float opposingDecayFactor) {
            this.minRep = minRep;
            this.maxRep = maxRep;
            this.opposingDecayFactor = opposingDecayFactor;
        }
    }
}
