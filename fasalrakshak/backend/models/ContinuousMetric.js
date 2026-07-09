import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    metricName: { type: String, required: true },
    value: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('ContinuousMetric', schema);
