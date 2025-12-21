import speech from '@google-cloud/speech';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Google Cloud Speech client with flexible credentials
let client;

// For deployment (Render, Vercel, etc.) - use Base64 encoded credentials
if (process.env.GOOGLE_CREDENTIALS_BASE64) {
  const credentialsJson = Buffer.from(
    process.env.GOOGLE_CREDENTIALS_BASE64,
    'base64'
  ).toString('utf-8');
  const credentials = JSON.parse(credentialsJson);

  client = new speech.SpeechClient({
    credentials: credentials,
  });
  console.log('✅ Google STT initialized with Base64 credentials');
}
// For local development - use credentials file
else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  client = new speech.SpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
  console.log('✅ Google STT initialized with credentials file');
}
// Fallback - try default credentials
else {
  client = new speech.SpeechClient();
  console.log('⚠️  Google STT using default credentials (may not work)');
}

/**
 * Detect audio encoding from buffer
 * @param {Buffer} audioBuffer - Audio buffer
 * @returns {string} - Detected encoding type
 */
function detectAudioEncoding(audioBuffer) {
  // Check file signature (magic bytes)
  const header = audioBuffer.slice(0, 12).toString('hex');

  // WebM signature: 1a 45 df a3
  if (header.startsWith('1a45dfa3')) {
    return 'WEBM_OPUS';
  }

  // MP4/M4A signature: 66 74 79 70 (ftyp)
  if (audioBuffer.toString('ascii', 4, 8) === 'ftyp') {
    return 'MP3'; // Google STT treats MP4/AAC as MP3 encoding
  }

  // Default to WEBM_OPUS
  return 'WEBM_OPUS';
}

/**
 * Transcribe audio using Google Cloud Speech-to-Text
 * @param {Buffer} audioBuffer - Audio buffer (webm, mp4, or aac format)
 * @returns {Promise<string>} - Transcribed text
 */
export async function transcribeAudio(audioBuffer) {
  try {
    // Detect encoding
    const encoding = detectAudioEncoding(audioBuffer);
    console.log(`Detected audio encoding: ${encoding}`);

    const request = {
      audio: {
        content: audioBuffer.toString('base64'),
      },
      config: {
        encoding: encoding,
        sampleRateHertz: 48000,
        languageCode: 'kk-KZ',
        model: 'default',
        enableAutomaticPunctuation: true,
      },
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    if (!transcription || transcription.trim().length === 0) {
      throw new Error('No speech detected in audio');
    }

    // Check confidence (optional)
    const confidence = response.results[0]?.alternatives[0]?.confidence || 0;
    console.log(`STT Confidence: ${confidence}`);

    if (confidence < 0.5) {
      console.warn('Low STT confidence, but proceeding with transcription');
    }

    return transcription.trim();
  } catch (error) {
    console.error('Google STT Error:', error.message);
    throw new Error(`Speech recognition failed: ${error.message}`);
  }
}
