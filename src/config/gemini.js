// Konfigurasi API Gemini
const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE',
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  maxOutputTokens: 1024,
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
};

export default geminiConfig;