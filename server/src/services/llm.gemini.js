import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MODEL_NAME = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

const SYSTEM_PROMPT = `You are a Kazakh-speaking voice assistant.
Always respond ONLY in Kazakh language.
Keep answers short, clear, and natural for speech.
Do not use emojis or markdown.
Be helpful, friendly, and conversational.`;

/**
 * Generate AI response using Google Gemini (REST API via axios).
 * Uses direct HTTP instead of SDK fetch — more reliable in serverless (e.g. Vercel).
 * @param {string} userMessage - User's transcribed message
 * @returns {Promise<string>} - AI response text
 */
export async function generateResponse(userMessage) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`;

    const { data } = await axios.post(
      `${GEMINI_URL}?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 22000, // 22s — fail fast on Vercel; reply to user before Telegraf 90s
        validateStatus: (status) => status === 200,
      }
    );

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || String(text).trim().length === 0) {
      return 'Кешіріңіз, мен сіздің сұрағыңызды түсінбедім.';
    }

    return String(text).trim();
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.message?.includes('API key') || error.response?.status === 401) {
      console.error('⚠️  API Key issue. Please verify GEMINI_API_KEY');
    }

    return 'Кешіріңіз, қазір техникалық қиындықтар бар. Кейінірек қайталап көріңіз.';
  }
}
