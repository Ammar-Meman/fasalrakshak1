import Reflection from '../../models/Reflection.js';
import Memory from '../../models/Memory.js';
import { callLLM } from '../llm/llmService.js';

export const generateReflection = async (kisanId) => {
  try {
    // Get all memories for this user
    const memories = await Memory.find({ kisanId }).sort({ timestamp: -1 }).limit(20);
    
    if (memories.length < 5) return; // Not enough memories to reflect

    const memoryStrings = memories.map(m => `- ${m.category}: ${m.fact} (Used: ${m.timesUsed})`).join('\n');
    
    const prompt = `
      Analyze the following memories collected about a farmer and generate a single concise reflection summarizing their behavior, preferences, and recurring issues.
      Keep the reflection under 2 sentences. Do not use quotes or introductory phrases.
      
      Memories:
      ${memoryStrings}
    `;

    const llmResponse = await callLLM(prompt);
    
    if (llmResponse.success && llmResponse.text) {
      const reflection = new Reflection({
        kisanId,
        reflection: llmResponse.text.trim()
      });
      await reflection.save();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[REFLECTION GENERATED] ${reflection.reflection}`);
      }
    }
  } catch (error) {
    console.error("[REFLECTION GENERATOR ERROR]", error);
  }
};
