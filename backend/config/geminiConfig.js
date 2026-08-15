import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const geminiChat = new GoogleGenAI({
  apiKey: process.env.GEMINI_CHAT_API_KEY,
});

export { gemini, geminiChat };
