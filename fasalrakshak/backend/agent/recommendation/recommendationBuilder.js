export const buildFinalRecommendation = (draft, risk, cost, score, confidence) => {
    return {
        success: true,
        risk: risk,
        crop: draft.crop,
        disease: draft.disease,
        confidence: confidence,
        overallScore: score,
        recommendations: draft.reasoning,
        fertilizer: draft.fertilizer || null,
        pesticide: draft.pesticide || null,
        irrigation: draft.irrigation || null,
        harvest: draft.harvest || null,
        estimatedCost: cost,
        reasoning: draft.reasoning.join(" "),
        memoryUpdated: true,
        timeline: draft.timeline || "Today"
    };
};
