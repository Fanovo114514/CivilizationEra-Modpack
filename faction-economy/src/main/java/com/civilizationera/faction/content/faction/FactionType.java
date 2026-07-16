package com.civilizationera.faction.content.faction;

public enum FactionType {
    FARMERS_ALLIANCE("farmers_alliance", "农庄联盟", FactionAlignment.FRIENDLY, "农业/友善"),
    MINERS_GUILD("miners_guild", "矿业公会", FactionAlignment.NEUTRAL, "采矿/中立"),
    INDUSTRIAL_CONSORTIUM("industrial_consortium", "工业财团", FactionAlignment.COMPETITIVE, "制造/竞争"),
    MERCHANTS_CHAMBER("merchants_chamber", "商人商会", FactionAlignment.FRIENDLY, "贸易/友善"),
    ACADEMY("academy", "学术院", FactionAlignment.MYSTERIOUS, "研究/神秘"),
    UNDERGROUND_MARKET("underground_market", "地下黑市", FactionAlignment.HOSTILE, "灰产/敌对");

    private final String id;
    private final String displayName;
    private final FactionAlignment alignment;
    private final String description;

    FactionType(String id, String displayName, FactionAlignment alignment, String description) {
        this.id = id;
        this.displayName = displayName;
        this.alignment = alignment;
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public FactionAlignment getAlignment() {
        return alignment;
    }

    public String getDescription() {
        return description;
    }

    public enum FactionAlignment {
        FRIENDLY("友善"),
        NEUTRAL("中立"),
        COMPETITIVE("竞争"),
        MYSTERIOUS("神秘"),
        HOSTILE("敌对");

        private final String displayName;

        FactionAlignment(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
