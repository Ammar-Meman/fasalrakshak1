import KnowledgeNode from '../../models/KnowledgeNode.js';
import KnowledgeEdge from '../../models/KnowledgeEdge.js';

export const updateKnowledgeGraph = async (tenantId, crop, disease, location, treatment, success) => {
    try {
        // Find or create nodes
        // Simplified mockup for hackathon demonstration
        const cropNode = await KnowledgeNode.findOneAndUpdate({ tenantId, label: crop }, { type: 'Crop' }, { upsert: true, new: true });
        const diseaseNode = await KnowledgeNode.findOneAndUpdate({ tenantId, label: disease }, { type: 'Disease' }, { upsert: true, new: true });
        
        // Form edge
        if (cropNode && diseaseNode) {
            await KnowledgeEdge.findOneAndUpdate(
                { tenantId, sourceNode: cropNode._id, targetNode: diseaseNode._id },
                { relation: 'AFFECTED_BY', weight: 1.0 },
                { upsert: true }
            );
        }
    } catch (e) {
        console.error("Knowledge Graph update failed", e);
    }
};
