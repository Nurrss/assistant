import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a Kazakh-speaking voice assistant.
Always respond ONLY in Kazakh language.
Keep answers short, clear, and natural for speech.
Do not use emojis or markdown.
Be helpful, friendly, and conversational.`;

// Using gemini-1.5-pro for best quality (50 requests/day, better than 2.5-flash)
const MODEL_NAME = 'gemini-1.5-pro';

/**
 * Generate AI response using Google Gemini
 * @param {string} userMessage - User's transcribed message
 * @returns {Promise<string>} - AI response text
 */
export async function generateResponse(userMessage) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Use the confirmed working model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      return 'Кешіріңіз, мен сіздің сұрағыңызды түсінбедім.';
    }

    return text.trim();
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    console.error('Stack:', error.stack);

    // Check if it's an API key issue
    if (error.message.includes('API key') || error.message.includes('401')) {
      console.error(
        '⚠️  API Key issue detected. Please verify your GEMINI_API_KEY'
      );
    }

    // Fallback response in Kazakh
    return 'Кешіріңіз, қазір техникалық қиындықтар бар. Кейінірек қайталап көріңіз.';
  }
}
