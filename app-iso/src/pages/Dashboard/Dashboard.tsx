import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, Clock, AlertTriangle, 
  Archive, LayoutGrid, ArrowUpRight, ShieldAlert 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardSummary, DepartmentStats } from '../../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<{ departments: DepartmentStats[], summary: DashboardSummary } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [profile]);

  if (loading || !stats) return <div className="loading-state">Đang tải dữ liệu hệ thống...</div>;

  const isAdmin = profile?.role === 'Admin';
  // Lọc tiles hiển thị dựa trên quyền hạn
  const visibleDepartments = isAdmin 
    ? stats.departments 
    : stats.departments.filter(d => d.department_id === profile?.department);

  const handleTileClick = (deptName: string) => {
    navigate(`/documents?dept=${encodeURIComponent(deptName)}`);
  };

  return (
    <div className="dashboard">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Hệ thống Dashboard ISO</h1>
          <p className="subtitle">
            Chào mừng, {profile?.full_name} · <span className="profile-badge">{profile?.role}</span>
          </p>
        </div>
        <div className="header-actions">
          <div className="system-status-pill glass-card">
            <LayoutGrid size={16} />
            <span>{isAdmin ? 'Toàn công ty' : `Phòng ban: ${profile?.department}`}</span>
          </div>
        </div>
      </header>

      {/* Top KPI Bar */}
      <section className="kpi-bar">
        <div className="kpi-card glass-card">
          <div className="kpi-icon total"><FileText size={20} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Tổng tài liệu</span>
            <h2 className="kpi-value">{stats.summary.total}</h2>
          </div>
        </div>
        <div className="kpi-card glass-card">
          <div className="kpi-icon active"><CheckCircle size={20} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Đang hiệu lực</span>
            <h2 className="kpi-value">{stats.summary.active}</h2>
          </div>
        </div>
        <div className="kpi-card glass-card">
          <div className="kpi-icon pending"><Clock size={20} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Chờ phê duyệt</span>
            <h2 className="kpi-value">{stats.summary.pending}</h2>
          </div>
        </div>
        <div className="kpi-card glass-card">
          <div className="kpi-icon expiring"><AlertTriangle size={20} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Sắp hết hạn (30d)</span>
            <h2 className="kpi-value urgent-text">{stats.summary.expiring}</h2>
          </div>
        </div>
        <div className="kpi-card glass-card">
          <div className="kpi-icon obsolete"><Archive size={20} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Hết hiệu lực</span>
            <h2 className="kpi-value">{stats.summary.obsolete}</h2>
          </div>
        </div>
      </section>

      {/* Department Bento Grid */}
      <div className="dashboard-grid bento-layout">
        {visibleDepartments.map((dept) => (
          <div 
            key={dept.department_id} 
            className={`dept-tile glass-card status-${dept.status_color} hover-lift`}
            onClick={() => handleTileClick(dept.department_id)}
          >
            <div className="tile-header">
              <h3>{dept.department_id}</h3>
              <div className={`status-indicator ${dept.status_color}`}></div>
            </div>
            
            <div className="tile-stats">
              <div className="tile-stat-item">
                <span className="label">Hiệu lực</span>
                <span className="value">{dept.active}</span>
              </div>
              <div className="tile-stat-item">
                <span className="label">Chờ duyệt</span>
                <span className="value">{dept.pending}</span>
              </div>
              <div className="tile-stat-item">
                <span className="label">Sắp hạn</span>
                <span className="value urgent">{dept.expiring}</span>
              </div>
              <div className="tile-stat-item">
                <span className="label">Lưu trữ</span>
                <span className="value">{dept.obsolete}</span>
              </div>
            </div>

            <div className="tile-footer">
              <span className="total-label">{dept.total} TÀI LIỆU</span>
              <ArrowUpRight size={16} />
            </div>

            {dept.status_color === 'red' && (
              <div className="risk-badge">
                <ShieldAlert size={14} /> <span>NGUY HIỂM</span>
              </div>
            )}
          </div>
        ))}

        {visibleDepartments.length === 0 && (
          <div className="empty-state full-width glass-card">
            <LayoutGrid size={48} />
            <p>Không tìm thấy dữ liệu cho phòng ban của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
