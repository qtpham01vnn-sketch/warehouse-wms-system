import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Award, Bell, Shield, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar glass-card">
        <div className="sidebar-header">
          <Shield className="logo-icon" size={32} />
          <h2 className="gradient-text">ISO App</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
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
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          {profile && (
            <div className="user-profile">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <p className="user-name">{profile.full_name || 'User'}</p>
                <p className="user-role">{profile.role} · {profile.department}</p>
              </div>
            </div>
          )}
          <button className="btn-logout" onClick={handleSignOut}>
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
