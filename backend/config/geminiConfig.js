import { GoogleGenAI } from "@google/genai";

// Two clients so image extraction and chat can use separate API keys/quotas if needed.
const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const geminiChat = new GoogleGenAI({
  apiKey: process.env.GEMINI_CHAT_API_KEY,
});

export { gemini, geminiChat };
