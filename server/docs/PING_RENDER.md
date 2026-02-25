# Бесплатный пинг для бота на Render

Чтобы бот на бесплатном Render не засыпал каждые 15 минут, настрой пинг по URL раз в 1 минуту.

## Cron-job.org (раз в 1 минуту, бесплатно)

1. Зайди на **https://cron-job.org** и зарегистрируйся (бесплатно).
2. Войди в панель → **Cronjobs** → **Create cronjob**.
3. Заполни:
   - **Title**: например `Render bot keep-alive`.
   - **URL**: твой URL бота, например  
     `https://assistant-p22t.onrender.com`  
     (без пути — бот отдаёт ответ уже на `/`).
   - **Schedule**: выбери **Every minute** (каждую минуту).
   - Остальное можно оставить по умолчанию.
4. Сохрани (Create / Save).

Готово. Каждую минуту будет уходить запрос на твой сервис, и Render не будет его усыплять.

## Альтернатива: UptimeRobot (раз в 5 минут)

1. Зайди на **https://uptimerobot.com** → Sign Up Free.
2. **Add New Monitor**:
   - Monitor Type: **HTTP(s)**.
   - URL: `https://assistant-p22t.onrender.com`.
   - Monitoring Interval: **5 minutes**.
3. Create Monitor.

Интервал только 5 минут, но для многих случаев этого достаточно.

---

После настройки пинга бот должен стабильно отвечать в Telegram.
