# ✅ Production Deployment Checklist

## 📝 Pre-Deployment

### Code Quality
- [x] All features working locally
- [x] UTF-8 encoding for Kazakh text ✅
- [x] User messages on right, AI on left ✅
- [x] Empty message validation ✅
- [x] Error handling in place ✅
- [x] Debug logs removed ✅
- [x] Recording time: 30 seconds ✅
- [x] File size limit: 5MB ✅

### Configuration Files
- [x] `.env.example` exists
- [x] `.env.production` template created
- [x] `.gitignore` configured
- [ ] Update `FRONTEND_URL` in server `.env`
- [ ] Update `VITE_API_URL` in client `.env`

### Security
- [ ] API keys are in `.env` (NOT in code!)
- [ ] `.env` is in `.gitignore`
- [ ] Google credentials JSON is in `.gitignore`
- [x] CORS configured with `exposedHeaders`
- [x] Rate limiting enabled
- [x] File upload size limits set
- [ ] HTTPS/SSL will be enabled

---

## 🔑 API Keys Required

Get these before deploying:

### 1. Google Cloud Speech-to-Text
- [ ] Create Google Cloud account
- [ ] Enable Speech-to-Text API
- [ ] Create service account
- [ ] Download JSON credentials
- [ ] Save as `google-credentials.json` in server folder
- **Docs**: https://cloud.google.com/speech-to-text

### 2. Google Gemini API
- [ ] Get API key from https://makersuite.google.com/app/apikey
- [ ] Add to `.env` as `GEMINI_API_KEY`
- **Cost**: FREE tier (60 requests/min)

### 3. Narakeet TTS API
- [ ] Sign up at https://www.narakeet.com/
- [ ] Get API key
- [ ] Add to `.env` as `NARAKEET_API_KEY`
- **Cost**: Pay as you go (~$8 per 1 hour of audio)

---

## 🌐 Domain & Hosting

### Domain
- [ ] Buy domain (e.g., `aivoice.kz` or `yourdomain.com`)
- [ ] Configure DNS records to point to your server

### Hosting Provider (choose one)

#### Option A: VPS (Best for full control)
- [ ] DigitalOcean / Hetzner / Vultr account created
- [ ] Droplet/VPS created (minimum 1GB RAM)
- [ ] SSH access configured
- **Cost**: $4-6/month

#### Option B: Serverless (Easiest)
- [ ] Vercel account for frontend
- [ ] Railway/Render account for backend
- **Cost**: FREE tier available, then ~$5/month

---

## 🚀 Deployment Steps

### Backend Deployment

#### VPS:
- [ ] SSH into server
- [ ] Install Node.js 20.x
- [ ] Install PM2
- [ ] Clone/upload code
- [ ] Run `npm install`
- [ ] Create `.env` file with production values
- [ ] Upload `google-credentials.json`
- [ ] Start with `pm2 start src/index.js --name ai-voice-api`
- [ ] Configure Nginx reverse proxy
- [ ] Setup SSL with Let's Encrypt

#### Railway/Render:
- [ ] Connect GitHub repository
- [ ] Set root directory to `server`
- [ ] Add environment variables
- [ ] Upload Google credentials file
- [ ] Deploy

### Frontend Deployment

#### VPS:
- [ ] Build with `npm run build`
- [ ] Copy `dist/` to `/var/www/html/`
- [ ] Configure Nginx to serve static files
- [ ] Setup SSL

#### Vercel:
- [ ] Connect GitHub repository
- [ ] Set root directory to `client`
- [ ] Set `VITE_API_URL` environment variable
- [ ] Deploy

---

## 🔒 Security Configuration

### Server
- [ ] Firewall enabled (UFW)
  ```bash
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw enable
  ```
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Nginx security headers configured
- [ ] SSH key-based auth enabled (disable password)

### Application
- [ ] CORS restricted to your domain only
- [ ] Rate limiting tested
- [ ] Error messages don't expose secrets
- [ ] File upload validation working

---

## ✅ Post-Deployment Testing

### Functionality Tests
- [ ] Visit your website (https://yourdomain.com)
- [ ] Click microphone button - permission requested?
- [ ] Record 5-10 second audio in Kazakh
- [ ] Verify transcript appears on RIGHT side
- [ ] Verify AI response appears on LEFT side
- [ ] Verify audio plays back
- [ ] Test multiple conversations
- [ ] Clear chat - works?
- [ ] Refresh page - messages persist?

### Technical Tests
- [ ] Check browser console - no errors?
- [ ] Check server logs - `pm2 logs`
- [ ] Test on mobile device
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] SSL certificate valid? (green padlock)
- [ ] API responding within 5-10 seconds?

### API Tests
- [ ] STT working (Google Speech-to-Text)?
- [ ] LLM responding (Gemini)?
- [ ] TTS playing (Narakeet)?
- [ ] UTF-8 Kazakh text displaying correctly?
- [ ] Headers (X-Transcript, X-Response) received?

---

## 📊 Monitoring Setup

### PM2 (if using VPS)
- [ ] `pm2 status` - app running?
- [ ] `pm2 monit` - check CPU/memory
- [ ] `pm2 logs` - no errors?
- [ ] PM2 startup script enabled

### Logs to Monitor
- [ ] Server logs: `pm2 logs ai-voice-api`
- [ ] Nginx access: `/var/log/nginx/access.log`
- [ ] Nginx errors: `/var/log/nginx/error.log`

---

## 💰 Cost Tracking

### Fixed Costs (Monthly)
- VPS/Hosting: $____ (or FREE)
- Domain: $____ /year ÷ 12

### Variable Costs (Usage-based)
- Google STT: Track in GCP Console
- Gemini API: FREE tier (monitor limits)
- Narakeet TTS: Track on dashboard

### Set Budgets
- [ ] Set billing alerts in Google Cloud
- [ ] Monitor Narakeet usage
- [ ] Consider rate limiting to control costs

---

## 🆘 Emergency Contacts

### If Site Goes Down
1. Check PM2: `pm2 status`
2. Check Nginx: `systemctl status nginx`
3. Check logs: `pm2 logs`
4. Restart: `pm2 restart all`

### If Errors Occur
- Browser Console (F12) - shows client errors
- Server Logs (`pm2 logs`) - shows API errors
- Nginx Logs - shows server errors

---

## 📈 Optional Improvements

### Performance
- [ ] Add Redis for caching responses
- [ ] Implement CDN for static assets
- [ ] Optimize audio file sizes
- [ ] Add loading states/progress bars

### Features
- [ ] User authentication
- [ ] Save chat history to database
- [ ] Export conversation as text
- [ ] Voice settings (speed, voice type)
- [ ] Multi-language support

### Analytics
- [ ] Add Google Analytics
- [ ] Track API usage
- [ ] Monitor error rates
- [ ] User behavior analytics

---

## 🎉 Launch Checklist

Before going live:

- [ ] All tests passed ✅
- [ ] SSL/HTTPS enabled ✅
- [ ] Custom domain configured ✅
- [ ] API keys working ✅
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Error tracking setup (Sentry?)
- [ ] Documentation updated
- [ ] Announce to users! 🚀

---

## 📝 Notes

**Current Status**: ✅ Code is production-ready!

**What's Working**:
- ✅ Voice recording (30 seconds max)
- ✅ Speech-to-text (Google)
- ✅ AI responses (Gemini)
- ✅ Text-to-speech (Narakeet)
- ✅ Chat display (user right, AI left)
- ✅ UTF-8 Kazakh text support
- ✅ Message persistence (sessionStorage)

**What's Needed**:
- Get API keys
- Choose hosting
- Configure domain
- Deploy!

---

**You are ready to deploy! 🚀**
