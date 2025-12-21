import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const NARAKEET_API_URL = 'https://api.narakeet.com/text-to-speech/m4a';

/**
 * Synthesize speech from text using Narakeet API
 * @param {string} text - Text to convert to speech
 * @returns {Promise<Buffer>} - Audio buffer in m4a format
 */
export async function synthesizeSpeech(text) {
  try {
    if (!process.env.NARAKEET_API_KEY) {
      throw new Error('NARAKEET_API_KEY is not configured');
    }

    const response = await axios.post(
      NARAKEET_API_URL,
      text,
      {
        headers: {
          'x-api-key': process.env.NARAKEET_API_KEY,
          'Content-Type': 'text/plain',
          'Accept': 'application/octet-stream',
          'x-voice': 'aidar', // Kazakh voice
        },
        responseType: 'arraybuffer',
        timeout: 10000, // 10 seconds timeout
      }
    );

    if (!response.data || response.data.byteLength === 0) {
      throw new Error('Empty audio response from Narakeet');
    }

    return Buffer.from(response.data);
  } catch (error) {
    console.error('Narakeet TTS Error:', error.message);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }

    throw new Error(`Text-to-speech failed: ${error.message}`);
  }
}
