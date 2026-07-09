import RegionalInsight from '../../models/RegionalInsight.js';

export const analyzeRegion = async (tenantId, regionName, metrics) => {
    try {
        const insight = new RegionalInsight({
            tenantId,
            regionName,
            metrics
        });
        await insight.save();
        return insight;
    } catch (e) {
        console.error("Regional analysis failed", e);
    }
};
