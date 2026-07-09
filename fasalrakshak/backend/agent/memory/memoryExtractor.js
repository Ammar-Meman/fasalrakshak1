import { callLLM } from '../llm/llmService.js';
import { saveMemories } from './memoryWriter.js';

export const extractAndStoreMemories = async (kisanId, message) => {
  if (!message || message.trim().length < 5) return;

  try {
    const prompt = `
      Analyze the following message from a farmer and extract any important persistent facts that should be remembered for future interactions.
      
      Examples of facts to extract:
      - Crop types they grow (e.g. "I grow tomatoes" -> "Grows tomatoes")
      - Farm size (e.g. "My farm is 5 acres" -> "Farm size is 5 acres")
      - Soil type or conditions
      - Disease history (e.g. "My tomatoes had early blight" -> "Experienced early blight on tomatoes")
      - Treatments used (e.g. "I used Mancozeb" -> "Uses Mancozeb fungicide")
      - Preferred language or tone
      - Specific problems they face often
      
      Message: "${message}"
      
      Respond strictly in JSON format as an array of objects. Do not include markdown code blocks. If no facts are present, return an empty array [].
      Each object must have exactly these keys:
      - category: String (e.g. "Crop History", "Farm Details", "Disease History", "Preferences")
      - importance: String ("Critical", "High", "Medium", "Low")
      - fact: String (The actual fact to remember)
      - confidence: Number (0.0 to 1.0)
    `;

    const llmResponse = await callLLM(prompt);
    
    if (llmResponse.success && llmResponse.text) {
      let jsonText = llmResponse.text.trim();
      // Clean markdown if the LLM returned it
      if (jsonText.startsWith('\`\`\`json')) jsonText = jsonText.substring(7);
      if (jsonText.startsWith('\`\`\`')) jsonText = jsonText.substring(3);
      if (jsonText.endsWith('\`\`\`')) jsonText = jsonText.slice(0, -3);
      
      const facts = JSON.parse(jsonText.trim());
      
      if (Array.isArray(facts) && facts.length > 0) {
        await saveMemories(kisanId, facts);
      }
    }
  } catch (error) {
    console.error("[MEMORY EXTRACTOR ERROR]", error);
  }
};
