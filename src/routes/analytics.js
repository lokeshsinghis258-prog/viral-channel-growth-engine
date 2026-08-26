import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// Get analytics for a channel
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

    // Get videos for this channel
    const videos = await db.all(
      'SELECT * FROM videos WHERE channel_id = ?',
      [req.params.channelId]
    );

    // Calculate statistics
    const stats = {
      totalVideos: videos.length,
      totalViews: videos.reduce((sum, v) => sum + (v.views || 0), 0),
      totalLikes: videos.reduce((sum, v) => sum + (v.likes || 0), 0),
      totalComments: videos.reduce((sum, v) => sum + (v.comments || 0), 0),
      totalShares: videos.reduce((sum, v) => sum + (v.shares || 0), 0),
      totalWatchTime: videos.reduce((sum, v) => sum + (v.watch_time_minutes || 0), 0),
      averageEngagementRate: videos.length > 0
        ? videos.reduce((sum, v) => sum + (v.engagement_rate || 0), 0) / videos.length
        : 0,
      bestPerformingVideo: videos.length > 0
        ? videos.reduce((best, v) => v.views > best.views ? v : best)
        : null,
      videoNeedingImprovement: videos.length > 0
        ? videos.reduce((worst, v) => (v.growth_score || 0) < (worst.growth_score || 0) ? v : worst)
        : null
    };

    res.json({
      channel,
      statistics: stats,
      videos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get video analytics over time
router.get('/video/:videoId/timeline', async (req, res) => {
  try {
    const analytics = await db.all(
      'SELECT * FROM video_analytics WHERE video_id = ? ORDER BY date ASC',
      [req.params.videoId]
    );

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
