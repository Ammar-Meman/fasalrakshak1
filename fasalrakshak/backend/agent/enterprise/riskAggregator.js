export const aggregateRisk = (tenantId, region) => {
    // Calculates macro risk score
    return {
        tenantId,
        region,
        riskScore: 82,
        riskCategory: 'High',
        priority: 'Urgent'
    };
};
