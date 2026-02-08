<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/17UzW6Jodb_yfEvZYN7ZzLMpDvCmsZz8C

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. **Set up Gemini API:**
   - Get your API key from: https://aistudio.google.com/app/apikey
   - Make sure billing is activated on your Google Cloud account
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your API key to `.env`:
     ```
     VITE_GEMINI_API_KEY=your_actual_api_key_here
     ```
   - **Important:** Never commit your `.env` file to version control!

3. Run the app:
   ```bash
   npm run dev
   ```

## Setting Up Gemini API

The app uses Google's Gemini API to generate AI-powered reflections for community posts.

### Steps:
1. Get your API key from: https://aistudio.google.com/app/apikey
2. Make sure billing is activated on your Google Cloud account
3. Copy `.env.example` to `.env`
4. Add your API key to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
5. Restart your development server

**Important:** Never commit your `.env` file to version control!
