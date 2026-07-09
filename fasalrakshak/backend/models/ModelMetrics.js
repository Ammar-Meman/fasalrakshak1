import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    modelVersion: { type: String, required: true },
    latencyAvg: { type: Number },
    driftScore: { type: Number },
    falsePositiveRate: { type: Number },
    falseNegativeRate: { type: Number },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('ModelMetrics', schema);
