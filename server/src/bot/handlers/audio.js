import { getAudioBuffer } from '../lib/getAudioBuffer.js';
import { transcribeAudio } from '../../services/stt.google.js';
import { generateResponse } from '../../services/llm.gemini.js';
import { synthesizeSpeech } from '../../services/tts.narakeet.js';
import { MESSAGES } from '../lib/constants.js';

const MAX_AUDIO_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Handle audio file: same pipeline as voice (download → STT → LLM → TTS → voice reply)
 */
export async function handleAudio(ctx) {
  const audio = ctx.message?.audio;
  if (!audio?.file_id) return;

  await ctx.sendChatAction('record_voice');

  try {
    const buffer = await getAudioBuffer(ctx.telegram, audio.file_id);
    if (buffer.length > MAX_AUDIO_SIZE) {
      await ctx.reply(
        'Аудио файл тым үлкен. Қысқарақ аудио жіберіңіз (макс. 5 МБ).'
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
    console.error('[Bot audio]', err.message);
    await ctx.reply(MESSAGES.ERROR_VOICE);
  }
}
