import EnterpriseKPI from '../../models/EnterpriseKPI.js';

export const calculateKPIs = async (tenantId) => {
    // Simulated KPI calculation
    const kpis = [
        { tenantId, kpiName: 'Disease Rate', value: 14.5, unit: '%' },
        { tenantId, kpiName: 'Yield Rate', value: 3.2, unit: 'Tonnes/Acre' },
        { tenantId, kpiName: 'Farmer Growth', value: 5.4, unit: '%' },
        { tenantId, kpiName: 'Revenue Saved', value: 1250000, unit: 'INR' },
        { tenantId, kpiName: 'Crop Loss Prevented', value: 45, unit: 'Tonnes' },
        { tenantId, kpiName: 'Recommendation Accuracy', value: 92.1, unit: '%' }
    ];
    
    for (const kpi of kpis) {
        await new EnterpriseKPI(kpi).save();
    }
    return kpis;
};
