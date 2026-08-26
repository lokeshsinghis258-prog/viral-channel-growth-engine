import { useState, useEffect } from 'react';
import api from '../services/api';
import { LogOut, Settings as SettingsIcon, Youtube, Instagram } from 'lucide-react';

const Settings = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const connectYouTube = async () => {
    try {
      const response = await api.post('/channels/connect-youtube');
      if (response.data.channelId) {
        setConnectedPlatforms([...connectedPlatforms, 'youtube']);
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to connect YouTube');
    }
  };

  const connectInstagram = async () => {
    try {
      const response = await api.post('/channels/connect-instagram');
      if (response.data.channelId) {
        setConnectedPlatforms([...connectedPlatforms, 'instagram']);
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to connect Instagram');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="header">
          <h1>⚙️ Settings</h1>
        </div>
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>⚙️ Settings</h1>
        <p>Manage your account</p>
      </div>

      <div style={{ padding: '16px' }}>
        {user && (
          <>
            <div className="card">
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>👤 Account Info</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Email</p>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>{user.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Username</p>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>{user.username}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Joined</p>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>🔗 Connected Platforms</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Connect your social media accounts to analyze your content</p>
              <div style={{ display: 'grid', gap: '12px' }}>
                <button onClick={connectYouTube} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', gap: '12px' }}>
                  <Youtube size={20} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>Connect YouTube</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Demo mode - No auth needed</div>
                  </div>
                </button>
                <button onClick={connectInstagram} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', gap: '12px' }}>
                  <Instagram size={20} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>Connect Instagram</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Demo mode - No auth needed</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>📱 About</h3>
              <div style={{ display: 'grid', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <div>
                  <strong>Viral Channel Growth Engine</strong>
                  <p>v1.0.0 - Free Edition</p>
                </div>
                <div>
                  <strong>Features:</strong>
                  <ul style={{ marginLeft: '16px', marginTop: '4px' }}>
                    <li>✨ AI-powered growth recommendations</li>
                    <li>📊 Real-time analytics dashboard</li>
                    <li>🎯 Viral potential scoring</li>
                    <li>📱 Mobile-first design</li>
                    <li>🆓 100% Free - No credit card needed</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>⚖️ Legal</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '8px' }}><strong>Important Disclaimer:</strong></p>
                <p>This app provides analysis and recommendations based on your existing content performance. It does NOT:</p>
                <ul style={{ marginLeft: '16px', marginTop: '4px' }}>
                  <li>Generate fake views or engagement</li>
                  <li>Use bots or automated engagement</li>
                  <li>Violate platform terms of service</li>
                  <li>Guarantee specific growth results</li>
                </ul>
                <p style={{ marginTop: '8px' }}>All recommendations are based on content optimization best practices only.</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', gap: '8px', marginTop: '24px', color: '#ef4444', borderColor: '#ef4444' }}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
