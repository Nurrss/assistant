import axios from 'axios';

/**
 * Download Telegram file by file_id and return buffer
 * @param {object} telegram - Telegraf/Telegram context.telegram
 * @param {string} fileId - Telegram file_id (from message.voice.file_id or message.audio.file_id)
 * @returns {Promise<Buffer>} - Audio file content
 */
export async function getAudioBuffer(telegram, fileId) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set');
  }

  const file = await telegram.getFile(fileId);
  if (!file.file_path) {
    throw new Error('Telegram did not return file_path');
  }

  const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 55000, // 55s (Vercel Pro ~60s limit; leave margin for STT/LLM/TTS)
    maxContentLength: 20 * 1024 * 1024, // 20 MB
  });

  if (!response.data || response.data.byteLength === 0) {
    throw new Error('Empty file received from Telegram');
  }

  return Buffer.from(response.data);
}
