import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    channel: { type: String, enum: ['SMS', 'WhatsApp', 'Email', 'Push', 'Dashboard'] },
    recipient: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Sent', 'Failed'], default: 'Pending' },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('Notification', schema);
