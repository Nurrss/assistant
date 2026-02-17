/** User-facing messages in Kazakh */
export const MESSAGES = {
  ERROR_GENERIC: 'Кешіріңіз, қате орын алды. Кейінірек қайталап көріңіз.',
  ERROR_VOICE: 'Дауысты хабарламаны өңдеу кезінде қате орын алды.',
  ERROR_NO_SPEECH: 'Дауысты тану мүмкін болмады. Аудиода сөз табылмады.',
  ERROR_EMPTY_RESPONSE: 'Жауап дайындау мүмкін болмады.',
  ERROR_TEXT_TOO_LONG: 'Мәтін тым ұзын. Қысқарақ хабарлама жіберіңіз.',
};

/** Max length for one text message (Telegram limit 4096, we use lower for LLM) */
export const MAX_TEXT_LENGTH = 4000;
