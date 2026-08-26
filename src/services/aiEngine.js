import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';

const recommendations = {
  title: [
    { suggestion: 'Add numbers or lists (e.g., "Top 5 Ways...")', improvement: 15 },
    { suggestion: 'Include power words (e.g., "Amazing", "Ultimate", "Proven")', improvement: 12 },
    { suggestion: 'Add urgency (e.g., "Don\'t Miss Out", "Limited Time")', improvement: 10 }
  ],
  caption: [
    { suggestion: 'Add call-to-action (e.g., "Comment below", "Double tap")', improvement: 20 },
    { suggestion: 'Use relevant emojis to increase engagement', improvement: 15 },
    { suggestion: 'Ask questions to encourage comments', improvement: 18 },
    { suggestion: 'Add hashtags at the end', improvement: 12 }
  ],
  hashtags: [
    { suggestion: 'Mix popular and niche hashtags', improvement: 14 },
    { suggestion: 'Use 20-30 relevant hashtags', improvement: 16 },
    { suggestion: 'Research trending hashtags in your niche', improvement: 13 }
  ],
  retention: [
    { suggestion: 'Hook viewers in the first 3 seconds', improvement: 25 },
    { suggestion: 'Add pattern interrupts every 10-15 seconds', improvement: 20 },
    { suggestion: 'Include quick cuts and transitions', improvement: 15 },
    { suggestion: 'Add text overlays with key points', improvement: 18 }
  ],
  engagement: [
    { suggestion: 'Ask viewers to like and comment', improvement: 15 },
    { suggestion: 'Respond to all comments in first 24 hours', improvement: 20 },
    { suggestion: 'Create content series for repeat viewers', improvement: 22 },
    { suggestion: 'End with a question for comments', improvement: 18 }
  ]
};

export async function generateRecommendations(video) {
  const recs = [];

  // Title recommendations
  for (const rec of recommendations.title) {
    const recId = uuidv4();
    await db.run(
      `INSERT INTO ai_recommendations (id, video_id, recommendation_type, original_value, suggested_value, improvement_percentage, reasoning)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [recId, video.id, 'title', video.title, `Improved: ${video.title}`, rec.improvement, rec.suggestion]
    );
    recs.push({ id: recId, type: 'title', ...rec });
  }

  // Caption recommendations
  for (const rec of recommendations.caption) {
    const recId = uuidv4();
    await db.run(
      `INSERT INTO ai_recommendations (id, video_id, recommendation_type, original_value, suggested_value, improvement_percentage, reasoning)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [recId, video.id, 'caption', video.caption || '', `Enhanced caption with CTA and emojis`, rec.improvement, rec.suggestion]
    );
    recs.push({ id: recId, type: 'caption', ...rec });
  }

  // Hashtag recommendations
  for (const rec of recommendations.hashtags) {
    const recId = uuidv4();
    await db.run(
      `INSERT INTO ai_recommendations (id, video_id, recommendation_type, original_value, suggested_value, improvement_percentage, reasoning)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [recId, video.id, 'hashtags', video.hashtags || '', '#trending #viral #content #creator', rec.improvement, rec.suggestion]
    );
    recs.push({ id: recId, type: 'hashtags', ...rec });
  }

  // Retention recommendations
  for (const rec of recommendations.retention) {
    const recId = uuidv4();
    await db.run(
      `INSERT INTO ai_recommendations (id, video_id, recommendation_type, original_value, suggested_value, improvement_percentage, reasoning)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [recId, video.id, 'retention', 'Current', 'Implement retention strategy', rec.improvement, rec.suggestion]
    );
    recs.push({ id: recId, type: 'retention', ...rec });
  }

  // Engagement recommendations
  for (const rec of recommendations.engagement) {
    const recId = uuidv4();
    await db.run(
      `INSERT INTO ai_recommendations (id, video_id, recommendation_type, original_value, suggested_value, improvement_percentage, reasoning)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [recId, video.id, 'engagement', 'Current', 'Implement engagement strategy', rec.improvement, rec.suggestion]
    );
    recs.push({ id: recId, type: 'engagement', ...rec });
  }

  return recs;
}
