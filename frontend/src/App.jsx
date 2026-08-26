import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Videos from './pages/Videos';
import AIGrowth from './pages/AIGrowth';
import Planner from './pages/Planner';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import VideoDetail from './pages/VideoDetail';
import Login from './pages/Login';
import Navigation from './components/Navigation';
import { useAuth } from './hooks/useAuth';

function App() {
  const { token, login, logout } = useAuth();

  if (!token) {
    return <Login onLogin={login} />;
  }

  return (
    <BrowserRouter>
      <div className="container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/videos/:videoId" element={<VideoDetail />} />
            <Route path="/ai-growth" element={<AIGrowth />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings onLogout={logout} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;
