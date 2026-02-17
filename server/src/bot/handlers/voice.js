import { getAudioBuffer } from '../lib/getAudioBuffer.js';
import { transcribeAudio } from '../../services/stt.google.js';
import { generateResponse } from '../../services/llm.gemini.js';
import { synthesizeSpeech } from '../../services/tts.narakeet.js';
import { MESSAGES } from '../lib/constants.js';

/** Max size for voice download (bytes) — align with API limit */
const MAX_VOICE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Handle voice message: download → STT → LLM → TTS → reply with voice
 */
export async function handleVoice(ctx) {
  const voice = ctx.message?.voice;
  if (!voice?.file_id) return;

  await ctx.sendChatAction('record_voice');

  try {
    const buffer = await getAudioBuffer(ctx.telegram, voice.file_id);
    if (buffer.length > MAX_VOICE_SIZE) {
      await ctx.reply(
        'Дауысты хабарлама тым үлкен. Қысқарақ жіберіңіз (макс. ~30 сек).'
      );
      return;
    }

    const transcript = await transcribeAudio(buffer);
    if (!transcript || !transcript.trim()) {
      await ctx.reply(MESSAGES.ERROR_NO_SPEECH);
      return;
    }

    await ctx.sendChatAction('typing');
    const aiResponse = await generateResponse(transcript.trim());
    if (!aiResponse || !aiResponse.trim()) {
      await ctx.reply(MESSAGES.ERROR_EMPTY_RESPONSE);
      return;
    }

    const audioBuffer = await synthesizeSpeech(aiResponse.trim());
    if (!audioBuffer || audioBuffer.length === 0) {
      await ctx.reply(MESSAGES.ERROR_GENERIC);
      return;
    }

    await ctx.replyWithVoice({ source: audioBuffer, filename: 'reply.m4a' });
  } catch (err) {
    console.error('[Bot voice]', err.message);
    await ctx.reply(MESSAGES.ERROR_VOICE);
  }
}
