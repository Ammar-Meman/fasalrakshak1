// Resolves conflicts dynamically
export const resolveConflicts = (draftRecommendation) => {
    // Example: if irrigation says 'Delay' but fertilizer says 'Apply basal dose today'
    // Actually, rule engine handled most of this (rain overriding spray/irrigation).
    // This is a final safety net.
    
    if (draftRecommendation.irrigation?.action === 'Delay' && draftRecommendation.fertilizer) {
        if (draftRecommendation.fertilizer.type === 'Chemical') {
            draftRecommendation.reasoning.push("Conflict resolved: Delayed fertilizer application because irrigation is delayed.");
            draftRecommendation.fertilizer.action = 'Delay until irrigation resumes';
        }
    }
    return draftRecommendation;
};
