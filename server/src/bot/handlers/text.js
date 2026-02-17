import { generateResponse } from '../../services/llm.gemini.js';
import { MESSAGES, MAX_TEXT_LENGTH } from '../lib/constants.js';

/**
 * Handle text messages: user text → LLM → reply
 */
export async function handleText(ctx) {
  const text = (ctx.message?.text || '').trim();
  if (!text) return;

  if (text.length > MAX_TEXT_LENGTH) {
    await ctx.reply(MESSAGES.ERROR_TEXT_TOO_LONG);
    return;
  }

  await ctx.sendChatAction('typing');

  try {
    const response = await generateResponse(text);
    const reply = response?.trim() || MESSAGES.ERROR_EMPTY_RESPONSE;
    await ctx.reply(reply);
  } catch (err) {
    console.error('[Bot text]', err.message);
    await ctx.reply(MESSAGES.ERROR_GENERIC);
  }
}
