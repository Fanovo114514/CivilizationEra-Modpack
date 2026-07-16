package com.civilizationera.tech.research;

import com.civilizationera.core.era.Era;
import com.civilizationera.faction.faction.FactionType;

import java.util.*;

public class ResearchManager {
    private static ResearchManager instance;
    private final Map<String, TechNode> techTree = new HashMap<>();
    private final Set<String> researchedTechs = new HashSet<>();

    public static void init() {
        instance = new ResearchManager();
        instance.registerDefaultTechs();
    }

    public static ResearchManager getInstance() {
        return instance;
    }

    private void registerDefaultTechs() {
        registerTech(new TechNode("basic_fire", "基础生火", Era.PRIMITIVE_WILDERNESS, 1, Collections.emptyList(), FactionType.FARMERS_ALLIANCE));
        registerTech(new TechNode("wooden_tools", "木制工具", Era.PRIMITIVE, 3, List.of("basic_fire"), null));
        registerTech(new TechNode("primitive_smelting", "原始冶炼", Era.PRIMITIVE, 5, List.of("wooden_tools"), null));
        registerTech(new TechNode("basic_farming", "基础农耕", Era.AGRICULTURAL, 5, List.of("primitive_smelting"), FactionType.FARMERS_ALLIANCE));
        registerTech(new TechNode("copper_smelting", "铜器冶炼", Era.AGRICULTURAL, 8, List.of("basic_farming"), FactionType.MINERS_GUILD));
        registerTech(new TechNode("bronze_smithing", "青铜锻造", Era.AGRICULTURAL, 12, List.of("copper_smelting"), FactionType.MINERS_GUILD));
        registerTech(new TechNode("iron_smelting", "铁器冶炼", Era.IRON, 15, List.of("bronze_smithing"), FactionType.INDUSTRIAL_CONSORTIUM));
        registerTech(new TechNode("steam_power", "蒸汽动力", Era.STEAM, 30, List.of("iron_smelting"), FactionType.INDUSTRIAL_CONSORTIUM));
        registerTech(new TechNode("electricity_basics", "电力基础", Era.ELECTRIC, 50, List.of("steam_power"), FactionType.ACADEMY));
        registerTech(new TechNode("computing", "计算技术", Era.INFORMATION, 80, List.of("electricity_basics"), FactionType.ACADEMY));
        registerTech(new TechNode("rocket_science", "火箭科学", Era.INTERSTELLAR, 150, List.of("computing"), FactionType.INDUSTRIAL_CONSORTIUM));
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
        List<TechNode> available = new ArrayList<>();
        for (TechNode tech : techTree.values()) {
            if (tech.getEra().getIndex() <= era.getIndex() && canResearch(tech.getId())) {
                available.add(tech);
            }
        }
        return available;
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
