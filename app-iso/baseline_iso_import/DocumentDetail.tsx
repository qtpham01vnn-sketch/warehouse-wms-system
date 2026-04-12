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
  const [docFiles, setDocFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Fetch document first (critical)
      const docData = await documentService.getDocumentById(id);
      console.log('[DETAIL] docData:', JSON.stringify(docData, null, 2));
      setDoc(docData);

      // Fetch versions (non-critical - table may not exist for imported docs)
      try {
        const versionsData = await documentService.getVersions(id);
        console.log('[DETAIL] versionsData:', versionsData);
        setVersions(versionsData);
      } catch (verErr) {
        console.warn('[DETAIL] Could not fetch versions (table may not exist):', verErr);
        setVersions([]);
      }

      // Fetch document files (non-critical)
      try {
        const filesData = await documentService.getDocumentFiles(id);
        console.log('[DETAIL] docFiles:', filesData);
        setDocFiles(filesData);
      } catch (fileErr) {
        console.warn('[DETAIL] Could not fetch document files:', fileErr);
        setDocFiles([]);
      }
    } catch (error) {
      console.error('[DETAIL] Error fetching document:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTransition = async (toStatus: DocumentStatus, comment?: string) => {
    if (!doc || !user || !profile) return;
    
    // Yêu cầu nhập lý do cho các bước quan trọng
    let finalComment = comment;
    const needsComment = (toStatus === 'draft' && (doc.status === 'under_review' || doc.status === 'approved' || doc.status === 'active'));
    
    if (needsComment && !finalComment) {
      finalComment = window.prompt('Vui lòng nhập lý do (Comment) cho hành động này:') || '';
      if (!finalComment) return; // Hủy nếu không nhập
    }

    try {
      await documentService.transitionStatus(
        doc.id,
        doc.status,
        toStatus,
        user.id,
        profile.full_name || 'User',
        profile.role,
        finalComment
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
              <span className="badge badge-outline"><Shield size={12} /> {doc.access_scope}</span>
              {isActive && <span className="badge badge-locked"><Shield size={12} /> LOCKED</span>}
            </div>
            <h1 className="gradient-text">{doc.code}: {doc.name}</h1>
          </div>
        </div>
        <div className="header-actions">
          {/* Draft -> Under Review */}
          {doc.status === 'draft' && (
            <button 
              className={`btn-secondary ${(!doc.drafter_name || !doc.reviewer_name || !doc.approver_name || !doc.nextreviewdate) ? 'opacity-50 cursor-not-allowed' : ''}`} 
              onClick={() => {
                if (!doc.drafter_name || !doc.reviewer_name || !doc.approver_name || !doc.nextreviewdate) {
                  alert('Cần bổ sung Người xem xét / Người phê duyệt / Ngày rà soát trước khi gửi duyệt');
                  return;
                }
                handleTransition('under_review');
              }}
              title={(!doc.drafter_name || !doc.reviewer_name || !doc.approver_name || !doc.nextreviewdate) ? 'Thiếu Metadata nghiệp vụ' : 'Gửi cho Ban ISO xem xét'}
            >
              <Send size={18} /> Gửi xem xét
            </button>
          )}

          {/* Under Review -> Approved or Back to Draft (Reject) */}
          {doc.status === 'under_review' && isReviewer && (
            <div className="btn-group">
              <button className="btn-primary" onClick={() => handleTransition('approved')}>
                <CheckCircle size={18} /> Phê duyệt
              </button>
              <button className="btn-danger-outline" onClick={() => handleTransition('draft')}>
                <Archive size={18} /> Từ chối
              </button>
            </div>
          )}

          {/* Approved -> Active or Back to Draft */}
          {doc.status === 'approved' && isApprover && (
            <div className="btn-group">
              <button className="btn-primary" onClick={() => handleTransition('active')}>
                <FileCheck size={18} /> Ban hành
              </button>
              <button className="btn-secondary" onClick={() => handleTransition('draft')}>
                <Send size={18} /> Hủy để sửa lại
              </button>
            </div>
          )}

          {/* Active -> Draft (Revise) or Obsolete */}
          {doc.status === 'active' && (
            <div className="admin-actions">
              <button className="btn-secondary" onClick={() => handleTransition('draft')}>
                <Send size={18} /> Tạo bản thảo mới (Revise)
              </button>
              {isISOAdmin && (
                <button className="btn-danger-outline" onClick={() => handleTransition('obsolete')}>
                  <Archive size={18} /> Lưu trữ (Obsolete)
                </button>
              )}
            </div>
          )}

          {/* Obsolete -> Active (Restore - Admin only) */}
          {doc.status === 'obsolete' && isISOAdmin && (
            <button className="btn-primary" onClick={() => handleTransition('active', 'Khôi phục tài liệu từ lưu trữ')}>
              <CheckCircle size={18} /> Khôi phục (Active)
            </button>
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
                  <Shield size={18} />
                  <div><span className="label">Mã tài liệu</span><p>{doc.code}</p></div>
                </div>
                <div className="info-item">
                  <FileCheck size={18} />
                  <div><span className="label">Tên quy trình</span><p>{doc.name}</p></div>
                </div>
                <div className="info-item">
                  <User size={18} />
                  <div><span className="label">Người soạn thảo</span><p>{doc.drafter_name || doc.owner_name}</p></div>
                </div>
                <div className="info-item">
                  <User size={18} />
                  <div><span className="label">Người xem xét</span><p>{doc.reviewer_name || doc.reviewer || 'Chưa thiết lập'}</p></div>
                </div>
                <div className="info-item">
                  <User size={18} />
                  <div><span className="label">Người phê duyệt</span><p>{doc.approver_name || doc.approver || 'Chưa thiết lập'}</p></div>
                </div>
                <div className="info-item">
                  <Calendar size={18} />
                  <div><span className="label">Ban hành / Hiệu lực</span><p>{doc.published_date} / {doc.effective_date}</p></div>
                </div>
                <div className="info-item">
                  <Clock size={18} />
                  <div>
                    <span className="label">Ngày rà soát định kỳ</span>
                    <p className={(doc.nextreviewdate && new Date(doc.nextreviewdate) < new Date()) ? 'urgent-text' : ''}>
                      {doc.nextreviewdate || 'Chưa thiết lập'}
                    </p>
                  </div>
                </div>
                <div className="info-item">
                  <Calendar size={18} />
                  <div><span className="label">Ngày tải lên</span><p>{doc.created_at ? new Date(doc.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p></div>
                </div>
              </div>
            </section>

            <section className="current-version-info glass-card">
              <div className="section-header-row">
                <h3>{currentVersion ? 'Phiên bản hiện hành' : 'File đính kèm'}</h3>
                {user && profile && (
                  <div className="ver-actions">
                    <button
                      className="btn-icon"
                      title="Xem file"
                      onClick={() => {
                        const fallbackUrl = currentVersion?.file_url || doc.url || '';
                        console.log('[DETAIL VIEW] docId:', doc.id, 'fallbackUrl:', fallbackUrl);
                        documentService.getFileActions(doc.id, fallbackUrl, user.id, profile.full_name || 'User').view();
                      }}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="btn-icon"
                      title="Tải về"
                      onClick={() => {
                        const fallbackUrl = currentVersion?.file_url || doc.url || '';
                        console.log('[DETAIL DOWNLOAD] docId:', doc.id, 'fallbackUrl:', fallbackUrl);
                        documentService.getFileActions(doc.id, fallbackUrl, user.id, profile.full_name || 'User').download();
                      }}
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
                  <p className="ver-user">Tải lên bởi: {currentVersion.uploader_name || doc.owner_name}</p>
                </div>
              ) : docFiles.length > 0 ? (
                <div className="version-card">
                  <p className="ver-log" style={{ marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    Tài liệu được import từ ZIP ({docFiles.length} file)
                  </p>
                  <div className="doc-files-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[...docFiles]
                      .sort((a, b) => {
                        const order: Record<string, number> = { 'QT': 1, 'BM': 2, 'HS': 3, 'PL': 4 };
                        return (order[a.file_type] || 99) - (order[b.file_type] || 99);
                      })
                      .map((f: any) => (
                        <div key={f.id} className="doc-file-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <span className={`type-tag type-${f.file_type.toLowerCase()}`}>{f.file_type}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {f.file_name}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                              {f.file_code}
                            </p>
                          </div>
                          {user && profile && (
                            <div className="file-row-actions" style={{ display: 'flex', gap: '4px' }}>
                              <button 
                                className="btn-icon-sm" 
                                title="Xem trực tuyến" 
                                style={{ padding: '6px', color: 'var(--primary)', background: 'rgba(236,72,153,0.1)', borderRadius: '6px' }}
                                onClick={() => documentService.getFileActions(doc.id, f.file_url, user.id, profile.full_name || 'User').view()}
                              >
                                <Eye size={14} />
                              </button>
                              <button 
                                className="btn-icon-sm" 
                                title="Tải về" 
                                style={{ padding: '6px', color: 'var(--info)', background: 'rgba(14,165,233,0.1)', borderRadius: '6px' }}
                                onClick={() => documentService.getFileActions(doc.id, f.file_url, user.id, profile.full_name || 'User').download()}
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <p className="empty-msg">Chưa có phiên bản hoặc file đính kèm nào.</p>
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
