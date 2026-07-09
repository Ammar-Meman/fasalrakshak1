export const getCoopDashboardData = async (tenantId) => {
    return {
        tenantId,
        role: 'Cooperative',
        totalFarmers: 5000,
        yieldPredictions: 'High',
        pendingSubsidies: 120
    };
};
