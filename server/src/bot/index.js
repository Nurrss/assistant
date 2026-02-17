import dotenv from 'dotenv';
import { bot } from './core.js';

dotenv.config();

if (!bot) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set. Add it to .env');
  process.exit(1);
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot
  .launch()
  .then(() => {
    console.log('✅ Telegram bot running (AI Ғарыш Көмекші) [polling]');
  })
  .catch((err) => {
    console.error('❌ Bot launch failed:', err.message);
    process.exit(1);
  });

export default bot;
