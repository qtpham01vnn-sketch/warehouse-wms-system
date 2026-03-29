import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, File, Info, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { documentService } from '../../services/documentService';
import { notificationService } from '../../services/notificationService';
import type { ISOVideoNotification } from '../../services/notificationService';
import type { Document as IsoDocument } from '../../types';
import './TopBar.css';

const TopBar: React.FC = () => {
  const { currentUser, users, login, logout } = useAuth();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<IsoDocument[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState<ISOVideoNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await notificationService.getRecentNotifications();
      setNotifications(data);
      setUnreadCount(data.length); 
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (val: string) => {
    setSearchTerm(val);
    if (val.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    setShowResults(true);
    try {
      const { data } = await documentService.getDocuments({ searchTerm: val, pageSize: 5 });
      setSearchResults(data as IsoDocument[]);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <header className="topbar">
      <div className="search-container relative">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Tìm nhanh QT, HS, BM, HD... (Smart Search)" 
          className="search-input"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        
        {showResults && (
          <div className="search-dropdown-results glass-panel shadow-glow-lg animate-fade-in">
            <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted border-bottom border-white/5">
              {searching ? 'Đang tìm kiếm thông minh...' : `Tìm thấy ${searchResults.length} kết quả phù hợp`}
            </div>
            {searchResults.length > 0 ? (
              <ul className="search-results-list">
                {searchResults.map(doc => (
                  <li 
                    key={doc.id} 
                    className="search-result-item flex items-center gap-3 p-3 hover:bg-white/5 transition-all cursor-pointer"
                    onClick={() => window.open(doc.url, '_blank')}
                  >
                    <div className="result-icon-wrapper p-2 bg-primary/10 rounded-lg text-primary">
                      <File size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-secondary">[{doc.docCode}] {doc.name}</div>
                      <div className="text-[10px] text-muted flex gap-2">
                        <span className="uppercase">{doc.isoType}</span> • 
                        <span>Phòng: {doc.departmentId}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : !searching && (
              <div className="p-4 text-center text-xs text-muted">Không tìm thấy tài liệu phù hợp</div>
            )}
            <div className="dropdown-footer p-2 text-center border-top border-white/5 bg-primary/5">
               <button className="text-[10px] text-primary font-bold uppercase hover:underline">Xem tất cả kết quả</button>
            </div>
          </div>
        )}
      </div>

      <div className="topbar-actions">
        <div className="relative">
          <button className={`icon-button ${showNotifications ? 'active' : ''}`} onClick={() => {
            setShowNotifications(!showNotifications);
            setUnreadCount(0);
          }}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown glass-panel shadow-glow-lg animate-fade-in">
              <div className="dropdown-header flex-between p-4 border-bottom border-white/5">
                <span className="font-bold text-sm">Thông báo ISO</span>
                <span className="text-[10px] text-primary cursor-pointer hover:underline">Đã xem tất cả</span>
              </div>
              <div className="notifications-list custom-scrollbar max-h-[350px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted">Không có thông báo mới</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className="notif-item p-4 border-bottom border-white/5 hover:bg-white/5 transition-all">
                      <div className="flex gap-3">
                        <div className={`notif-icon-wrapper rounded-lg p-2 ${notif.type === 'expiry' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                          {notif.type === 'expiry' ? <AlertCircle size={14} /> : <Info size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-secondary">{notif.title}</div>
                          <div className="text-[11px] text-muted leading-relaxed mt-1">{notif.message}</div>
                          <div className="text-[9px] text-primary-hover mt-2 uppercase">{notif.time}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="user-menu-container">
          <button 
            className="user-menu-btn" 
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
          >
            <img 
              src={currentUser?.avatar || 'https://i.pravatar.cc/150'} 
              alt="User" 
              className="topbar-avatar" 
            />
            <ChevronDown size={16} />
          </button>

          {showRoleSwitcher && (
            <div className="role-switcher-dropdown glass-panel">
              <div className="dropdown-header">Mock Login</div>
              <ul className="role-list">
                {users.map(user => (
                  <li 
                    key={user.id} 
                    className={`role-item ${currentUser?.id === user.id ? 'active' : ''}`}
                    onClick={() => {
                      login(user.id);
                      setShowRoleSwitcher(false);
                    }}
                  >
                    <img src={user.avatar} alt={user.name} className="role-avatar" />
                    <div>
                      <div className="role-name">{user.name}</div>
                      <div className="role-title capitalize">{user.role}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="dropdown-footer">
                <button 
                  className="logout-btn"
                  onClick={() => {
                    logout();
                    setShowRoleSwitcher(false);
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
