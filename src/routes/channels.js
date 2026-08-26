import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';
import { generateDemoChannels } from '../services/demoData.js';

const router = express.Router();

// Get all channels for user
router.get('/', async (req, res) => {
  try {
    const channels = await db.all(
      'SELECT * FROM channels WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );

    // If no channels and demo mode, create demo channels
    if (channels.length === 0 && process.env.DEMO_MODE === 'true') {
      const demoChannels = await generateDemoChannels(req.user.userId);
      return res.json(demoChannels);
    }

    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add demo channel (for testing)
router.post('/add-demo', async (req, res) => {
  try {
    if (process.env.DEMO_MODE !== 'true') {
      return res.status(403).json({ error: 'Demo mode disabled' });
    }

    const demoChannels = await generateDemoChannels(req.user.userId);
    res.status(201).json(demoChannels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect YouTube (OAuth simulation in demo mode)
router.post('/connect-youtube', async (req, res) => {
  try {
    if (process.env.DEMO_MODE === 'true') {
      // In demo mode, create a demo YouTube channel
      const channelId = uuidv4();
      await db.run(
        `INSERT INTO channels (id, user_id, type, platform_id, name, username, description, followers, access_token, connected_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [channelId, req.user.userId, 'youtube', 'demo_yt_123', 'Demo YouTube Channel', 'demo_channel', 'Demo channel for testing', 15000, 'demo_token']
      );
      return res.status(201).json({ message: 'Demo YouTube channel connected', channelId });
    }

    // TODO: Implement real YouTube OAuth flow
    res.status(501).json({ error: 'YouTube connection not configured. Enable DEMO_MODE.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect Instagram (OAuth simulation in demo mode)
router.post('/connect-instagram', async (req, res) => {
  try {
    if (process.env.DEMO_MODE === 'true') {
      // In demo mode, create a demo Instagram channel
      const channelId = uuidv4();
      await db.run(
        `INSERT INTO channels (id, user_id, type, platform_id, name, username, description, followers, access_token, connected_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [channelId, req.user.userId, 'instagram', 'demo_ig_123', 'Demo Instagram', 'demo_instagram', 'Demo Instagram account for testing', 8500, 'demo_token']
      );
      return res.status(201).json({ message: 'Demo Instagram channel connected', channelId });
    }

    // TODO: Implement real Instagram OAuth flow
    res.status(501).json({ error: 'Instagram connection not configured. Enable DEMO_MODE.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get channel details
router.get('/:channelId', async (req, res) => {
  try {
    const channel = await db.get(
      'SELECT * FROM channels WHERE id = ? AND user_id = ?',
      [req.params.channelId, req.user.userId]
    );

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
