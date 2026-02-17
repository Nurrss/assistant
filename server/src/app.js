import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import voiceChatRouter from './routes/voiceChat.js';
import { bot } from './bot/core.js';

dotenv.config();

const app = express();

// Trust proxy - required for Vercel/serverless deployments
app.set('trust proxy', true);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Transcript', 'X-Response'], // CRITICAL: Expose custom headers to client
  credentials: true,
};

app.use(cors(corsOptions));

// Body parser for JSON (must be before routes that use req.body)
app.use(express.json());

// Rate limiting (applied to /api/* except webhook to avoid blocking Telegram)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 50,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', (req, res, next) => {
  if (req.path.endsWith('telegram-webhook')) return next();
  return limiter(req, res, next);
});

// Telegram webhook (for Vercel/serverless — no long-running process)
if (bot) {
  const webhookPath = '/api/telegram-webhook';
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET || undefined;
  app.post(webhookPath, async (req, res) => {
    try {
      const middleware = bot.webhookCallback(webhookPath, { secretToken });
      await middleware(req, res, () => {
        if (!res.headersSent) res.status(403).end();
      });
    } catch (err) {
      console.error('Telegram webhook error:', err);
      if (!res.headersSent) res.status(500).end();
    }
  });
}

// Routes
app.use('/api', voiceChatRouter);

// Root endpoint
app.get('/', (req, res) => {
  const endpoints = {
    health: 'GET /api/health',
    voiceChat: 'POST /api/voice-chat',
  };
  if (bot) {
    endpoints.telegramWebhook = 'POST /api/telegram-webhook';
  }
  res.json({
    message: 'AI Voice Assistant API',
    version: '1.0.0',
    endpoints,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
