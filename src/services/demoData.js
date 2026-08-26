import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';

const sampleTitles = [
  'How to Grow Your Channel Fast',
  'Ultimate Guide to Content Creation',
  'Top 10 Hacks for Success',
  'Behind the Scenes of My Channel',
  'Answering Your Questions',
  'The Best Tips for Beginners',
  'What I Learned This Month'
];

const sampleDescriptions = [
  'In this video, I share my best strategies for growing an audience organically.',
  'Learn the secrets to creating viral content that resonates with your audience.',
  'This tutorial will teach you everything you need to know.',
  'Join me as I explore the latest trends in content creation.',
  'We dive deep into analytics and what they mean for your growth.'
];

const sampleCaptions = [
  'Amazing content! Double tap if you agree 🔥 #ContentCreator #Growth',
  'This changed my entire approach! Highly recommended 💯 #Tips #Tutorial',
  'Mind blown! 🤯 Who else learns best from videos like this? #Learning',
  'Saved this for later! 📌 #MustWatch #ContentTips',
  'This is exactly what I needed! Thank you for sharing 🙏 #Help #Support'
];

const topics = ['Tutorial', 'Vlog', 'Music', 'Education', 'Entertainment', 'Gaming', 'Lifestyle'];

export async function generateDemoChannels(userId) {
  const channels = [];

  // YouTube demo channel
  const ytChannelId = uuidv4();
  await db.run(
    `INSERT INTO channels (id, user_id, type, platform_id, name, username, description, followers, access_token, connected_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [ytChannelId, userId, 'youtube', 'UCdemo123', 'My YouTube Channel', 'my_youtube_channel', 'Creating awesome content daily', 25000, 'demo_token_yt']
  );
  channels.push({ id: ytChannelId, type: 'youtube', name: 'My YouTube Channel', followers: 25000 });

  // Instagram demo channel
  const igChannelId = uuidv4();
  await db.run(
    `INSERT INTO channels (id, user_id, type, platform_id, name, username, description, followers, access_token, connected_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [igChannelId, userId, 'instagram', 'ig_demo_123', 'My Instagram', 'my_instagram_profile', 'Daily creative content', 12000, 'demo_token_ig']
  );
  channels.push({ id: igChannelId, type: 'instagram', name: 'My Instagram', followers: 12000 });

  return channels;
}

export async function generateDemoVideos(channelId, channelType) {
  const videos = [];
  const videoCount = 8;

  for (let i = 0; i < videoCount; i++) {
    const videoId = uuidv4();
    const views = Math.floor(Math.random() * 50000) + 1000;
    const likes = Math.floor(views * (Math.random() * 0.08 + 0.02));
    const comments = Math.floor(views * (Math.random() * 0.03 + 0.005));
    const shares = Math.floor(views * (Math.random() * 0.01 + 0.001));
    const watchTime = Math.floor(views * Math.random() * 10);
    const engagementRate = ((likes + comments + shares) / views) * 100;

    const title = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
    const description = sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)];
    const caption = sampleCaptions[Math.floor(Math.random() * sampleCaptions.length)];
    const topic = topics[Math.floor(Math.random() * topics.length)];

    // Calculate growth score (0-100)
    const viewScore = Math.min((views / 50000) * 30, 30);
    const engagementScore = Math.min(engagementRate * 10, 40);
    const retentionScore = Math.min((watchTime / views) * 100, 30);
    const growthScore = Math.round(viewScore + engagementScore + retentionScore);

    // Viral potential score
    const viralScore = Math.round((engagementRate * 2 + (shares / (views / 1000))) * 10);

    await db.run(
      `INSERT INTO videos (
        id, channel_id, platform_id, title, description, caption, topic, hashtags,
        views, likes, comments, shares, watch_time_minutes,
        engagement_rate, growth_score, viral_potential_score, published_at, synced_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' days'), CURRENT_TIMESTAMP)`,
      [
        videoId,
        channelId,
        `vid_${i}`,
        title,
        description,
        caption,
        topic,
        '#content #creator #growth #tutorial #viral',
        views,
        likes,
        comments,
        shares,
        watchTime,
        engagementRate,
        growthScore,
        Math.min(viralScore, 100),
        Math.floor(Math.random() * 30)
      ]
    );

    videos.push({
      id: videoId,
      title,
      views,
      likes,
      comments,
      shares,
      engagementRate,
      growthScore,
      viralPotentialScore: Math.min(viralScore, 100)
    });
  }

  return videos;
}
