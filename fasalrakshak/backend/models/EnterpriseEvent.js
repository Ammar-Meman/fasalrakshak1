import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    eventType: { type: String, required: true }, // Rain, Disease, MarketCrash
    location: { type: String },
    details: { type: Object },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('EnterpriseEvent', schema);
