# Viral Channel Growth Engine

🚀 **Free AI-powered mobile app for organic Instagram & YouTube growth optimization**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## 🎯 Features

- **📊 Real-time Analytics Dashboard** - Track followers, views, likes, comments, and shares
- **🤖 AI-Powered Recommendations** - Get personalized growth strategies (rule-based, 100% free)
- **🎯 Viral Potential Score** - Understand what makes content go viral (0-100 scoring)
- **📱 Mobile-First Design** - Optimized for Android and mobile browsers
- **🆓 100% Free** - No credit card, paid subscriptions, or paid APIs required
- **🎬 Video Performance Analysis** - Detailed metrics for each video
- **📅 Growth Planner** - Prioritized action items for channel growth
- **📈 Advanced Analytics** - Charts, comparisons, and trend analysis

## 🛠️ Tech Stack

### Backend
- **Node.js + Express** - RESTful API
- **SQLite** - Local database (zero cost)
- **JWT** - Secure authentication
- **Rule-based AI** - No paid API dependencies

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Mobile-first CSS** - Responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (free from nodejs.org)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/lokeshsinghis258-prog/viral-channel-growth-engine.git
cd viral-channel-growth-engine

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Create .env file
cp .env.example .env

# Start backend (Terminal 1)
npm run dev

# Start frontend (Terminal 2)
cd frontend && npm run dev
```

**Access the app at:** `http://localhost:3001`

### Demo Account
- **Email:** demo@example.com
- **Password:** demo123

## 📱 Demo Mode

The app runs in **DEMO_MODE=true** by default, providing:
- Sample YouTube and Instagram channels
- 8 demo videos per channel with realistic metrics
- Complete AI recommendation system
- Full analytics dashboard
- Growth scoring and viral potential calculation

**No real API keys needed for testing!**

## 🎬 Supported Features

### Dashboard
- Channel selection (YouTube/Instagram)
- Follower/subscriber count
- Total views and engagement metrics
- Best-performing videos
- Videos needing improvement

### Videos
- Video list with sorting (views, growth score, engagement)
- Individual video detail page
- Growth Score (0-100)
- Viral Potential Score (0-100)
- Performance metrics

### AI Growth Engine
- Title optimization recommendations
- Caption enhancement suggestions
- Hashtag strategy recommendations
- Retention improvement tactics
- Engagement boost strategies
- Improvement percentage predictions

### Planner
- Automated growth plan generation
- Prioritized action items
- Video improvement recommendations
- Content strategy suggestions

### Analytics
- Real-time statistics dashboard
- Views over time (line chart)
- Engagement breakdown (pie chart)
- Top performers list
- Growth rate visualization

### Settings
- Account information
- Platform connection (YouTube/Instagram)
- About information
- Legal disclaimer
- Sign out

## 📊 Growth Score Calculation

```
Growth Score = (View Score × 30) + (Engagement Score × 40) + (Retention Score × 30)

- View Score: Based on total views
- Engagement Score: Likes + Comments + Shares / Total Views × 100
- Retention Score: Watch time / Total views

Range: 0-100
- 70+: Excellent
- 40-69: Good
- <40: Needs Improvement
```

## 🚀 Viral Potential Score

```
Viral Score = (Engagement Rate × 2 + Shares per 1K views) × 10

Range: 0-100
Indicates likelihood of content reaching viral status based on engagement patterns
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Secure token storage in localStorage
- No sensitive data exposed in frontend
- CORS enabled for local development
- Environment variables for configuration

## 📦 Database Schema

### Tables
1. **users** - User accounts
2. **channels** - Connected YouTube/Instagram channels
3. **videos** - Video metadata and metrics
4. **video_analytics** - Historical performance data
5. **ai_recommendations** - Generated recommendations
6. **growth_plans** - User's growth action items

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Channels
- `GET /api/channels` - List user channels
- `POST /api/channels/connect-youtube` - Connect YouTube
- `POST /api/channels/connect-instagram` - Connect Instagram
- `GET /api/channels/:id` - Get channel details

### Videos
- `GET /api/videos/channel/:channelId` - List channel videos
- `GET /api/videos/:id` - Get video details

### Growth
- `GET /growth/score/:videoId` - Get growth scores
- `GET /growth/recommendations/:videoId` - Get AI recommendations
- `GET /growth/plan` - Get user's growth plan
- `POST /growth/plan/generate` - Generate new growth plan

### Analytics
- `GET /api/analytics/channel/:channelId` - Get channel analytics
- `GET /api/analytics/video/:videoId/timeline` - Get video timeline

## 📋 Important Disclaimer

**This app does NOT:**
- Generate fake views or engagement
- Use bots or automated engagement
- Violate any platform terms of service
- Guarantee specific growth results

**All recommendations are based on content optimization best practices only.**

Users maintain full responsibility for their actions on YouTube and Instagram.

## 🆓 Cost Breakdown

| Component | Cost |
|-----------|------|
| Backend (Node.js) | Free |
| Database (SQLite) | Free |
| Frontend (React + Vite) | Free |
| Hosting (self-hosted) | Free |
| AI Engine (rule-based) | Free |
| APIs (optional) | Free tiers only |
| Total Development Cost | **₹0** |

## 🔄 Real YouTube/Instagram Integration

To connect real accounts:

1. **YouTube**: Set `YOUTUBE_API_KEY` in `.env`
   - Get free key from [Google Cloud Console](https://console.cloud.google.com)
   - Enable YouTube Data API v3

2. **Instagram**: Set `INSTAGRAM_ACCESS_TOKEN` in `.env`
   - Register for Meta Business Account
   - Use Instagram Graph API (free tier available)

## 📱 Mobile App Distribution

Add to home screen (iOS/Android):
1. Open app in mobile browser
2. Tap "Share" → "Add to Home Screen"
3. App runs as PWA (Progressive Web App)

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Make your changes
4. Submit pull request

## 📄 License

MIT License - See LICENSE file for details

## 🙋 Support

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Share ideas on GitHub Discussions
- **Email**: lokeshsinghis258@gmail.com

## 🎓 Learning Resources

- [Organic Growth Best Practices](https://blog.hootsuite.com/youtube-video-seo/)
- [Video Engagement Optimization](https://www.youtube.com/creators/)
- [Instagram Content Strategy](https://business.instagram.com/)

---

**Made with ❤️ for content creators worldwide**

**100% Free • No Credit Card • No Paid APIs • Open Source**
