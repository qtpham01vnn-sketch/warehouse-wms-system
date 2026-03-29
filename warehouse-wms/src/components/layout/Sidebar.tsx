import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  History, 
  Settings,
  Boxes
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/', label: 'Tổng quan', icon: BarChart3 },
  { path: '/products', label: 'Danh mục Gạch', icon: Boxes },
  { path: '/inventory', label: 'Tồn kho', icon: Package },
  { path: '/inbound', label: 'Nhập kho', icon: ArrowDownLeft },
  { path: '/outbound', label: 'Xuất kho', icon: ArrowUpRight },
  { path: '/history', label: 'Thẻ kho', icon: History },
  { path: '/settings', label: 'Cấu hình', icon: Settings },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-box">
          <Package className="text-primary icon-glow" />
        </div>
        <div className="logo-text">
          <h1 className="sidebar-title">TILE WMS</h1>
          <span className="sidebar-subtitle">Bình Dương Whse</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-card glass-card">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin Whse</span>
            <span className="user-role">Quản lý kho</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
