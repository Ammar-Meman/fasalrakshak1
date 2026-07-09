export const getFPODashboardData = async (tenantId) => {
    return {
        tenantId,
        role: 'FPO',
        totalFarmers: 500,
        cropHealth: 'Good',
        harvestReadiness: '2 weeks'
    };
};
