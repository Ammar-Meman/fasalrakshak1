import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    versionId: { type: String, required: true },
    totalSamples: { type: Number, required: true },
    featureSet: { type: [String] },
    dataHash: { type: String },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('DatasetVersion', schema);
