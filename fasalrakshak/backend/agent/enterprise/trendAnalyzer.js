export const analyzeTrends = async (tenantId, metric) => {
    // Simulated trend detection
    return {
        tenantId,
        metric,
        trend: 'Upward',
        direction: '+15%',
        confidence: 88,
        reason: 'Increased rainfall contributing to fungal spread'
    };
};
