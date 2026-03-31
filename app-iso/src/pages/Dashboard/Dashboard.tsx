import React, { useState, useEffect } from 'react';
import { 
  FileText, Award, AlertTriangle, CheckCircle, 
  Clock, BarChart3, PieChart, ArrowUpRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { documentService } from '../../services/documentService';
import { certificateService } from '../../services/certificateService';
import { alertService } from '../../services/alertService';
import type { ISODocument, ISOCertificate, ISOAlert } from '../../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [docs, setDocs] = useState<ISODocument[]>([]);
  const [certs, setCerts] = useState<ISOCertificate[]>([]);
  const [alerts, setAlerts] = useState<ISOAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [docsData, certsData] = await Promise.all([
          documentService.getDocuments(profile),
          certificateService.getCertificates()
        ]);
        setDocs(docsData);
        setCerts(certsData);
        setAlerts(alertService.calculateAlerts(docsData, certsData));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profile]);

  if (loading) return <div className="loading-state">Đang tải dữ liệu hệ thống...</div>;

  // Stats calculation
  const totalDocs = docs.length;
  const activeCerts = certs.length;
  const urgentAlerts = alerts.filter(a => a.priority === 'Danger').length;
  
  const docsByType = {
    QT: docs.filter(d => d.type === 'QT').length,
    HS: docs.filter(d => d.type === 'HS').length,
    BM: docs.filter(d => d.type === 'BM').length,
    HDCV: docs.filter(d => d.type === 'HDCV').length,
  };

  const overdueReviews = docs.filter(d => d.next_review_date && new Date(d.next_review_date) < new Date());
  
  const expiringCerts = certs.filter(c => {
    const daysUntilExpiry = (new Date(c.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry < 30;
  });

  const upcomingTasks = [...docs]
    .filter(d => d.next_review_date)
    .sort((a, b) => new Date(a.next_review_date!).getTime() - new Date(b.next_review_date!).getTime())
    .slice(0, 5);

  return (
    <div className="dashboard">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Hệ thống ISO Audit-Ready</h1>
          <p className="subtitle">
            Chào mừng, {profile?.full_name} · <span className="profile-badge">{profile?.role}</span> · {profile?.department}
          </p>
        </div>
        <div className="header-date glass-card">
          <Clock size={18} />
          <span>{new Date().toLocaleDateString('vi-VN')}</span>
        </div>
      </header>

      {/* Audit Highlights */}
      {(overdueReviews.length > 0 || expiringCerts.length > 0) && (
        <div className="audit-alerts-section">
          {overdueReviews.length > 0 && (
            <div className="audit-alert danger glass-card">
              <AlertTriangle size={20} />
              <span>Có {overdueReviews.length} tài liệu quá hạn rà soát!</span>
            </div>
          )}
          {expiringCerts.length > 0 && (
            <div className="audit-alert warning glass-card">
              <Award size={20} />
              <span>Có {expiringCerts.length} chứng nhận sắp hết hạn (&lt;30 ngày).</span>
            </div>
          )}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card glass-card hover-lift" onClick={() => navigate('/documents')}>
          <div className="stat-icon docs"><FileText /></div>
          <div className="stat-info">
            <p className="stat-label">Tổng tài liệu</p>
            <h3 className="stat-value">{totalDocs}</h3>
          </div>
          <ArrowUpRight className="card-arrow" size={20} />
        </div>
        <div className="stat-card glass-card hover-lift" onClick={() => navigate('/certificates')}>
          <div className="stat-icon certs"><Award /></div>
          <div className="stat-info">
            <p className="stat-label">Chứng nhận ISO</p>
            <h3 className="stat-value">{activeCerts}</h3>
          </div>
          <ArrowUpRight className="card-arrow" size={20} />
        </div>
        <div className="stat-card glass-card hover-lift" onClick={() => navigate('/alerts')}>
          <div className="stat-icon alerts"><AlertTriangle /></div>
          <div className="stat-info">
            <p className="stat-label">Cảnh báo đỏ</p>
            <h3 className="stat-value">{urgentAlerts}</h3>
          </div>
          <ArrowUpRight className="card-arrow" size={20} />
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon status"><CheckCircle /></div>
          <div className="stat-info">
            <p className="stat-label">Tỷ lệ tuân thủ</p>
            <h3 className="stat-value">98%</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section glass-card">
          <div className="section-header">
            <h3><BarChart3 size={20} /> Tài liệu theo loại</h3>
          </div>
          <div className="type-stats">
            {Object.entries(docsByType).map(([type, count]) => (
              <div key={type} className="type-item">
                <div className="type-info">
                  <span className="type-code">{type}</span>
                  <span className="type-count">{count} tài liệu</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${totalDocs > 0 ? (count / totalDocs) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section glass-card">
          <div className="section-header">
            <h3><Clock size={20} /> Tài liệu sắp rà soát</h3>
            <button className="btn-text" onClick={() => navigate('/documents')}>Xem tất cả</button>
          </div>
          <div className="recent-list">
            {upcomingTasks.map((doc: ISODocument) => {
              const isOverdue = new Date(doc.next_review_date!) < new Date();
              return (
                <div key={doc.id} className={`recent-item ${isOverdue ? 'overdue' : ''}`} onClick={() => navigate(`/documents/${doc.id}`)}>
                  <div className="item-main">
                    <p className="item-title">{doc.code}</p>
                    <p className="item-sub">{doc.title}</p>
                  </div>
                  <div className="item-meta">
                    <span className={isOverdue ? 'urgent-text' : ''}>{doc.next_review_date}</span>
                  </div>
                </div>
              );
            })}
            {upcomingTasks.length === 0 && <p className="empty-msg">Không có tài liệu nào sắp đến hạn rà soát.</p>}
          </div>
        </section>

        <section className="dashboard-section glass-card full-width">
          <div className="section-header">
            <h3><PieChart size={20} /> Chứng nhận sắp hết hạn</h3>
            <button className="btn-text" onClick={() => navigate('/certificates')}>Quản lý</button>
          </div>
          <div className="certs-radar">
            {certs.slice(0, 4).map(cert => (
              <div key={cert.id} className="radar-item">
                <div className="radar-icon"><Award size={24} /></div>
                <div className="radar-info">
                  <p className="radar-name">{cert.name}</p>
                  <p className="radar-expiry">Ngày hết hạn: {cert.expiry_date}</p>
                </div>
                <div className="radar-status">
                  {new Date(cert.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? (
                    <span className="badge badge-urgent">Nguy hiểm</span>
                  ) : (
                    <span className="badge badge-active">Hiệu lực</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
