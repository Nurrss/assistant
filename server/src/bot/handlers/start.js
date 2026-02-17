/**
 * /start and /help commands
 */

const WELCOME = `Сәлем! Мен **AI Ғарыш Көмекші** — қазақ тіліндегі дауысты көмекші.

**Қалай пайдалануға болады:**
• Текст жіберсеңіз — жауап мәтінін аласыз.
• Дауысты хабарлама жіберсеңіз — дауыспен жауап аласыз (тану → AI → синтез).

Сұрақтарыңызды қазақ тілінде жіберіңіз.`;

const HELP = `**Командалар:**
/start — қош келдіңіз хабарламасы
/help — осы көмек

**Қызметтер:**
• Текст сұрақ → мәтіндік жауап
• Дауысты хабарлама → дауысты жауап (STT + AI + TTS)

Барлық жауаптар қазақ тілінде беріледі.`;

export function registerStartHandlers(bot) {
  bot.command('start', async (ctx) => {
    await ctx.replyWithMarkdown(WELCOME);
  });

  bot.command('help', async (ctx) => {
    await ctx.replyWithMarkdown(HELP);
  });
}
