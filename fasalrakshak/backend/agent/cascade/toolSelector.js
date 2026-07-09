import { invokeTool } from '../tools/toolManager.js';
import { retrieveMemories } from '../memory/memoryRetriever.js';
import Reflection from '../../models/Reflection.js';

/**
 * Tool Selector
 * Executes the required tool based on the node intent.
 */
export const executeNode = async (node, context, payload = {}) => {
  try {
    if (node.intent === 'Memory') {
      const memories = await retrieveMemories(context.kisanId, payload.message);
      const recentReflection = await Reflection.findOne({ kisanId: context.kisanId }).sort({ timestamp: -1 });
      const reflections = recentReflection ? [recentReflection] : [];
      return { type: 'memory', memories, reflections };
    } else {
      const output = await invokeTool({ intent: node.intent }, context, payload);
      return { type: 'tool', intent: node.intent, output };
    }
  } catch (error) {
    throw new Error(`Execution failed for ${node.intent}: ${error.message}`);
  }
};
