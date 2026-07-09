import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    benchmarkId: { type: String, required: true },
    modelA: { type: String, required: true },
    modelB: { type: String, required: true },
    results: { type: Object },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('Benchmark', schema);
