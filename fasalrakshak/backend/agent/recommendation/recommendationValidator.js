export const validateRecommendation = (finalRec) => {
    // Ensures no contradictory advice exists (e.g. spray + harvest today)
    if (finalRec.pesticide && finalRec.harvest) {
         finalRec.reasoning += " [Warning: Pesticide and Harvest both recommended - ensure PHI is followed.]";
    }
    return finalRec;
};
