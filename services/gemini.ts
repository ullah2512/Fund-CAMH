
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client inside the function to ensure it always uses the most up-to-date configuration.

export const enhancePost = async (content: string, category: string): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.");
      return "Thank you for sharing. Your voice matters in this community.";
    }
    
    const ai = new GoogleGenAI({apiKey});
    
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `The following is a community post about ${category}: "${content}"`,
      config: {
        systemInstruction: "You are a mental health advocate for the Centre for Addiction and Mental Health (CAMH) community feed. Generate a single, short (max 20 words), empathetic reflection or supportive tip that adds value to this post. Ensure it is professional yet warm. Do not use quotes. Focus on encouragement and resilience. Make each response unique and personalized to the specific content.",
        temperature: 0.9,
        topP: 0.9,
      },
    });

    return response.text?.trim() || "Thank you for sharing your thoughts with the community.";
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    
    // Provide varied fallback messages
    const fallbacks = [
      "Thank you for sharing. Your voice matters in this community.",
      "Your courage in sharing helps others feel less alone.",
      "Thank you for contributing to this supportive community.",
      "Sharing your experience is a brave and valuable step.",
      "Your words may help someone who needs to hear them today."
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};
