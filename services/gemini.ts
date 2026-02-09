import { GoogleGenAI } from "@google/genai";

export const enhancePost = async (content: string, category: string): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("❌ VITE_GEMINI_API_KEY not found in environment");
      return getContextAwareFallback(content, category);
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `The following is a community post about ${category}: "${content}"`,
      config: {
        systemInstruction: "You are a mental health advocate for the Centre for Addiction and Mental Health (CAMH) community feed. Generate a single, short (max 20 words), empathetic reflection or supportive tip that adds value to this post. Ensure it is professional yet warm. Do not use quotes. Focus on encouragement and resilience. Make each response unique and personalized to the specific content.",
        temperature: 0.9,
        topP: 0.95,
      },
    });

    const reflection = response.text?.trim();
    if (reflection) {
      console.log("✅ Gemini: Successfully generated unique reflection");
      return reflection;
    }
    
    return getContextAwareFallback(content, category);
    
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error?.message);
    return getContextAwareFallback(content, category);
  }
};

const getContextAwareFallback = (content: string, category: string): string => {
  const fallbacks: Record<string, string[]> = {
    'Anxiety': [
      "Your concerns matter. You're taking brave steps to address them.",
      "Thank you for trusting us with your thoughts. You're not alone.",
      "Acknowledging anxiety is courageous. You're doing great."
    ],
    'Depression': [
      "Your feelings are valid. Thank you for sharing them with us.",
      "Taking each moment is an act of strength. You matter.",
      "You deserve compassion, starting with your own."
    ],
    'Resources': [
      "Thank you for contributing knowledge. Your resources strengthen us all.",
      "Sharing helpful information is a gift to this community.",
      "Your resources help others find their path forward."
    ],
    'General Support': [
      "Thank you for sharing. Your voice matters in this community.",
      "Your experience is valuable. We appreciate your openness.",
      "Sharing helps us all feel less alone. Thank you."
    ]
  };
  
  const messages = fallbacks[category] || fallbacks['General Support'];
  const index = content.length % messages.length;
  return messages[index];
};
