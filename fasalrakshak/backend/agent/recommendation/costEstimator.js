export const calculateEstimatedCost = (recommendation, context) => {
    let totalCost = 0;
    const farmSizeAcres = context.profile?.farmSize || 1;
    
    if (recommendation.pesticide) {
        totalCost += 500 * farmSizeAcres; // baseline pesticide cost per acre
    }
    if (recommendation.fertilizer) {
        totalCost += 800 * farmSizeAcres; // baseline fertilizer cost per acre
    }
    
    return totalCost;
};
