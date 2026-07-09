import Memory from '../../models/Memory.js';

export const retrieveMemories = async (kisanId, message) => {
  try {
    let memories = [];
    
    // 1. Semantic/Text Search (keyword matching)
    // The message itself is used as the search string
    if (message && message.trim().length > 2) {
      const searchResults = await Memory.find(
        { kisanId, $text: { $search: message } },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(5);
      
      memories.push(...searchResults);
    }
    
    // 2. Add highly important / recent memories if we don't have enough context
    if (memories.length < 5) {
      // Find critical/high importance memories we haven't already included
      const existingIds = memories.map(m => m._id);
      const importantMemories = await Memory.find({
        kisanId,
        _id: { $nin: existingIds },
        importance: { $in: ['Critical', 'High'] }
      })
      .sort({ lastAccessed: -1, timesUsed: -1 })
      .limit(3);
      
      memories.push(...importantMemories);
    }
    
    // 3. Update lastAccessed for retrieved memories asynchronously
    if (memories.length > 0) {
      const memoryIds = memories.map(m => m._id);
      // Non-blocking update
      Memory.updateMany(
        { _id: { $in: memoryIds } },
        { $set: { lastAccessed: Date.now() }, $inc: { timesUsed: 1 } }
      ).catch(err => console.error("Memory update error:", err));
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[MEMORY RETRIEVED] Found ${memories.length} relevant facts for user.`);
      }
    }
    
    return memories;
  } catch (error) {
    // If text index doesn't exist yet, it throws an error. Fallback to basic fetch.
    if (error.code === 27) { // Index not found
      console.warn("Text index not found, falling back to basic query");
      const fallback = await Memory.find({ kisanId }).sort({ lastAccessed: -1 }).limit(5);
      return fallback;
    }
    
    console.error("[MEMORY RETRIEVER ERROR]", error);
    return [];
  }
};
