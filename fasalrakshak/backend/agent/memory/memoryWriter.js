import Memory from '../../models/Memory.js';

/**
 * Persists new memories to the database.
 * If a highly similar memory exists, it updates the existing one (increases timesUsed/confidence).
 */
export const saveMemories = async (kisanId, extractedFacts) => {
  if (!extractedFacts || extractedFacts.length === 0) return [];

  const savedMemories = [];

  for (const factObj of extractedFacts) {
    try {
      // Basic deduplication: find exact match for this user and category and fact
      // In a real semantic system, we'd use vector similarity to merge similar facts.
      const existing = await Memory.findOne({
        kisanId,
        category: factObj.category,
        fact: factObj.fact
      });

      if (existing) {
        existing.timesUsed += 1;
        existing.lastAccessed = Date.now();
        await existing.save();
        savedMemories.push(existing);
      } else {
        const newMemory = new Memory({
          kisanId,
          category: factObj.category,
          importance: factObj.importance || 'Medium',
          fact: factObj.fact,
          confidence: factObj.confidence || 1.0,
          source: factObj.source || 'conversation'
        });
        await newMemory.save();
        savedMemories.push(newMemory);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[MEMORY STORED] ${newMemory.category}: ${newMemory.fact} (Importance: ${newMemory.importance})`);
        }
      }
    } catch (error) {
      console.error("[MEMORY WRITER ERROR]", error);
    }
  }

  return savedMemories;
};
