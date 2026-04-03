import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, Clock, AlertTriangle, 
  Archive, LayoutGrid, ShieldAlert,
  ChevronRight, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardService, type PriorityItem, ISO_DEPARTMENTS } from '../../services/dashboardService';
import type { DashboardSummary, DepartmentStats } from '../../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<{ 
    departments: DepartmentStats[], 
    summary: DashboardSummary,
    priorityItems: PriorityItem[]
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const stats = await dashboardService.getStats();
        setData(stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [profile]);

  if (loading || !data) return <div className="loading-state">Đang khởi tạo Command Center...</div>;

  const isAdmin = profile?.role === 'Admin';
  // Luôn hiển thị tất cả 8 phòng ban (đã được sắp xếp và đầy đủ từ service)
  const departments = data.departments;

  const handleTileClick = (deptName: string) => {
    navigate(`/documents?dept=${encodeURIComponent(deptName)}`);
  };

  const getPriorityIcon = (type: string) => {
    switch (type) {
      case 'expiring': return <AlertTriangle size={16} className="text-orange" />;
      case 'pending': return <Clock size={16} className="text-yellow" />;
      case 'overdue': return <ShieldAlert size={16} className="text-red" />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="dashboard">
      <header className="page-header">
        <div className="header-left">
          <h1 className="header-title">Trung tâm Điều hành ISO</h1>
          <p className="header-subtitle">
            Hệ thống quản lý tài liệu vận hành · <span className="profile-name">Chào {profile?.full_name}</span>
          </p>
        </div>
        
        <div className="header-actions">
          <div className="scope-chip glass-card">
            <LayoutGrid size={14} />
            <span>{isAdmin ? 'Toàn công ty' : `Bộ phận: ${ISO_DEPARTMENTS.find(d => d.id === profile?.departmentid)?.label || profile?.departmentid}`}</span>
          </div>
          
          <div className="action-buttons">
            <button className="btn-action primary">
              <FileText size={16} />
              <span>Tạo tài liệu</span>
            </button>
            <button className="btn-action warning">
              <ShieldAlert size={16} />
              <span>Cảnh báo</span>
            </button>
            <button className="btn-action info">
              <Activity size={16} />
              <span>Báo cáo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Top KPI Bar - Modern Horizontal Layout */}
      <section className="kpi-grid">
        <div className="kpi-card glass-card stat-total">
          <div className="kpi-card-inner">
            <div className="kpi-info">
              <span className="kpi-label">Tổng tài liệu</span>
              <h2 className="kpi-value">{data.summary.total}</h2>
            </div>
            <div className="kpi-icon-box"><FileText size={22} /></div>
          </div>
        </div>
        
        <div className="kpi-card glass-card stat-active">
          <div className="kpi-card-inner">
            <div className="kpi-info">
              <span className="kpi-label">Đang hiệu lực</span>
              <h2 className="kpi-value">{data.summary.active}</h2>
            </div>
            <div className="kpi-icon-box"><CheckCircle size={22} /></div>
          </div>
        </div>
        
        <div className="kpi-card glass-card stat-pending">
          <div className="kpi-card-inner">
            <div className="kpi-info">
              <span className="kpi-label">Chờ phê duyệt</span>
              <h2 className="kpi-value">{data.summary.pending}</h2>
            </div>
            <div className="kpi-icon-box"><Clock size={22} /></div>
          </div>
        </div>
        
        <div className="kpi-card glass-card stat-expiring">
          <div className="kpi-card-inner">
            <div className="kpi-info">
              <span className="kpi-label">Sắp hết hạn</span>
              <h2 className="kpi-value">{data.summary.expiring}</h2>
            </div>
            <div className="kpi-icon-box"><AlertTriangle size={22} /></div>
          </div>
        </div>
        
        <div className="kpi-card glass-card stat-obsolete">
          <div className="kpi-card-inner">
            <div className="kpi-info">
              <span className="kpi-label">Lưu trữ</span>
              <h2 className="kpi-value">{data.summary.obsolete}</h2>
            </div>
            <div className="kpi-icon-box"><Archive size={22} /></div>
          </div>
        </div>
      </section>

      {/* Department Bento Grid */}
      <div className="dashboard-grid bento-layout">
        {departments.map((dept) => (
          <div 
            key={dept.department_id} 
            className={`dept-tile glass-card tile-glow-${dept.status_color} hover-lift`}
            onClick={() => handleTileClick(dept.department_id)}
          >
            <div className="tile-header">
              <h3>{dept.department_name}</h3>
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
              <ChevronRight size={16} />
            </div>

            {dept.status_color === 'red' && (
              <div className="risk-badge">
                <ShieldAlert size={14} /> <span>NGUY CƠ</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Priority & Action Panels */}
      <div className="action-panels">
        <section className="priority-panel glass-card">
          <div className="panel-header">
            <ShieldAlert size={20} className="text-red" />
            <h3>Ưu tiên hôm nay</h3>
          </div>
          <div className="priority-list">
            {data.priorityItems.map(item => (
              <div key={item.id} className={`priority-item ${item.type}`}>
                <div className="item-icon">{getPriorityIcon(item.type)}</div>
                <div className="item-content">
                  <span className="item-title">{item.title}</span>
                  <span className="item-meta">
                    {item.department} · {item.type === 'pending' ? item.status : `Hạn: ${item.dueDate}`}
                  </span>
                </div>
                <ChevronRight size={16} className="btn-go" />
              </div>
            ))}
            {data.priorityItems.length === 0 && (
              <div className="empty-panel-msg">Không có vấn đề khẩn cấp.</div>
            )}
          </div>
        </section>

        <section className="tasks-panel glass-card">
          <div className="panel-header">
            <Activity size={20} className="text-info" />
            <h3>Tài liệu cần xử lý</h3>
          </div>
          <div className="task-list">
             <div className="priority-item">
                <div className="item-icon"><FileText size={16} /></div>
                <div className="item-content">
                  <span className="item-title">Quy trình kiểm soát chất lượng V2</span>
                  <span className="item-meta">P.QAQC · Yêu cầu chỉnh sửa bởi Ban ISO</span>
                </div>
                <ChevronRight size={16} className="btn-go" />
             </div>
             <div className="priority-item">
                <div className="item-icon"><FileText size={16} /></div>
                <div className="item-content">
                  <span className="item-title">Hướng dẫn vận hành máy nén khí</span>
                  <span className="item-meta">PXSX · Đang chờ phê duyệt</span>
                </div>
                <ChevronRight size={16} className="btn-go" />
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
