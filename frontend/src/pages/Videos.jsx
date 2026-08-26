import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { TrendingUp, Zap } from 'lucide-react';

const Videos = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('views');

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/channels');
      setChannels(response.data);
      if (response.data.length > 0) {
        setSelectedChannel(response.data[0]);
        fetchVideos(response.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async (channelId) => {
    try {
      const response = await api.get(`/videos/channel/${channelId}`);
      let sorted = [...response.data];
      if (sortBy === 'views') {
        sorted.sort((a, b) => b.views - a.views);
      } else if (sortBy === 'score') {
        sorted.sort((a, b) => b.growth_score - a.growth_score);
      } else if (sortBy === 'engagement') {
        sorted.sort((a, b) => b.engagement_rate - a.engagement_rate);
      }
      setVideos(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChannelChange = (channel) => {
    setSelectedChannel(channel);
    fetchVideos(channel.id);
  };

  const getScoreBadge = (score) => {
    if (score >= 70) return 'badge-success';
    if (score >= 40) return 'badge-warning';
    return 'badge-danger';
  };

  if (loading) {
    return (
      <div>
        <div className="header">
          <h1>🎬 Videos</h1>
        </div>
        <div className="loading">Loading videos...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>🎬 Videos</h1>
        <p>Your video performance</p>
      </div>

      <div style={{ padding: '16px' }}>
        {channels.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <select
              value={selectedChannel?.id}
              onChange={(e) => handleChannelChange(channels.find(c => c.id === e.target.value))}
              className="input"
              style={{ marginBottom: '12px' }}
            >
              {channels.map(channel => (
                <option key={channel.id} value={channel.id}>
                  {channel.type === 'youtube' ? '▶️' : '📸'} {channel.name}
                </option>
              ))}
            </select>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Sort by:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['views', 'score', 'engagement'].map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      fetchVideos(selectedChannel.id);
                    }}
                    className={`btn btn-small ${sortBy === option ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {option === 'views' ? '👁️ Views' : option === 'score' ? '⭐ Score' : '💬 Engagement'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {videos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎬</div>
            <h3>No videos found</h3>
            <p>Start creating content to see your videos here</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {videos.map(video => (
              <div
                key={video.id}
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/videos/${video.id}`)}
              >
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {video.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{video.topic}</p>
                </div>

                <div className="grid-2" style={{ marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Views</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>{(video.views / 1000).toFixed(1)}K</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Engagement</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--secondary)' }}>{video.engagement_rate.toFixed(1)}%</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className={`badge ${getScoreBadge(video.growth_score)}`}>
                      📊 Score: {video.growth_score}/100
                    </span>
                    <span className={`badge ${getScoreBadge(video.viral_potential_score)}`}>
                      🚀 {video.viral_potential_score}
                    </span>
                  </div>
                  <TrendingUp size={18} color='var(--primary)' />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
