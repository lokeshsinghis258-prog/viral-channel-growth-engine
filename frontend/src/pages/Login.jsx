import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, { email, password, username: email.split('@')[0] });
      onLogin(response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <div className="header">
          <h1>🚀 Viral Channel</h1>
          <p>Growth Engine</p>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </p>
          </div>

          <div className="demo-banner">
            <span>💡</span>
            <div>
              <strong>Demo Account:</strong> Use email: demo@example.com, password: demo123
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>

          <div style={{ marginTop: '32px', padding: '20px', backgroundColor: 'var(--surface)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>✨ Features:</h3>
            <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              <li>📊 Real-time analytics dashboard</li>
              <li>🎯 AI-powered growth recommendations</li>
              <li>📈 Viral potential scoring</li>
              <li>🎬 Video performance analysis</li>
              <li>📱 Mobile-first design</li>
              <li>💯 100% Free - No credit card needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
