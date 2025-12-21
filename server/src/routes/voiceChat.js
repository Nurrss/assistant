import express from 'express';
import multer from 'multer';
import { transcribeAudio } from '../services/stt.google.js';
import { generateResponse } from '../services/llm.gemini.js';
import { synthesizeSpeech } from '../services/tts.narakeet.js';

const router = express.Router();

// Configure multer for in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max (supports 30 seconds of audio)
  },
});

/**
 * POST /api/voice-chat
 * Process voice input and return AI voice response
 */
router.post('/voice-chat', upload.single('audio'), async (req, res) => {
  const startTime = Date.now();

  try {
    // Validate audio file
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log(`Received audio: ${req.file.size} bytes`);

    // Step 1: Speech-to-Text
    console.log('Starting STT...');
    const sttStart = Date.now();
    const transcript = await transcribeAudio(req.file.buffer);
    const sttDuration = Date.now() - sttStart;
    console.log(`STT completed in ${sttDuration}ms: "${transcript}"`);

    // Validate transcript
    if (!transcript || transcript.trim().length === 0) {
      console.warn('Empty transcript received from STT');
      return res.status(400).json({
        error: 'Could not transcribe audio',
        message: 'No speech detected in the audio'
      });
    }

    // Step 2: LLM Processing
    console.log('Starting LLM...');
    const llmStart = Date.now();
    const aiResponse = await generateResponse(transcript);
    const llmDuration = Date.now() - llmStart;
    console.log(`LLM completed in ${llmDuration}ms: "${aiResponse}"`);

    // Validate AI response
    if (!aiResponse || aiResponse.trim().length === 0) {
      console.warn('Empty response received from LLM');
      return res.status(500).json({
        error: 'Failed to generate response',
        message: 'AI returned empty response'
      });
    }

    // Step 3: Text-to-Speech
    console.log('Starting TTS...');
    const ttsStart = Date.now();
    const audioBuffer = await synthesizeSpeech(aiResponse);
    const ttsDuration = Date.now() - ttsStart;
    console.log(`TTS completed in ${ttsDuration}ms, audio size: ${audioBuffer.length} bytes`);

    // Validate audio buffer
    if (!audioBuffer || audioBuffer.length === 0) {
      console.warn('Empty audio buffer received from TTS');
      return res.status(500).json({
        error: 'Failed to generate audio',
        message: 'TTS returned empty audio'
      });
    }

    // Log total duration
    const totalDuration = Date.now() - startTime;
    console.log(`✅ Request completed in ${totalDuration}ms`);

    // Prepare headers
    const transcriptBase64 = Buffer.from(transcript.trim()).toString('base64');
    const responseBase64 = Buffer.from(aiResponse.trim()).toString('base64');

    // Return audio response with validated headers
    res.set({
      'Content-Type': 'audio/m4a',
      'Content-Length': audioBuffer.length,
      'X-Transcript': transcriptBase64,
      'X-Response': responseBase64,
    });

    res.send(audioBuffer);
  } catch (error) {
    console.error('Voice chat error:', error);

    const duration = Date.now() - startTime;
    console.log(`Failed after ${duration}ms`);

    res.status(500).json({
      error: 'Failed to process voice request',
      message: error.message,
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default router;
