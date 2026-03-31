import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Download, Eye, User, Calendar, 
  Clock, Shield, Send, CheckCircle, FileCheck, Archive 
} from 'lucide-react';
import { documentService } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';
import type { ISODocument, DocumentVersion, DocumentStatus } from '../../types';
import './DocumentDetail.css';

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const [doc, setDoc] = useState<ISODocument | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [docData, versionsData] = await Promise.all([
        documentService.getDocumentById(id),
        documentService.getVersions(id)
      ]);
      setDoc(docData);
      setVersions(versionsData);
    } catch (error) {
      console.error('Error fetching document details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTransition = async (toStatus: DocumentStatus) => {
    if (!doc || !user || !profile) return;
    try {
      await documentService.transitionStatus(
        doc.id, 
        doc.status, 
        toStatus, 
        user.id, 
        profile.full_name || 'User'
      );
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi chuyển trạng thái.');
    }
  };

  if (loading) return <div className="loading-state">Đang tải thông tin tài liệu...</div>;
  if (!doc) return <div className="error-state">Không tìm thấy tài liệu.</div>;

  const currentVersion = versions.find(v => v.is_active) || versions[0];
  const isISOAdmin = profile?.role === 'Admin';
  const isApprover = profile?.role === 'Approver' || isISOAdmin;
  const isReviewer = profile?.role === 'Reviewer' || isISOAdmin;
  const isActive = doc.status === 'active';

  return (
    <div className="document-detail">
      <header className="page-header">
        <div className="header-left">
          <Link to="/documents" className="btn-back"><ArrowLeft size={20} /></Link>
          <div>
            <div className="doc-meta-top">
              <span className="type-tag">{doc.type}</span>
              <span className={`badge badge-${doc.status}`}>{doc.status}</span>
              <span className="badge badge-outline"><Shield size={12} /> {doc.visibility}</span>
              {isActive && <span className="badge badge-locked"><Shield size={12} /> LOCKED</span>}
            </div>
            <h1 className="gradient-text">{doc.code}: {doc.title}</h1>
          </div>
        </div>
        <div className="header-actions">
          {doc.status === 'draft' && isReviewer && (
            <button className="btn-secondary" onClick={() => handleTransition('under_review')}>
              <Send size={18} /> Gửi xem xét
            </button>
          )}
          {doc.status === 'under_review' && isReviewer && (
            <button className="btn-secondary" onClick={() => handleTransition('approved')}>
              <CheckCircle size={18} /> Phê duyệt
            </button>
          )}
          {doc.status === 'approved' && isApprover && (
            <button className="btn-primary" onClick={() => handleTransition('active')}>
              <FileCheck size={18} /> Ban hành
            </button>
          )}
          {doc.status === 'active' && isISOAdmin && (
            <div className="admin-actions">
              <button className="btn-secondary" onClick={() => handleTransition('draft')}>
                <Send size={18} /> Tạo bản thảo mới (Revise)
              </button>
              <button className="btn-danger-outline" onClick={() => handleTransition('obsolete')}>
                <Archive size={18} /> Lưu trữ
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="detail-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Thông tin chung
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Lịch sử phiên bản ({versions.length})
        </button>
      </div>

      <div className="detail-tab-content">
        {activeTab === 'overview' ? (
          <div className="overview-grid">
            <section className="info-section glass-card">
              <h3>Thuộc tính tài liệu</h3>
              <div className="info-list">
                <div className="info-item">
                  <User size={18} />
                  <div><span className="label">Người soạn thảo</span><p>{doc.owner}</p></div>
                </div>
                <div className="info-item">
                  <User size={18} />
                  <div><span className="label">Người xem xét</span><p>{doc.reviewer}</p></div>
                </div>
                <div className="info-item">
                  <User size={18} />
                  <div><span className="label">Người phê duyệt</span><p>{doc.approver}</p></div>
                </div>
                <div className="info-item">
                  <Calendar size={18} />
                  <div><span className="label">Ban hành / Hiệu lực</span><p>{doc.published_date} / {doc.effective_date}</p></div>
                </div>
                <div className="info-item">
                  <Clock size={18} />
                  <div>
                    <span className="label">Ngày rà soát định kỳ</span>
                    <p className={new Date(doc.next_review_date || '') < new Date() ? 'urgent-text' : ''}>
                      {doc.next_review_date || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="current-version-info glass-card">
              <div className="section-header-row">
                <h3>Phiên bản hiện hành</h3>
                {currentVersion && user && profile && (
                  <div className="ver-actions">
                    <button 
                      className="btn-icon" 
                      onClick={() => documentService.getFileActions(doc.id, currentVersion.file_url, user.id, profile.full_name || 'User').view()}
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => documentService.getFileActions(doc.id, currentVersion.file_url, user.id, profile.full_name || 'User').download()}
                    >
                      <Download size={18} />
                    </button>
                  </div>
                )}
              </div>
              {currentVersion ? (
                <div className="version-card">
                  <div className="ver-header">
                    <span className="ver-num">{currentVersion.version_number}</span>
                    <span className="ver-date">{new Date(currentVersion.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <p className="ver-log">{currentVersion.change_log || 'Không có log thay đổi.'}</p>
                  <p className="ver-user">Tải lên bởi: {currentVersion.uploader_name || doc.owner}</p>
                </div>
              ) : (
                <p className="empty-msg">Chưa có phiên bản nào.</p>
              )}
            </section>
          </div>
        ) : (
          <div className="history-table-container glass-card">
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Phiên bản</th>
                  <th>Nội dung thay đổi</th>
                  <th>Người tải lên</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((ver) => (
                  <tr key={ver.id}>
                    <td className="ver-num-cell">{ver.version_number}</td>
                    <td className="ver-log-cell">{ver.change_log}</td>
                    <td>{ver.uploader_name}</td>
                    <td>{new Date(ver.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      {ver.is_active ? 
                        <span className="badge badge-active">Hiện hành</span> : 
                        <span className="badge badge-draft">Lưu trữ</span>
                      }
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button 
                          className="btn-icon" 
                          onClick={() => user && profile && documentService.getFileActions(doc.id, ver.file_url, user.id, profile.full_name || 'User').view()}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => user && profile && documentService.getFileActions(doc.id, ver.file_url, user.id, profile.full_name || 'User').download()}
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentDetail;
