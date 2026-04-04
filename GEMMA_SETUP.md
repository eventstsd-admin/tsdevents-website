# Gemma 3 12B AI Assistant Setup Guide

This guide will help you integrate Google's Gemma 3 12B model into the TSD Events AI Assistant using Google AI Studio API.

## Step 1: Install Dependencies

First, install the Google Generative AI library:

```bash
npm install @google/generative-ai
```

## Step 2: Get Your Google AI Studio API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Choose your existing Google Cloud project or create a new one
4. Copy the generated API key

## Step 3: Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your API key:
   ```
   VITE_GOOGLE_AI_API_KEY=your_api_key_here
   ```

   Replace `your_api_key_here` with the API key you copied from Google AI Studio.

## Step 4: Verify the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser
3. Click the chat icon in the bottom right
4. Ask the AI assistant a question about TSD Events services

The AI assistant should now respond using the Gemma 3 12B model!

## Features

The AI assistant now includes:

- **Real AI Responses**: Uses Google's Gemma 3 12B model for intelligent, context-aware responses
- **Event-Aware**: Trained to understand TSD Events services and provide relevant information
- **Safety Guards**: Includes harmful content filters
- **Chat History**: Maintains conversation context for more natural interactions
- **Loading States**: Shows visual feedback while the AI is generating responses
- **Error Handling**: Graceful error messages if the API encounters issues

## API Configuration Details

The chatbot is configured with:

- **Model**: Uses `gemini-1.5-flash` for optimal response quality and speed
- **Max Output Tokens**: 300 (concise responses)
- **Temperature**: 0.7 (balanced between creative and factual)
- **Safety Settings**: Blocks harassment and hate speech content

## Troubleshooting

### "API Key not configured" error
- Make sure `.env.local` file exists in the root directory
- Verify `VITE_GOOGLE_AI_API_KEY` is set correctly
- Restart your development server after adding the key

### "Model not found" error
- Check that your Google Cloud project has the Generative AI API enabled
- Verify you're using a valid API key from Google AI Studio

### Rate Limiting
- Free tier has usage limits. If you hit them, consider switching to a paid plan
- Check Google Cloud Console for usage statistics

## More Information

- [Google AI Studio](https://aistudio.google.com/)
- [Generative AI Python Client Library](https://github.com/google/generative-ai-js)
- [Gemma Model Details](https://ai.google.dev/models/gemma)
