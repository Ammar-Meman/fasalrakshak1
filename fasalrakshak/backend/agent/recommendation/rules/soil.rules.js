export const applySoilRules = (context, toolOutputs, draftRecommendation) => {
    const soil = toolOutputs['Soil'] || {};
    
    if (soil.success && soil.analysis) {
        const lowerAnalysis = soil.analysis.toLowerCase();
        if (lowerAnalysis.includes('nitrogen deficiency')) {
            draftRecommendation.reasoning.push("Nitrogen deficiency detected: Prioritizing Urea or N-rich compost.");
            if (!draftRecommendation.fertilizer) {
                draftRecommendation.fertilizer = { name: "Urea", quantity: "As per crop requirement", type: "Chemical" };
            }
            draftRecommendation.decisionPath.push("soil.rules: nitrogen boost");
        }
        if (lowerAnalysis.includes('phosphorus deficiency')) {
            draftRecommendation.reasoning.push("Phosphorus deficiency detected: Prioritizing DAP.");
            if (!draftRecommendation.fertilizer) {
                draftRecommendation.fertilizer = { name: "DAP", quantity: "Standard basal dose", type: "Chemical" };
            }
            draftRecommendation.decisionPath.push("soil.rules: phosphorus boost");
        }
    }
    return draftRecommendation;
};
