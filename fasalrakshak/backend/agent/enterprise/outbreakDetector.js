import Outbreak from '../../models/Outbreak.js';

export const detectOutbreaks = async (tenantId, region, crop, disease) => {
    // Simulated outbreak detection logic
    // In production, this would query Recommendation/Cluster models to find anomalies.
    
    // Simulate anomaly detected
    const anomalyDetected = true; // Mocking 22 out of 150 farmers affected
    
    if (anomalyDetected && disease !== 'Healthy' && disease !== 'Unknown') {
        const outbreak = new Outbreak({
            tenantId,
            disease,
            region,
            affectedFarmers: 22,
            severity: 'High',
            confidence: 94,
            suggestedAction: `Issue emergency spray advisory for ${disease} in ${region}`
        });
        await outbreak.save();
        return outbreak;
    }
    return null;
};
