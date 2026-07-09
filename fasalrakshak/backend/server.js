import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import enterpriseRoutes from './routes/enterpriseRoutes.js';
import multiagentRoutes from './routes/multiagentRoutes.js';
import autonomousRoutes from './routes/autonomousRoutes.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is missing.\nPlease configure backend/.env');
}

if (!process.env.GEMINI_API_KEY && !process.env.VITE_GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is missing.\nAI Agent features will fail. Please configure backend/.env');
}

// Connect to MongoDB
connectDB();

const app = express();

const fetchWithTimeout = async (url, options = {}, timeout = 3000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response;
  } finally {
    clearTimeout(timer);
  }
};

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Dynamic CORS — allows all localhost ports (for Vite dev server fallback ports)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  process.env.CLIENT_URL, // Set in Render dashboard to your Netlify URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

// Health check route — confirms server is alive
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FasalRakshak backend is running ✅', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/multiagent', multiagentRoutes);
app.use('/api/autonomous', autonomousRoutes);

app.get('/api/agri/fertilizer-data', async (req, res, next) => {
  try {
    const response = await fetchWithTimeout(
      'https://api.data.gov.in/resource/35be999b-0208-4354-b557-f6c3bebea060?format=json&limit=8',
      {},
      3000
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(200).json({ records: [], fallback: true });
  }
});

app.get('/api/agri/market-rates', async (req, res) => {
  try {
    const response = await fetchWithTimeout(
      'https://agmarknet.gov.in/SearchCommoditywise.aspx',
      {},
      3000
    );
    const html = await response.text();
    res.json({ html });
  } catch (error) {
    res.status(200).json({ html: '', fallback: true });
  }
});

app.post('/api/agri/anthropic-advice', async (req, res) => {
  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const geminiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (anthropicKey) {
      const response = await fetchWithTimeout(
        'https://api.anthropic.com/v1/messages',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify(req.body)
        },
        10000
      );
      const data = await response.json();
      return res.json(data);
    } 

    if (geminiKey) {
      // Fallback to Gemini if Anthropic key is missing
      const prompt = req.body.messages?.[0]?.content || 'Agricultural advice requested.';
      const response = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        },
        10000
      );

      const geminiData = await response.json();
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Map Gemini response to the format expected by the frontend (Anthropic content structure)
      return res.json({
        content: [{ text }]
      });
    }

    return res.status(503).json({
      success: false,
      message: 'No AI API keys (Anthropic or Gemini) are configured on the server.',
    });
  } catch (error) {
    console.error('AI Advice Error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch AI advice right now.'
    });
  }
});

// 404 handler — catch unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler (Express 5 compatible)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
