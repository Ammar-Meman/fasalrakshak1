import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  kisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kisan', required: false },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: false },
  actionType: { type: String, required: true }, // e.g., 'tool_call', 'routing_decision', 'fallback'
  details: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
