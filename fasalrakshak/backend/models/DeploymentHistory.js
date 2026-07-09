import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    modelVersion: { type: String, required: true },
    action: { type: String, enum: ['Deployed', 'Rollback', 'Deprecated'], required: true },
    reason: { type: String },
    metricsAtDeployment: { type: Object },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('DeploymentHistory', schema);
