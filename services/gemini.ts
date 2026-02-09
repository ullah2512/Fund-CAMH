
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client inside the function to ensure it always uses the most up-to-date configuration.

/**
 * Error type for distinguishing different API failure scenarios
 */
enum GeminiErrorType {
  INVALID_API_KEY = 'INVALID_API_KEY',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Generates a context-aware fallback message based on the post content and category
 */
const generateContextAwareFallback = (content: string, category: string): string => {
  // Extract key themes from content (simple keyword matching)
  const lowerContent = content.toLowerCase();
  const themes = {
    strength: ['strong', 'strength', 'brave', 'courage', 'resilient', 'overcome'],
    hope: ['hope', 'better', 'improve', 'forward', 'future', 'tomorrow'],
    support: ['help', 'support', 'together', 'community', 'friend', 'talk'],
    healing: ['heal', 'recover', 'progress', 'journey', 'step', 'process'],
    gratitude: ['thank', 'grateful', 'appreciate', 'blessed', 'grateful'],
  };

  // Find matching themes
  const matchedTheme = Object.entries(themes).find(([_, keywords]) =>
    keywords.some(keyword => lowerContent.includes(keyword))
  )?.[0];

  // Category-specific fallback messages with variations
  const fallbackMessages: Record<string, string[]> = {
    Anxiety: [
      "Thank you for sharing. Your courage in expressing this matters.",
      "You're taking an important step by reaching out. Keep moving forward.",
      "Thank you for trusting us with your thoughts. You're not alone in this.",
    ],
    Depression: [
      "Thank you for opening up. Every small step forward counts.",
      "Your voice matters here. Thank you for sharing your experience.",
      "Reaching out is a sign of strength. Thank you for being here.",
    ],
    'General Support': [
      "Thank you for contributing to our community. Your words matter.",
      "We appreciate you sharing this with us. You're making a difference.",
      "Thank you for being part of this supportive space.",
    ],
    Resources: [
      "Thank you for sharing this resource. It may help someone in need.",
      "We appreciate you contributing helpful information to the community.",
      "Thank you for taking the time to share this with others.",
    ],
  };

  // Theme-based fallback messages
  const themeMessages: Record<string, string> = {
    strength: "Your strength in sharing this is evident. Keep going.",
    hope: "Thank you for your hopeful message. It can inspire others.",
    support: "Thank you for fostering connection and support here.",
    healing: "Your journey matters. Thank you for sharing this part of it.",
    gratitude: "Your gratitude shines through. Thank you for sharing positivity.",
  };

  // Select appropriate message
  if (matchedTheme && themeMessages[matchedTheme]) {
    return themeMessages[matchedTheme];
  }

  // Use category-specific messages with pseudo-random selection based on content length
  const categoryMessages = fallbackMessages[category] || fallbackMessages['General Support'];
  const index = content.length % categoryMessages.length;
  return categoryMessages[index];
};

/**
 * Classifies the error type for better logging and handling
 */
const classifyError = (error: any): GeminiErrorType => {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();

  if (errorMessage.includes('api key') || errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
    return GeminiErrorType.INVALID_API_KEY;
  }
  if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
    return GeminiErrorType.QUOTA_EXCEEDED;
  }
  if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('timeout')) {
    return GeminiErrorType.NETWORK_ERROR;
  }
  if (errorMessage.includes('response') || errorMessage.includes('parse')) {
    return GeminiErrorType.INVALID_RESPONSE;
  }

  return GeminiErrorType.UNKNOWN_ERROR;
};

/**
 * Logs detailed information about API failures
 */
const logApiFailure = (errorType: GeminiErrorType, error: any, category: string, contentPreview: string) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] Gemini API Fallback Triggered:`, {
    errorType,
    category,
    contentPreview: contentPreview.substring(0, 50) + '...',
    errorDetails: error?.message || String(error),
  });
  
  // Log specific recommendations based on error type
  switch (errorType) {
    case GeminiErrorType.INVALID_API_KEY:
      console.error('⚠️  GEMINI API KEY ISSUE: Please verify VITE_GEMINI_API_KEY environment variable is set correctly.');
      break;
    case GeminiErrorType.QUOTA_EXCEEDED:
      console.error('⚠️  GEMINI QUOTA EXCEEDED: API usage limit reached. Consider upgrading your plan.');
      break;
    case GeminiErrorType.NETWORK_ERROR:
      console.warn('⚠️  NETWORK ERROR: Temporary connectivity issue. Will retry on next request.');
      break;
  }
};

export const enhancePost = async (content: string, category: string): Promise<string> => {
  try {
    // Validate input
    if (!content || !content.trim()) {
      console.warn('Empty content provided to enhancePost');
      return generateContextAwareFallback(content, category);
    }

    // Create a new instance right before the API call as per best practices.
    // Ensure strict named parameter usage for initialization.
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || import.meta.env?._VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('⚠️  GEMINI API KEY MISSING: No API key found in environment variables.');
      return generateContextAwareFallback(content, category);
    }

    const ai = new GoogleGenAI({apiKey});
    
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
    const generatedText = response.text?.trim();
    
    if (!generatedText || generatedText.length === 0) {
      console.warn('Gemini API returned empty response');
      logApiFailure(GeminiErrorType.INVALID_RESPONSE, 'Empty response from API', category, content);
      return generateContextAwareFallback(content, category);
    }

    // Log successful generation (can be useful for monitoring)
    console.log(`✓ Gemini AI reflection generated successfully for ${category} post`);
    return generatedText;

  } catch (error) {
    // Classify and log the error
    const errorType = classifyError(error);
    logApiFailure(errorType, error, category, content);
    
    // Return context-aware fallback instead of generic message
    return generateContextAwareFallback(content, category);
  }
};
