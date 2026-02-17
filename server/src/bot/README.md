# Telegram Bot — AI Ғарыш Көмекші

Бот подключается к тем же сервисам, что и веб-API: STT (Google), LLM (Gemini), TTS (Narakeet). Язык — казахский.

## Два режима

- **Локально / VPS**: `npm run bot` — бот работает в режиме polling (сам опрашивает Telegram).
- **Vercel (и другой serverless)**: бот не запускается отдельно. Telegram шлёт обновления на URL твоего API (webhook). Добавь `TELEGRAM_BOT_TOKEN` в env, задеплой и один раз вызови `setWebhook`. Подробно: **docs/DEPLOY_VERCEL.md**.

## Запуск локально (polling)

1. Создайте бота в [@BotFather](https://t.me/BotFather), получите токен.
2. В `server/.env` добавьте:
   ```
   TELEGRAM_BOT_TOKEN=ваш_токен
   ```
3. Из папки `server`:
   ```bash
   npm run bot
   ```
   С автоперезапуском при изменениях:
   ```bash
   npm run bot:dev
   ```

## Обработчики

| Тип        | Действие                                           |
| ---------- | -------------------------------------------------- |
| `/start`   | Приветствие и краткая инструкция                   |
| `/help`    | Справка по командам и возможностям                 |
| Текст      | Передача в LLM → ответ текстом                     |
| Голосовое  | Скачивание OGG → STT → LLM → TTS → голосовой ответ |
| Аудио-файл | То же, что голосовое (поддержка отправки файла)    |

## Структура

- `index.js` — точка входа, регистрация обработчиков, запуск бота.
- `handlers/start.js` — команды /start, /help.
- `handlers/text.js` — текстовые сообщения.
- `handlers/voice.js` — голосовые сообщения (Telegram voice note, OGG/Opus).
- `handlers/audio.js` — отправленные аудиофайлы.
- `lib/getAudioBuffer.js` — скачивание файла по `file_id`.
- `lib/constants.js` — сообщения об ошибках и лимиты.

## Зависимости окружения

Те же, что и для API: `GEMINI_API_KEY`, Google credentials для STT, `NARAKEET_API_KEY`. Плюс `TELEGRAM_BOT_TOKEN`.
