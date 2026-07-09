import mongoose from 'mongoose';

const RecommendationSchema = new mongoose.Schema({
  entityType: { type: String, enum: ['Farmer', 'Farm', 'Field', 'Region', 'Cooperative', 'Company'], default: 'Farmer' },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Usually kisanId
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  crop: { type: String },
  recommendation: { type: Object, required: true }, // Structured JSON
  risk: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'] },
  reasoning: [{ type: String }],
  estimatedCost: { type: Number },
  overallScore: { type: Number },
  confidence: { type: Number },
  decisionPath: [{ type: String }],
  toolOutputs: { type: Object },
  version: { type: String, default: 'v1' },
  status: { type: String, enum: ['Pending', 'Applied', 'Completed', 'Successful', 'Failed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Recommendation', RecommendationSchema);
