import StateInsight from '../../models/StateInsight.js';

export const analyzeState = async (tenantId, stateName, metrics) => {
    try {
        const insight = new StateInsight({ tenantId, stateName, metrics });
        await insight.save();
        return insight;
    } catch (e) {
        console.error("State analysis failed", e);
    }
};
