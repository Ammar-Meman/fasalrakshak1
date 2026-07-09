import DistrictInsight from '../../models/DistrictInsight.js';

export const analyzeDistrict = async (tenantId, districtName, metrics) => {
    try {
        const insight = new DistrictInsight({ tenantId, districtName, metrics });
        await insight.save();
        return insight;
    } catch (e) {
        console.error("District analysis failed", e);
    }
};
