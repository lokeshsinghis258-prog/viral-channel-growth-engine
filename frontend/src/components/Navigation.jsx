import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Video, Zap, Calendar, BarChart3, Settings } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/videos', label: 'Videos', icon: Video },
    { path: '/ai-growth', label: 'AI Growth', icon: Zap },
    { path: '/planner', label: 'Planner', icon: Calendar },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="nav-bottom">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <IconComponent size={24} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
