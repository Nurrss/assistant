# ⚡ Шпаргалка по деплою - 10 минут

## 🎯 Цель: Задеплоить за 10 минут для защиты диплома

---

## 1️⃣ GitHub (2 минуты)

```bash
cd /Users/nursultan/Desktop/work/accsident
git init
git add .
git commit -m "AI Voice Assistant"
git remote add origin https://github.com/YOUR-USERNAME/ai-voice-assistant.git
git push -u origin main
```

✅ Готово: Код на GitHub

---

## 2️⃣ Vercel - Frontend (3 минуты)

**URL:** https://vercel.com

1. Sign up → GitHub
2. New Project → Import `ai-voice-assistant`
3. **Settings:**
   - Root: `client`
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
4. Deploy!

**Получите URL:** `https://your-app.vercel.app`

---

## 3️⃣ Render - Backend (5 минут)

**URL:** https://render.com

1. Sign up → GitHub
2. New → Web Service
3. **Settings:**
   - Root: `server`
   - Build: `npm install`
   - Start: `npm start`
   - Type: **Free**

4. **Environment Variables:**

```bash
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app

GEMINI_API_KEY=your_key
NARAKEET_API_KEY=your_key

# Google credentials (Base64):
# На компе: cat google-credentials.json | base64
GOOGLE_CREDENTIALS_BASE64=paste_here
```

5. Create Service!

**Получите URL:** `https://your-api.onrender.com`

---

## 4️⃣ Связать (1 минута)

**В Vercel:**
- Settings → Environment
- Add: `VITE_API_URL = https://your-api.onrender.com`
- Redeploy

---

## ✅ ГОТОВО!

**Ссылка для защиты:** `https://your-app.vercel.app`

---

## 📋 API Ключи

### Gemini (бесплатно)
https://makersuite.google.com/app/apikey

### Narakeet (pay as you go)
https://www.narakeet.com/

### Google Cloud STT
https://console.cloud.google.com/

---

## 🐛 Если не работает

**Проверьте:**
1. Render → Logs (ошибки backend)
2. Browser → F12 → Console (ошибки frontend)
3. FRONTEND_URL точно совпадает с Vercel URL?
4. API ключи правильно вставлены?

---

## 💡 Для защиты

**Что сказать:**

> "Приложение развернуто на облачных платформах:
> - Vercel (Frontend CDN)
> - Render (Backend API)
> - Автоматический CI/CD через GitHub
> - Полностью бесплатно для демонстрации"

**Показать:**
- Live URL (открыть и показать работу)
- GitHub код
- QR-код для сканирования

---

**Время деплоя: 10-15 минут**
**Стоимость: $0**

🎉 **Успехов!**
