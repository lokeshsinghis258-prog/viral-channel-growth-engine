import { useEffect, useState } from 'react';
import api from '../services/api';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Planner = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  useEffect(() => {
    fetchChannels();
    fetchPlan();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await api.get('/channels');
      setChannels(response.data);
      if (response.data.length > 0) {
        setSelectedChannel(response.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlan = async () => {
    try {
      const response = await api.get('/growth/plan');
      setPlan(response.data);
      setPlanGenerated(response.data.length > 0);
    } catch (err) {
      console.error(err);
    }
  };

  const generatePlan = async () => {
    if (!selectedChannel) return;
    try {
      setLoading(true);
      await api.post('/growth/plan/generate', { channelId: selectedChannel.id });
      fetchPlan();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="header">
        <h1>📅 Growth Planner</h1>
        <p>Your growth strategy</p>
      </div>

      <div style={{ padding: '16px' }}>
        {channels.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No channels connected</h3>
            <p>Connect a channel to create a growth plan</p>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Select Channel:</label>
              <select
                value={selectedChannel?.id || ''}
                onChange={(e) => setSelectedChannel(channels.find(c => c.id === e.target.value))}
                className="input"
              >
                {channels.map(channel => (
                  <option key={channel.id} value={channel.id}>
                    {channel.type === 'youtube' ? '▶️' : '📷'} {channel.name}
                  </option>
                ))}
              </select>
            </div>

            {!planGenerated && (
              <div className="card" style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>No growth plan yet. Generate one based on your video analysis.</p>
                <button
                  onClick={generatePlan}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {loading ? 'Generating...' : '✨ Generate Growth Plan'}
                </button>
              </div>
            )}

            {plan.length > 0 && (
              <>
                <div className="card">
                  <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>🎯 Your Action Plan</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Prioritized list of videos to improve for maximum growth
                  </p>
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {plan.map((item, idx) => (
                    <div key={item.id} className="card">
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ fontSize: '18px' }}>#{idx + 1}</div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{item.action}</h4>
                          {item.title && <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.title}</p>}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className={`badge ${item.status === 'completed' ? 'badge-success' : item.status === 'in_progress' ? 'badge-warning' : 'badge-warning'}`}>
                          {item.status === 'completed' ? (
                            <><CheckCircle size={14} style={{ marginRight: '4px' }} /> Completed</>
                          ) : item.status === 'in_progress' ? (
                            <><Clock size={14} style={{ marginRight: '4px' }} /> In Progress</>
                          ) : (
                            <><AlertCircle size={14} style={{ marginRight: '4px' }} /> Pending</>
                          )}
                        </span>
                        {item.views && <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>📊 {item.views.toLocaleString()} views</span>}
                        {item.growth_score && <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>⭐ Score: {item.growth_score}/100</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Planner;
