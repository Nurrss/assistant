/**
 * Bot instance and handlers — shared by polling (npm run bot) and webhook (Vercel).
 * Does NOT call bot.launch(); that's done in index.js for local polling.
 */
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { registerStartHandlers } from './handlers/start.js';
import { handleText } from './handlers/text.js';
import { handleVoice } from './handlers/voice.js';
import { handleAudio } from './handlers/audio.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
let bot = null;

if (token) {
  bot = new Telegraf(token);
  registerStartHandlers(bot);
  bot.on(message('text'), handleText);
  bot.on(message('voice'), handleVoice);
  bot.on(message('audio'), handleAudio);
}

export { bot };
