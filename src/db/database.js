import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const dbPath = process.env.DB_PATH || './data/app.db';

// Create data directory if it doesn't exist
if (!existsSync(dirname(dbPath))) {
  mkdirSync(dirname(dbPath), { recursive: true });
}

const db = new sqlite3.Database(dbPath);
db.run = promisify(db.run.bind(db));
db.get = promisify(db.get.bind(db));
db.all = promisify(db.all.bind(db));

export async function initDatabase() {
  try {
    // Users table
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        username TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Channels table
    await db.run(`
      CREATE TABLE IF NOT EXISTS channels (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        platform_id TEXT,
        name TEXT,
        username TEXT,
        description TEXT,
        followers INTEGER DEFAULT 0,
        following INTEGER DEFAULT 0,
        website TEXT,
        profile_image TEXT,
        access_token TEXT,
        refresh_token TEXT,
        token_expires_at DATETIME,
        connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_synced DATETIME,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, type, platform_id)
      )
    `);

    // Videos table
    await db.run(`
      CREATE TABLE IF NOT EXISTS videos (
        id TEXT PRIMARY KEY,
        channel_id TEXT NOT NULL,
        platform_id TEXT,
        title TEXT,
        description TEXT,
        thumbnail_url TEXT,
        platform_url TEXT,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        shares INTEGER DEFAULT 0,
        watch_time_minutes INTEGER DEFAULT 0,
        average_view_duration_seconds INTEGER DEFAULT 0,
        engagement_rate REAL DEFAULT 0,
        growth_rate REAL DEFAULT 0,
        growth_score INTEGER DEFAULT 0,
        viral_potential_score INTEGER DEFAULT 0,
        hashtags TEXT,
        caption TEXT,
        topic TEXT,
        published_at DATETIME,
        synced_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (channel_id) REFERENCES channels(id)
      )
    `);

    // Video Analytics table
    await db.run(`
      CREATE TABLE IF NOT EXISTS video_analytics (
        id TEXT PRIMARY KEY,
        video_id TEXT NOT NULL,
        date DATE NOT NULL,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        shares INTEGER DEFAULT 0,
        watch_time_minutes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (video_id) REFERENCES videos(id),
        UNIQUE(video_id, date)
      )
    `);

    // AI Recommendations table
    await db.run(`
      CREATE TABLE IF NOT EXISTS ai_recommendations (
        id TEXT PRIMARY KEY,
        video_id TEXT NOT NULL,
        recommendation_type TEXT,
        original_value TEXT,
        suggested_value TEXT,
        improvement_percentage REAL DEFAULT 0,
        reasoning TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (video_id) REFERENCES videos(id)
      )
    `);

    // Growth Plans table
    await db.run(`
      CREATE TABLE IF NOT EXISTS growth_plans (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        video_id TEXT,
        priority INTEGER,
        action TEXT,
        status TEXT DEFAULT 'pending',
        expected_improvement TEXT,
        due_date DATETIME,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (video_id) REFERENCES videos(id)
      )
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

export { db };
