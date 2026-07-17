package com.civilizationera.tech.content.research;

import com.civilizationera.core.content.era.Era;
import com.civilizationera.faction.content.faction.FactionType;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

public class ResearchManager {
    private static ResearchManager instance;
    private final Map<String, TechNode> techTree = new HashMap<>();
    private final Set<String> researchedTechs = new HashSet<>();

    public static void init() {
        instance = new ResearchManager();
        instance.loadTechTree();
    }

    public static ResearchManager getInstance() {
        return instance;
    }

    private void loadTechTree() {
        try {
            InputStream is = getClass().getResourceAsStream("/assets/tech_research/config/tech_tree.json");
            if (is != null) {
                JsonObject json = new Gson().fromJson(new InputStreamReader(is), JsonObject.class);
                JsonArray techs = json.getAsJsonArray("techs");
                for (JsonElement elem : techs) {
                    JsonObject tech = elem.getAsJsonObject();
                    String id = tech.get("id").getAsString();
                    String displayName = tech.get("display_name").getAsString();
                    Era era = Era.getByName(tech.get("era").getAsString());
                    int fragmentCost = tech.get("fragment_cost").getAsInt();
                    List<String> prerequisites = new ArrayList<>();
                    if (tech.has("prerequisites")) {
                        for (JsonElement pre : tech.getAsJsonArray("prerequisites")) {
                            prerequisites.add(pre.getAsString());
                        }
                    }
                    FactionType faction = null;
                    if (tech.has("faction") && !tech.get("faction").isJsonNull()) {
                        faction = FactionType.valueOf(tech.get("faction").getAsString().toUpperCase());
                    }
                    String description = tech.has("description") ? tech.get("description").getAsString() : "";
                    registerTech(new TechNode(id, displayName, era, fragmentCost, prerequisites, faction, description));
                }
                return;
            }
        } catch (Exception ignored) {}
        registerTech(new TechNode("basic_fire", "基础生火", Era.PRIMITIVE_WILDERNESS, 1, Collections.emptyList(), FactionType.FARMERS_ALLIANCE));
        registerTech(new TechNode("wooden_tools", "木制工具", Era.PRIMITIVE_AGE, 3, List.of("basic_fire"), null));
        registerTech(new TechNode("primitive_smelting", "原始冶炼", Era.PRIMITIVE_AGE, 5, List.of("wooden_tools"), null));
    }

    public void registerTech(TechNode tech) {
        techTree.put(tech.getId(), tech);
    }

    public TechNode getTech(String id) {
        return techTree.get(id);
    }

    public Collection<TechNode> getAllTechs() {
        return techTree.values();
    }

    public boolean isResearched(String techId) {
        return researchedTechs.contains(techId);
    }

    public boolean canResearch(String techId) {
        TechNode tech = techTree.get(techId);
        if (tech == null || isResearched(techId)) {
            return false;
        }
        for (String prerequisite : tech.getPrerequisites()) {
            if (!isResearched(prerequisite)) {
                return false;
            }
        }
        return true;
    }

    public boolean researchTech(String techId, int availableFragments) {
        if (!canResearch(techId)) {
            return false;
        }
        TechNode tech = techTree.get(techId);
        if (availableFragments < tech.getFragmentCost()) {
            return false;
        }
        researchedTechs.add(techId);
        return true;
    }

    public List<TechNode> getAvailableTechs(Era era) {
        return techTree.values().stream()
                .filter(tech -> tech.getEra().getIndex() <= era.getIndex() && canResearch(tech.getId()))
                .collect(Collectors.toList());
    }

    public static class TechNode {
        private final String id;
        private final String displayName;
        private final Era era;
        private final int fragmentCost;
        private final List<String> prerequisites;
        private final FactionType faction;
        private final String description;

        public TechNode(String id, String displayName, Era era, int fragmentCost, List<String> prerequisites, FactionType faction) {
            this(id, displayName, era, fragmentCost, prerequisites, faction, "");
        }

        public TechNode(String id, String displayName, Era era, int fragmentCost, List<String> prerequisites, FactionType faction, String description) {
            this.id = id;
            this.displayName = displayName;
            this.era = era;
            this.fragmentCost = fragmentCost;
            this.prerequisites = prerequisites;
            this.faction = faction;
            this.description = description;
        }

        public String getId() {
            return id;
        }

        public String getDisplayName() {
            return displayName;
        }

        public Era getEra() {
            return era;
        }

        public int getFragmentCost() {
            return fragmentCost;
        }

        public List<String> getPrerequisites() {
            return prerequisites;
        }

        public FactionType getFaction() {
            return faction;
        }

        public String getDescription() {
            return description;
        }
    }
}
