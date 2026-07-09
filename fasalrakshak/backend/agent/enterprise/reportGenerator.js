import EnterpriseReport from '../../models/EnterpriseReport.js';

export const generateReport = async (tenantId, type, title, data) => {
    try {
        const report = new EnterpriseReport({
            tenantId,
            type,
            title,
            data
        });
        await report.save();
        return report;
    } catch (e) {
        console.error("Failed to generate report", e);
    }
};
