import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Award, Bell, 
  LogOut, User, Shield 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-header">
        <Shield className="logo-icon" size={28} />
        <h2 className="gradient-text">ISO Command</h2>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/documents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={20} />
          <span>Tài liệu</span>
        </NavLink>
        
        <NavLink to="/certificates" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Award size={20} />
          <span>Chứng nhận</span>
        </NavLink>
        
        <NavLink to="/alerts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Bell size={20} />
          <span>Cảnh báo</span>
          <span className="nav-badge">4</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        {profile && (
          <div className="user-profile-box">
            <div className="user-avatar">
              <User size={18} />
            </div>
            <div className="user-text">
              <p className="user-name">{profile.full_name || 'User'}</p>
              <p className="user-role">{profile.role}</p>
            </div>
          </div>
        )}
        
        <button className="logout-btn" onClick={handleSignOut}>
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

