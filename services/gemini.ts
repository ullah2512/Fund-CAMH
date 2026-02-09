import { GoogleGenAI } from "@google/genai";

enum GeminiErrorType {
  MISSING_API_KEY = "MISSING_API_KEY",
  INVALID_API_KEY = "INVALID_API_KEY",
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
  NETWORK_ERROR = "NETWORK_ERROR",
  INVALID_RESPONSE = "INVALID_RESPONSE",
  UNKNOWN = "UNKNOWN"
}

interface GeminiError {
  type: GeminiErrorType;
  message: string;
  timestamp: string;
}

const getCategoryFallbacks = (category: string): string[] => {
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
  return fallbacks[category] || fallbacks['General Support'];
};

const detectTheme = (content: string): string => {
  const themes = {
    strength: ['strong', 'strength', 'resilient', 'courage', 'brave'],
    hope: ['hope', 'hopeful', 'better', 'improve', 'positive'],
    healing: ['heal', 'healing', 'recover', 'progress', 'better'],
    support: ['support', 'help', 'there', 'together', 'community'],
    gratitude: ['thank', 'grateful', 'appreciate', 'glad']
  };
  
  const lowerContent = content.toLowerCase();
  for (const [theme, keywords] of Object.entries(themes)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      return theme;
    }
  }
  return 'general';
};

const generateContextAwareFallback = (content: string, category: string): string => {
  const fallbacks = getCategoryFallbacks(category);
  const index = content.length % fallbacks.length;
  return fallbacks[index];
};

const classifyError = (error: any): GeminiErrorType => {
  const errorMsg = error?.message?.toLowerCase() || '';
  if (errorMsg.includes('api key') || errorMsg.includes('authentication')) {
    return GeminiErrorType.INVALID_API_KEY;
  }
  if (errorMsg.includes('quota') || errorMsg.includes('429')) {
    return GeminiErrorType.QUOTA_EXCEEDED;
  }
  if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
    return GeminiErrorType.NETWORK_ERROR;
  }
  if (errorMsg.includes('response')) {
    return GeminiErrorType.INVALID_RESPONSE;
  }
  return GeminiErrorType.UNKNOWN;
};

const logApiFailure = (error: GeminiError): void => {
  const recommendations: Record<GeminiErrorType, string> = {
    [GeminiErrorType.MISSING_API_KEY]: "Set VITE_GEMINI_API_KEY in Cloud Run environment variables",
    [GeminiErrorType.INVALID_API_KEY]: "Verify VITE_GEMINI_API_KEY is correct (get from aistudio.google.com/app/apikey)",
    [GeminiErrorType.QUOTA_EXCEEDED]: "Check Gemini API quota and billing on Google Cloud Console",
    [GeminiErrorType.NETWORK_ERROR]: "Check network connectivity and Gemini API service status",
    [GeminiErrorType.INVALID_RESPONSE]: "Verify Gemini API response format. Check API status.",
    [GeminiErrorType.UNKNOWN]: "Unexpected error. Check logs for details."
  };  
  
  console.error(`[${error.timestamp}] Gemini API Error - Type: ${error.type}`);
  console.error(`Message: ${error.message}`);
  console.error(`Action: ${recommendations[error.type]}`);
};

export const enhancePost = async (content: string, category: string): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      const error: GeminiError = {
        type: GeminiErrorType.MISSING_API_KEY,
        message: "VITE_GEMINI_API_KEY not found in environment",
        timestamp: new Date().toISOString()
      };
      logApiFailure(error);
      return generateContextAwareFallback(content, category);
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
      console.log("[Gemini] ✅ Successfully generated unique reflection");
      return reflection;
    }
    
    return generateContextAwareFallback(content, category);
    
  } catch (error: any) {
    const errorType = classifyError(error);
    const geminiError: GeminiError = {
      type: errorType,
      message: error?.message || "Unknown error occurred",
      timestamp: new Date().toISOString()
    };
    
    logApiFailure(geminiError);
    return generateContextAwareFallback(content, category);
  }
};
