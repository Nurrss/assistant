# Quick Start Guide

Get your AI Voice Assistant running in 5 minutes!

## Step 1: Get API Keys

### Google Cloud Speech-to-Text
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable "Cloud Speech-to-Text API"
4. Create Service Account → Download JSON key
5. Save as `server/google-credentials.json`

### Google Gemini
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

### Narakeet
1. Sign up at [Narakeet](https://www.narakeet.com/)
2. Go to Dashboard → API Keys
3. Copy your API key

## Step 2: Configure Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
GEMINI_API_KEY=your_gemini_key_here
NARAKEET_API_KEY=your_narakeet_key_here
RATE_LIMIT_MAX=50
```

## Step 3: Configure Frontend

```bash
cd ../client
npm install
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:3000
```

## Step 4: Run the Application

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

## Step 5: Test It!

1. Open browser at `http://localhost:5173`
2. Click the microphone button
3. Allow microphone permissions
4. Speak in Kazakh
5. Wait for AI response

## Troubleshooting

**"No audio file provided" error:**
- Check microphone permissions
- Try a different browser (Chrome recommended)

**"GEMINI_API_KEY is not configured":**
- Verify `.env` file exists in `server/` directory
- Check API key is correct

**"Speech recognition failed":**
- Ensure `google-credentials.json` is in `server/` directory
- Verify Speech-to-Text API is enabled

**CORS error:**
- Check `FRONTEND_URL` in `server/.env` matches your frontend URL
- Ensure both servers are running

## Next Steps

- See `README.md` for full documentation
- Check API endpoint docs
- Deploy to production (Fly.io + Vercel)

## Need Help?

Review the full technical specification in `task.txt` for detailed architecture and requirements.
