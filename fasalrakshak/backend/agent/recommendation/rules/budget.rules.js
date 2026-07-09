export const applyBudgetRules = (context, toolOutputs, draftRecommendation) => {
    const budget = context.profile?.budget || 'Medium';
    
    if (budget === 'Low' && draftRecommendation.estimatedCost > 1000) {
        draftRecommendation.reasoning.push("Low budget detected: Replaced premium treatments with cost-effective alternatives.");
        // Simulated reduction
        draftRecommendation.estimatedCost = Math.floor(draftRecommendation.estimatedCost * 0.6);
        draftRecommendation.decisionPath.push("budget.rules: optimized cost");
        if (draftRecommendation.fertilizer) {
             draftRecommendation.fertilizer.name = `${draftRecommendation.fertilizer.name} (Subsidized standard brand)`;
        }
    }
    return draftRecommendation;
};
