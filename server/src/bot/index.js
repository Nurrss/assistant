import http from 'node:http';
import dotenv from 'dotenv';
import { bot } from './core.js';

dotenv.config();

if (!bot) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set. Add it to .env');
  process.exit(1);
}

// Minimal HTTP server so Render Web Service sees an open port (no "port scan timeout")
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 0;
if (port > 0) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'telegram-bot' }));
  });
  server.listen(port, () => {
    console.log(`📡 Health port listening on ${port}`);
  });
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
