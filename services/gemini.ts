
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client inside the function to ensure it always uses the most up-to-date configuration.

export const enhancePost = async (content: string, category: string): Promise<string> => {
  try {
    // Create a new instance right before the API call as per best practices.
    // Ensure strict named parameter usage for initialization.
    const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env._VITE_GEMINI_API_KEY});
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The following is a community post about ${category}: "${content}"`,
      config: {
        // Utilize systemInstruction for persona and constraint definition.
        systemInstruction: "You are a mental health advocate for the Centre for Addiction and Mental Health (CAMH) community feed. Generate a single, short (max 20 words), empathetic reflection or supportive tip that adds value to this post. Ensure it is professional yet warm. Do not use quotes. Focus on encouragement and resilience.",
        temperature: 0.6,
        topP: 0.9,
      },
    });

    // Access text property directly from GenerateContentResponse (not a method).
    return response.text?.trim() || "Thank you for sharing your thoughts.";
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    return "Thank you for sharing. Remember that reaching out is a powerful step toward healing.";
  }
};
