import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    clusterName: { type: String, required: true },
    criteria: { type: Object }, // e.g. { crop: "Tomato", region: "Rajkot" }
    farmerCount: { type: Number, default: 0 },
    averageRisk: { type: String },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('FarmerCluster', schema);
