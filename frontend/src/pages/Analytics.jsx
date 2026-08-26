import { useEffect, useState } from 'react';
import api from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const Analytics = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (channelId) => {
    try {
      const response = await api.get(`/analytics/channel/${channelId}`);
      setAnalytics(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChannelChange = (channel) => {
    setSelectedChannel(channel);
    fetchAnalytics(channel.id);
  };

  if (loading) {
    return (
      <div>
        <div className="header">
          <h1>📊 Analytics</h1>
        </div>
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  // Sample data for charts
  const viewsData = [
    { name: 'Mon', views: 2400 },
    { name: 'Tue', views: 2210 },
    { name: 'Wed', views: 2290 },
    { name: 'Thu', views: 2000 },
    { name: 'Fri', views: 2181 },
    { name: 'Sat', views: 2500 },
    { name: 'Sun', views: 2100 }
  ];

  const engagementData = [
    { name: 'Likes', value: 35 },
    { name: 'Comments', value: 25 },
    { name: 'Shares', value: 20 },
    { name: 'Other', value: 20 }
  ];

  const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b'];

  return (
    <div>
      <div className="header">
        <h1>📊 Analytics</h1>
        <p>Detailed performance insights</p>
      </div>

      <div style={{ padding: '16px' }}>
        {channels.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
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

            {analytics && (
              <>
                <div className="card">
                  <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>📈 Overall Statistics</h3>
                  <div className="grid-2">
                    <div className="stat-box">
                      <div className="stat-label">Total Videos</div>
                      <div className="stat-value">{analytics.statistics.totalVideos}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Total Views</div>
                      <div className="stat-value">{(analytics.statistics.totalViews / 1000).toFixed(0)}K</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Total Likes</div>
                      <div className="stat-value">{(analytics.statistics.totalLikes / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Engagement Rate</div>
                      <div className="stat-value">{analytics.statistics.averageEngagementRate.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>📅 Views Over Time</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={viewsData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="views" stroke="#7c3aed" strokeWidth={2} dot={{ fill: '#7c3aed' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>🎯 Engagement Breakdown</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={engagementData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>🏆 Top Performers</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {analytics.videos?.slice(0, 3).map((video, idx) => (
                      <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--background)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{idx + 1}. {video.title.substring(0, 30)}...</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{video.views.toLocaleString()} views</p>
                        </div>
                        <TrendingUp size={18} color="#10b981" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
