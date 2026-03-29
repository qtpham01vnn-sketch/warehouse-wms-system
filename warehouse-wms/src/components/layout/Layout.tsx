import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <div className="search-bar">
            {/* Search Placeholder */}
            <input type="text" placeholder="Tìm kiếm mã gạch, lô sản xuất..." className="search-input" />
          </div>
          <div className="header-actions">
            <button className="btn-icon">
              <span className="notification-dot"></span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
          </div>
        </header>
        <div className="content-overflow">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
