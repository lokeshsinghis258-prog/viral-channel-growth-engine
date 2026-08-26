import { useEffect, useState } from 'react';
import api from '../services/api';
import { Activity, TrendingUp, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';

const Dashboard = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        fetchAnalytics(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (channelId) => {
    try {
      const response = await api.get(`/analytics/channel/${channelId}`);
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to load analytics');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="header">
          <h1>📊 Dashboard</h1>
        </div>
        <div className="loading">Loading channels...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>📊 Dashboard</h1>
        <p>Track your channel growth</p>
      </div>

      <div style={{ padding: '16px' }}>
        {error && <div className="error">{error}</div>}

        {channels.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📺</div>
            <h3>No channels connected</h3>
            <p>Connect your YouTube or Instagram channel to get started</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Channels</h2>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setSelectedChannel(channel);
                      fetchAnalytics(channel.id);
                    }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: selectedChannel?.id === channel.id ? 'var(--primary)' : 'var(--surface)',
                      color: selectedChannel?.id === channel.id ? 'white' : 'var(--text)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >
                    {channel.type === 'youtube' ? '▶️' : '📸'} {channel.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {selectedChannel && analytics && (
              <>
                <div className="card">
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{selectedChannel.name}</h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>@{selectedChannel.username}</p>
                  </div>
                  <div className="grid-3">
                    <div className="stat-box">
                      <div className="stat-label">Followers</div>
                      <div className="stat-value">{(selectedChannel.followers / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Videos</div>
                      <div className="stat-value">{analytics.statistics.totalVideos}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Total Views</div>
                      <div className="stat-value">{(analytics.statistics.totalViews / 1000).toFixed(0)}K</div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>📈 Key Metrics</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Eye size={20} color='#7c3aed' />
                        <span style={{ fontSize: '13px' }}>Avg Engagement</span>
                      </div>
                      <span style={{ fontWeight: '600' }}>{analytics.statistics.averageEngagementRate.toFixed(2)}%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Heart size={20} color='#f59e0b' />
                        <span style={{ fontSize: '13px' }}>Total Likes</span>
                      </div>
                      <span style={{ fontWeight: '600' }}>{(analytics.statistics.totalLikes / 1000).toFixed(1)}K</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <MessageCircle size={20} color='#06b6d4' />
                        <span style={{ fontSize: '13px' }}>Total Comments</span>
                      </div>
                      <span style={{ fontWeight: '600' }}>{(analytics.statistics.totalComments / 1000).toFixed(1)}K</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Share2 size={20} color='#10b981' />
                        <span style={{ fontSize: '13px' }}>Total Shares</span>
                      </div>
                      <span style={{ fontWeight: '600' }}>{(analytics.statistics.totalShares / 1000).toFixed(1)}K</span>
                    </div>
                  </div>
                </div>

                {analytics.statistics.bestPerformingVideo && (
                  <div className="card">
                    <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#10b981' }}>⭐ Best Performing</h3>
                    <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{analytics.statistics.bestPerformingVideo.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{analytics.statistics.bestPerformingVideo.views.toLocaleString()} views</p>
                  </div>
                )}

                {analytics.statistics.videoNeedingImprovement && (
                  <div className="card">
                    <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#f59e0b' }}>🎯 Needs Improvement</h3>
                    <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{analytics.statistics.videoNeedingImprovement.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span>Growth Score: {analytics.statistics.videoNeedingImprovement.growth_score}/100</span>
                    </div>
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

export default Dashboard;
