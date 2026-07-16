package com.civilizationera.core.api;

import com.civilizationera.core.content.era.Era;

public interface CivilizationEraAPI {

    Era getCurrentEra();

    boolean isEraUnlocked(Era era);

    boolean canAdvanceEra(Era targetEra);

    void advanceToEra(Era era);
}
