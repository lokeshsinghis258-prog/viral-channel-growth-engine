import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';
import { generateRecommendations } from '../services/aiEngine.js';

const router = express.Router();

// Get growth score for a video
router.get('/score/:videoId', async (req, res) => {
  try {
    const video = await db.get('SELECT * FROM videos WHERE id = ?', [req.params.videoId]);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      videoId: video.id,
      growthScore: video.growth_score || 0,
      viralPotentialScore: video.viral_potential_score || 0,
      engagementRate: video.engagement_rate || 0,
      growthRate: video.growth_rate || 0,
      views: video.views,
      likes: video.likes,
      comments: video.comments,
      shares: video.shares
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get AI recommendations for a video
router.get('/recommendations/:videoId', async (req, res) => {
  try {
    const video = await db.get('SELECT * FROM videos WHERE id = ?', [req.params.videoId]);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Check if recommendations already exist
    let recommendations = await db.all(
      'SELECT * FROM ai_recommendations WHERE video_id = ?',
      [req.params.videoId]
    );

    // If no recommendations, generate them
    if (recommendations.length === 0) {
      recommendations = await generateRecommendations(video);
    }

    res.json({
      videoId: video.id,
      title: video.title,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get growth plan for user
router.get('/plan', async (req, res) => {
  try {
    const plan = await db.all(
      `SELECT gp.*, v.title, v.views, v.growth_score 
       FROM growth_plans gp 
       LEFT JOIN videos v ON gp.video_id = v.id 
       WHERE gp.user_id = ? AND gp.status != 'completed'
       ORDER BY gp.priority ASC`,
      [req.user.userId]
    );

    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate growth plan
router.post('/plan/generate', async (req, res) => {
  try {
    const { channelId } = req.body;

    // Verify channel belongs to user
    const channel = await db.get(
      'SELECT * FROM channels WHERE id = ? AND user_id = ?',
      [channelId, req.user.userId]
    );

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Get all videos for channel, sorted by growth score
    const videos = await db.all(
      `SELECT * FROM videos WHERE channel_id = ? ORDER BY growth_score ASC LIMIT 5`,
      [channelId]
    );

    // Create growth plan items
    const plans = [];
    for (let i = 0; i < videos.length; i++) {
      const planId = uuidv4();
      await db.run(
        `INSERT INTO growth_plans (id, user_id, video_id, priority, action, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [
          planId,
          req.user.userId,
          videos[i].id,
          i + 1,
          `Improve video: ${videos[i].title}`
        ]
      );
      plans.push({ id: planId, videoId: videos[i].id, priority: i + 1 });
    }

    res.status(201).json({ message: 'Growth plan generated', plans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
