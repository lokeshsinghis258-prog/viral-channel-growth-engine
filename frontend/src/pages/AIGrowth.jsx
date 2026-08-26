import { useEffect, useState } from 'react';
import api from '../services/api';
import { Wand2, Lightbulb } from 'lucide-react';

const AIGrowth = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await api.get('/channels');
      setChannels(response.data);
      if (response.data.length > 0) {
        setSelectedChannel(response.data[0]);
        fetchVideos(response.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVideos = async (channelId) => {
    try {
      const response = await api.get(`/videos/channel/${channelId}`);
      setVideos(response.data);
      if (response.data.length > 0) {
        setSelectedVideo(response.data[0]);
        fetchRecommendations(response.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async (videoId) => {
    try {
      setLoading(true);
      const response = await api.get(`/growth/recommendations/${videoId}`);
      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChannelChange = (channel) => {
    setSelectedChannel(channel);
    fetchVideos(channel.id);
  };

  const handleVideoChange = (video) => {
    setSelectedVideo(video);
    fetchRecommendations(video.id);
  };

  return (
    <div>
      <div className="header">
        <h1>🤖 AI Growth Engine</h1>
        <p>Personalized recommendations</p>
      </div>

      <div style={{ padding: '16px' }}>
        {channels.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🤖</div>
            <h3>No channels to analyze</h3>
            <p>Connect a channel first</p>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Select Channel:</label>
              <select
                value={selectedChannel?.id || ''}
                onChange={(e) => handleChannelChange(channels.find(c => c.id === e.target.value))}
                className="input"
              >
                {channels.map(channel => (
                  <option key={channel.id} value={channel.id}>
                    {channel.type === 'youtube' ? '▶️' : '📷'} {channel.name}
                  </option>
                ))}
              </select>
            </div>

            {videos.length > 0 && (
              <div className="form-group">
                <label>Select Video:</label>
                <select
                  value={selectedVideo?.id || ''}
                  onChange={(e) => handleVideoChange(videos.find(v => v.id === e.target.value))}
                  className="input"
                >
                  {videos.map(video => (
                    <option key={video.id} value={video.id}>
                      {video.title.substring(0, 40)}...
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedVideo && (
              <>
                <div className="card">
                  <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>📹 {selectedVideo.title}</h3>
                  <div className="grid-2">
                    <div className="stat-box">
                      <div className="stat-label">Views</div>
                      <div className="stat-value">{(selectedVideo.views / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Engagement</div>
                      <div className="stat-value">{selectedVideo.engagement_rate.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="loading">Generating recommendations...</div>
                ) : recommendations.length > 0 ? (
                  <div className="card">
                    <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                      <Wand2 size={18} /> Growth Recommendations
                    </h3>

                    {/* Group recommendations by type */}
                    {['title', 'caption', 'hashtags', 'retention', 'engagement'].map(type => {
                      const typeRecs = recommendations.filter(r => r.recommendation_type === type);
                      if (typeRecs.length === 0) return null;
                      return (
                        <div key={type} style={{ marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: '10px' }}>
                            {type === 'title' && '✍️ Title Optimization'}
                            {type === 'caption' && '💬 Caption Enhancement'}
                            {type === 'hashtags' && '#️⃣ Hashtag Strategy'}
                            {type === 'retention' && '⏱️ Retention Tactics'}
                            {type === 'engagement' && '👥 Engagement Boost'}
                          </h4>
                          <div style={{ display: 'grid', gap: '10px' }}>
                            {typeRecs.map((rec, idx) => (
                              <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
                                  <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>{rec.suggestion || rec.reasoning}</p>
                                  <span className="badge badge-success" style={{ whiteSpace: 'nowrap', marginLeft: '8px' }}>+{rec.improvement}%</span>
                                </div>
                                {rec.reasoning && rec.reasoning !== rec.suggestion && (
                                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>{rec.reasoning}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">💡</div>
                    <p>No recommendations available</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AIGrowth;
