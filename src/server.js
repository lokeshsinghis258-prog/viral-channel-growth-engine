import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDatabase } from './db/database.js';
import authRoutes from './routes/auth.js';
import channelRoutes from './routes/channels.js';
import videoRoutes from './routes/videos.js';
import analyticsRoutes from './routes/analytics.js';
import growthRoutes from './routes/growth.js';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

// Initialize database
await initDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', authMiddleware, channelRoutes);
app.use('/api/videos', authMiddleware, videoRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/growth', authMiddleware, growthRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', demo_mode: process.env.DEMO_MODE === 'true' });
});

// Serve dashboard
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Viral Channel Growth Engine running on http://localhost:${PORT}`);
  console.log(`📱 Open your browser and navigate to http://localhost:${PORT}`);
  if (process.env.DEMO_MODE === 'true') {
    console.log(`📊 DEMO MODE ENABLED - Using sample data`);
  }
});
