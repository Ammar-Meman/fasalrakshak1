import FarmerCluster from '../../models/FarmerCluster.js';

export const clusterFarmers = async (tenantId, crop, region) => {
    // Finds or creates a cluster
    try {
        let cluster = await FarmerCluster.findOne({ tenantId, clusterName: `${region}_${crop}` });
        if (!cluster) {
            cluster = new FarmerCluster({
                tenantId,
                clusterName: `${region}_${crop}`,
                criteria: { crop, region },
                farmerCount: 1,
                averageRisk: 'Low'
            });
        } else {
            cluster.farmerCount += 1;
        }
        await cluster.save();
        return cluster;
    } catch (e) {
        console.error("Clustering failed", e);
    }
};
