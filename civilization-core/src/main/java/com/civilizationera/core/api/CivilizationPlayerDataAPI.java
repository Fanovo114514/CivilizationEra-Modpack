package com.civilizationera.core.api;

public interface CivilizationPlayerDataAPI {

    int getEvolutionFragments();

    void addEvolutionFragments(int amount);

    boolean useEvolutionFragments(int amount);

    int getCoins();

    void addCoins(int amount);

    boolean useCoins(int amount);
}
