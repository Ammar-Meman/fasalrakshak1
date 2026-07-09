export const getCompanyDashboardData = async (tenantId) => {
    return {
        tenantId,
        role: 'Company',
        totalFarmers: 20000,
        fertilizerUsageTrend: '+12%',
        marketOpportunity: 'High'
    };
};
