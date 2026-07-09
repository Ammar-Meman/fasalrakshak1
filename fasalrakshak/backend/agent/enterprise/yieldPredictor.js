import YieldPrediction from '../../models/YieldPrediction.js';

export const predictYield = async (tenantId, entity, entityName) => {
    try {
        const prediction = new YieldPrediction({
            tenantId,
            entity,
            entityName,
            predictedYield: Math.floor(Math.random() * 500) + 100, // Mock yield
            confidence: 90
        });
        await prediction.save();
        return prediction;
    } catch (e) {
        console.error("Yield prediction failed", e);
    }
};
