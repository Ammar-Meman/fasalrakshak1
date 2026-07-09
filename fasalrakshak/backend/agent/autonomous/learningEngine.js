import { processFeedback } from './feedbackProcessor.js';
import { scheduleTraining } from './trainingScheduler.js';
import { updateKnowledgeGraph } from './knowledgeFusion.js';

export const triggerBackgroundLearning = async (kisanId, recommendationId, context) => {
    // This executes asynchronously after the user receives their response.
    console.log(`[Learning Engine] Initiating continuous learning cycle for interaction ${recommendationId}`);
    
    // In a real system, we might queue this for a background worker (e.g. BullMQ)
    try {
        await processFeedback(recommendationId, context);
        await updateKnowledgeGraph(context);
        await scheduleTraining('incremental');
    } catch (e) {
        console.error("[Learning Engine] Background learning failed silently.", e);
    }
};
