import { getGovDashboardData } from '../agent/enterprise/dashboards/government.js';
import { getCoopDashboardData } from '../agent/enterprise/dashboards/cooperative.js';
import { getCompanyDashboardData } from '../agent/enterprise/dashboards/company.js';
import { getFPODashboardData } from '../agent/enterprise/dashboards/fpo.js';
import { generateHeatmap } from '../agent/enterprise/heatmapGenerator.js';
import { calculateKPIs } from '../agent/enterprise/kpiEngine.js';

export const getDashboard = async (req, res) => {
    try {
        const { role, tenantId } = req.query;
        let data;
        switch (role) {
            case 'Government': data = await getGovDashboardData(tenantId); break;
            case 'Cooperative': data = await getCoopDashboardData(tenantId); break;
            case 'Company': data = await getCompanyDashboardData(tenantId); break;
            case 'FPO': data = await getFPODashboardData(tenantId); break;
            default: return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        res.status(200).json({ success: true, data });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

export const getHeatmap = async (req, res) => {
    try {
        const data = await generateHeatmap(req.query.tenantId, req.query.region);
        res.status(200).json({ success: true, data });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

export const getKPIs = async (req, res) => {
    try {
        const data = await calculateKPIs(req.query.tenantId);
        res.status(200).json({ success: true, data });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};
