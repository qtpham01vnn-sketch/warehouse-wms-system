import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Building2, 
  CheckSquare, 
  TrendingUp, 
  PieChart, 
  FolderOpen, 
  Settings
} from 'lucide-react';
import './Sidebar.css';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/plans', label: 'KH Tổng', icon: Target },
  { path: '/department-plans', label: 'Phòng ban', icon: Building2 },
  { path: '/approvals', label: 'Phê duyệt', icon: CheckSquare, badge: 3 },
  { path: '/progress', label: 'Tiến độ', icon: TrendingUp },
  { path: '/reports', label: 'Báo cáo', icon: PieChart },
  { path: '/documents', label: 'Tài liệu', icon: FolderOpen },
  { path: '/settings', label: 'Cài đặt', icon: Settings },
];

const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-placeholder">wf</div>
        <h1 className="sidebar-title">WorkFlow Pro</h1>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <item.icon size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        {currentUser && (
          <div className="user-info">
            <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" />
            <div className="user-details">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role capitalize">{currentUser.role}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
