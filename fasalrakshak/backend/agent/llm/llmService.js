/**
 * Standard fetch implementation for Gemini to avoid adding SDK dependencies.
 */

const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
    }
    return response;
  } finally {
    clearTimeout(timer);
  }
};

export const callLLM = async (prompt) => {
  try {
    const geminiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      throw new Error("Gemini API key is not configured.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
    
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
             temperature: 0.3 // Keep it factual for agriculture
          }
        })
      },
      15000
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return { success: true, text };
  } catch (error) {
    console.error("LLM Service Error:", error);
    return { success: false, error: error.message || "Failed to contact LLM" };
  }
};
