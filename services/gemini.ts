
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client inside the function to ensure it always uses the most up-to-date configuration.

export const enhancePost = async (content: string, category: string): Promise<string> => {
  try {
    // Create a new instance right before the API call as per best practices.
    // Ensure strict named parameter usage for initialization.
    const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env._VITE_GEMINI_API_KEY});
    
    console.log("[Gemini] Starting API call for category:", category);
    console.log("[Gemini] Content preview:", content.substring(0, 50) + "...");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `The following is a community post about ${category}: "${content}"`,
      config: {
        // Utilize systemInstruction for persona and constraint definition.
        systemInstruction: "You are a mental health advocate for the Centre for Addiction and Mental Health (CAMH) community feed. Generate a single, short (max 20 words), empathetic reflection or supportive tip that adds value to this post. Ensure it is professional yet warm. Do not use quotes. Focus on encouragement and resilience.",
        temperature: 0.6,
        topP: 0.9,
      },
    });

    console.log("[Gemini] Raw response object:", JSON.stringify(response, null, 2));
    console.log("[Gemini] response.text value:", response.text);
    console.log("[Gemini] response.candidates:", response.candidates);
    
    // Check if candidates exist and have content
    if (response.candidates && response.candidates.length > 0) {
      console.log("[Gemini] First candidate content:", response.candidates[0].content);
      console.log("[Gemini] First candidate finishReason:", response.candidates[0].finishReason);
    }
    
    // Access text property directly from GenerateContentResponse (not a method).
    const generatedText = response.text?.trim();
    
    if (!generatedText) {
      console.warn("[Gemini] WARNING: API returned empty text, using fallback");
      console.warn("[Gemini] Full response for debugging:", response);
      return "Thank you for sharing your thoughts.";
    }
    
    console.log("[Gemini] Successfully generated reflection:", generatedText);
    return generatedText;
  } catch (error) {
    console.error("[Gemini] Enhancement failed with error:", error);
    return "Thank you for sharing. Remember that reaching out is a powerful step toward healing.";
  }
};
