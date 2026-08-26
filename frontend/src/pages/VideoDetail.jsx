import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Share2, Heart, MessageCircle, Eye, Zap } from 'lucide-react';

const VideoDetail = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetchVideoDetails();
  }, [videoId]);

  const fetchVideoDetails = async () => {
    try {
      setLoading(true);
      const [videoRes, scoreRes, recsRes] = await Promise.all([
        api.get(`/videos/${videoId}`),
        api.get(`/growth/score/${videoId}`),
        api.get(`/growth/recommendations/${videoId}`)
      ]);
      setVideo(videoRes.data);
      setScore(scoreRes.data);
      setRecommendations(recsRes.data.recommendations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="header">
          <h1>Loading...</h1>
        </div>
        <div className="loading">Fetching video details...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div>
        <div className="header">
          <h1>Video Not Found</h1>
        </div>
        <div className="loading">This video could not be found.</div>
      </div>
    );
  }

  const getScoreBadgeClass = (scoreVal) => {
    if (scoreVal >= 70) return 'score-circle high';
    if (scoreVal >= 40) return 'score-circle medium';
    return 'score-circle low';
  };

  return (
    <div>
      <div className="header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1>Video Details</h1>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{video.title}</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{video.topic}</p>
          {video.caption && <p style={{ fontSize: '13px', lineHeight: '1.5', marginBottom: '12px' }}>{video.caption}</p>}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>📊 Scores</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div className={getScoreBadgeClass(score?.growthScore || 0)}>
                <div className="score-value">{score?.growthScore || 0}</div>
                <div className="score-label">Growth</div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className={getScoreBadgeClass(score?.viralPotentialScore || 0)}>
                <div className="score-value">{score?.viralPotentialScore || 0}</div>
                <div className="score-label">Viral</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>📈 Performance</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Eye size={20} color='#7c3aed' />
                <span>Views</span>
              </div>
              <span style={{ fontWeight: '600' }}>{video.views.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Heart size={20} color='#f59e0b' />
                <span>Likes</span>
              </div>
              <span style={{ fontWeight: '600' }}>{video.likes.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MessageCircle size={20} color='#06b6d4' />
                <span>Comments</span>
              </div>
              <span style={{ fontWeight: '600' }}>{video.comments.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Share2 size={20} color='#10b981' />
                <span>Shares</span>
              </div>
              <span style={{ fontWeight: '600' }}>{video.shares.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Zap size={20} color='#f59e0b' />
                <span>Engagement Rate</span>
              </div>
              <span style={{ fontWeight: '600' }}>{score?.engagementRate?.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--secondary)' }}>✨ Hashtags</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {video.hashtags?.split(' ').map((tag, idx) => (
              <span key={idx} className="badge badge-success">{tag}</span>
            ))}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: 'var(--primary)' }}>🚀 AI Recommendations</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {recommendations.slice(0, 5).map((rec, idx) => (
                <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'capitalize' }}>{rec.suggestion || rec.recommendation_type}</span>
                    <span className="badge badge-success" style={{ fontSize: '11px' }}>+{rec.improvement}%</span>
                  </div>
                  {rec.reasoning && <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{rec.reasoning}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDetail;
