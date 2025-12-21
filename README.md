# AI Voice Assistant Platform (Kazakh Language)

A professional, production-ready AI voice assistant that understands spoken Kazakh, generates intelligent responses, and responds with synthesized speech.

## Features

- **Speech-to-Text**: Recognizes Kazakh speech using Google Cloud STT
- **AI Processing**: Generates natural responses using Google Gemini
- **Text-to-Speech**: Synthesizes Kazakh speech using Narakeet API
- **Modern UI**: React-based interface with real-time status updates
- **Secure**: All API keys stored server-side only
- **Production-Ready**: Rate limiting, CORS, error handling, and logging

## Architecture

```
Browser (React + Vite)
  └─ Records audio (MediaRecorder API)
      ↓
Backend API (Node.js + Express)
  ├─ Google Cloud Speech-to-Text
  ├─ Google Gemini API
  └─ Narakeet Text-to-Speech
      ↓
Browser plays audio response
```

## Tech Stack

### Frontend
- React 18
- Vite
- HTML5 MediaRecorder API
- CSS Modules

### Backend
- Node.js 18+
- Express
- Google Cloud Speech-to-Text
- Google Gemini API
- Narakeet API

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed
2. **Google Cloud Account** with Speech-to-Text API enabled
3. **Google Gemini API Key**
4. **Narakeet API Key**

## Setup Instructions

### 1. Clone or Navigate to Project

```bash
cd /path/to/accsident
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env
```

Edit `server/.env` and add your API keys:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google Cloud STT - Path to your credentials JSON file
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Narakeet TTS API
NARAKEET_API_KEY=your_narakeet_api_key_here

# Rate Limiting
RATE_LIMIT_MAX=50
```

**Google Cloud Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Speech-to-Text API
4. Create a service account and download JSON credentials
5. Save the JSON file as `google-credentials.json` in the `server/` directory

**Gemini API:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Generate an API key
3. Add it to your `.env` file

**Narakeet API:**
1. Sign up at [Narakeet](https://www.narakeet.com/)
2. Get your API key from dashboard
3. Add it to your `.env` file

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

The backend will start on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The frontend will open in your browser at `http://localhost:5173`

### Testing the Application

1. Click the microphone button
2. Allow microphone permissions when prompted
3. Speak in Kazakh (max 10 seconds)
4. Click stop or wait for auto-stop
5. Wait for AI to process and respond
6. Listen to the audio response

## Project Structure

```
accsident/
├── server/                 # Backend API
│   ├── src/
│   │   ├── services/      # External API services
│   │   │   ├── stt.google.js
│   │   │   ├── llm.gemini.js
│   │   │   └── tts.narakeet.js
│   │   ├── routes/        # API routes
│   │   │   └── voiceChat.js
│   │   └── index.js       # Server entry point
│   ├── .env.example
│   └── package.json
│
└── client/                # Frontend React app
    ├── src/
    │   ├── components/
    │   │   ├── VoiceRecorder.jsx
    │   │   └── AudioPlayer.jsx
    │   ├── styles/
    │   │   ├── index.css
    │   │   └── App.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## API Endpoints

### POST /api/voice-chat

Processes voice input and returns AI audio response.

**Request:**
- Content-Type: `multipart/form-data`
- Body: audio file (webm format)

**Response:**
- Content-Type: `audio/m4a`
- Headers:
  - `X-Transcript`: Base64 encoded user transcript
  - `X-Response`: Base64 encoded AI response text
- Body: Audio stream

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Deployment

### Backend Deployment (Fly.io)

```bash
cd server

# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Set environment variables
fly secrets set GEMINI_API_KEY=your_key_here
fly secrets set NARAKEET_API_KEY=your_key_here
fly secrets set GOOGLE_APPLICATION_CREDENTIALS_JSON="$(cat google-credentials.json)"

# Deploy
fly deploy
```

### Frontend Deployment (Vercel)

```bash
cd client

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable for production
# In Vercel dashboard, set:
# VITE_API_URL=https://your-backend.fly.dev
```

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 3000) |
| NODE_ENV | Environment | No (default: development) |
| FRONTEND_URL | Frontend URL for CORS | Yes |
| GOOGLE_APPLICATION_CREDENTIALS | Path to Google Cloud credentials | Yes |
| GEMINI_API_KEY | Google Gemini API key | Yes |
| NARAKEET_API_KEY | Narakeet API key | Yes |
| RATE_LIMIT_MAX | Max requests per 15min | No (default: 50) |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |

## Security Features

- API keys stored server-side only
- Rate limiting (50 requests per 15 minutes per IP)
- CORS restricted to frontend domain
- File size validation (max 1MB)
- Request timeout protection
- Graceful error handling

## Performance

Target latency: **< 3 seconds** end-to-end
- STT: ~1.5s
- LLM: ~1.0s
- TTS: ~1.5s

## Troubleshooting

### Microphone not working
- Check browser permissions
- Ensure HTTPS (or localhost)
- Try different browser (Chrome recommended)

### Backend errors
- Verify all API keys are set correctly
- Check Google Cloud credentials file exists
- Ensure APIs are enabled in Google Cloud Console
- Check backend logs for detailed errors

### Audio not playing
- Check browser console for errors
- Verify CORS settings
- Ensure backend is running

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 14+
- Edge 79+

MediaRecorder API with webm/opus support required.

## License

MIT

## Support

For issues or questions, please refer to the technical specification document.
