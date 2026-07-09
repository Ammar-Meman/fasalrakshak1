export const getGovDashboardData = async (tenantId) => {
    // Aggregates State and National insights
    return {
        tenantId,
        role: 'Government',
        totalFarmers: 500000,
        activeOutbreaks: 12,
        stateRiskScore: 45
    };
};
