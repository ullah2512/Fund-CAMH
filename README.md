<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/17UzW6Jodb_yfEvZYN7ZzLMpDvCmsZz8C

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
   - Copy `.env.local.example` to `.env.local`
   - Get your API key from: https://ai.google.dev/
3. Run the app:
   `npm run dev`

## Features

### AI-Powered Reflections
The application uses Google's Gemini API to generate empathetic, context-aware reflections for user posts. The system includes:
- **Intelligent Error Handling**: Distinguishes between API key issues, quota limits, network errors, and invalid responses
- **Context-Aware Fallbacks**: When the API is unavailable, the system provides varied, theme-based responses instead of generic messages
- **Comprehensive Logging**: Detailed logs help monitor API health and troubleshoot issues

For detailed documentation on the Gemini API integration, see [GEMINI_API_DOCS.md](./GEMINI_API_DOCS.md).

## Testing

Run the Gemini API test suite to verify integration:
```bash
npx tsx test-gemini.ts
```

This will test:
- Variability in fallback responses
- Category-specific message selection
- Theme-based response detection
- Empty content handling
