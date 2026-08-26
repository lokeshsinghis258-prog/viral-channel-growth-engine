import express from 'express';
import { db } from '../db/database.js';
import { generateDemoVideos } from '../services/demoData.js';

const router = express.Router();

// Get all videos for a channel
router.get('/channel/:channelId', async (req, res) => {
  try {
    // Verify channel belongs to user
    const channel = await db.get(
      'SELECT * FROM channels WHERE id = ? AND user_id = ?',
      [req.params.channelId, req.user.userId]
    );

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    let videos = await db.all(
      'SELECT * FROM videos WHERE channel_id = ? ORDER BY published_at DESC',
      [req.params.channelId]
    );

    // If no videos and demo mode, generate demo videos
    if (videos.length === 0 && process.env.DEMO_MODE === 'true') {
      videos = await generateDemoVideos(req.params.channelId, channel.type);
    }

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get video details
router.get('/:videoId', async (req, res) => {
  try {
    const video = await db.get('SELECT * FROM videos WHERE id = ?', [req.params.videoId]);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
