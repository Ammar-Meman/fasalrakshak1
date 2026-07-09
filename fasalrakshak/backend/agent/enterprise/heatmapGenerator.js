import RiskMap from '../../models/RiskMap.js';

export const generateHeatmap = async (tenantId, region) => {
    try {
        // Simulates heatmap generation for frontend mapping tools
        const heatmapData = {
            grid: [
                { lat: 22.3, lng: 70.8, weight: 0.9 }, // High risk
                { lat: 22.4, lng: 70.9, weight: 0.2 }  // Low risk
            ]
        };
        const riskMap = new RiskMap({ tenantId, region, heatmapData });
        await riskMap.save();
        return riskMap;
    } catch (e) {
        console.error("Heatmap generation failed", e);
    }
};
