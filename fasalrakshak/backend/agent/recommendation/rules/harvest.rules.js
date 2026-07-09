export const applyHarvestRules = (context, toolOutputs, draftRecommendation) => {
    // If crop is near harvest, forbid harsh chemicals with long waiting periods
    const isHarvestNear = context.profile?.cropStage === 'Maturity' || context.profile?.cropStage === 'Harvest';
    
    if (isHarvestNear && draftRecommendation.pesticide && draftRecommendation.pesticide.type === 'Chemical') {
        draftRecommendation.reasoning.push("Harvest near: Removing chemical pesticide to ensure safe waiting period (PHI).");
        delete draftRecommendation.pesticide;
        draftRecommendation.harvest = {
            waitingPeriod: "Safe to harvest",
            action: "Proceed with harvest, avoid chemical spray."
        };
        draftRecommendation.decisionPath.push("harvest.rules: stripped chemical spray");
    }
    return draftRecommendation;
};
