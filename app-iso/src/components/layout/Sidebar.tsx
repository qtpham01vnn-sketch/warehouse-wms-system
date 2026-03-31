import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Award, Bell, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-brand">
        <h2 className="gradient-text">ISO Pro</h2>
        <span className="brand-dot"></span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Tổng quan</span>
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
        <NavLink to="/settings" className="nav-item">
          <Settings size={20} />
          <span>Cài đặt</span>
        </NavLink>
        <button className="nav-item logout-btn">
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
