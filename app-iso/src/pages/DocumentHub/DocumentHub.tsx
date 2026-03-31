import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Download, FileSpreadsheet } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/shared/Modal';
import DocumentForm from '../../components/specific/DocumentForm';
import type { ISODocument, DocumentType } from '../../types';
import './DocumentHub.css';

const DocumentHub: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<ISODocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'ALL'>('ALL');

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await documentService.getDocuments(profile, {
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
        search: searchTerm
      });
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [typeFilter, searchTerm, profile]);

  const handleExport = async () => {
    if (!user || !profile) return;
    try {
      await documentService.exportToExcel(documents);
      await documentService.logActivity({
        user_id: user.id,
        user_name: profile.full_name || 'User',
        action: 'Export',
        target_id: null as any,
        target_type: null as any
      });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Không thể xuất báo cáo Excel.');
    }
  };

  const canCreate = profile?.role !== 'Standard';

  return (
    <div className="document-hub">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Danh mục tài liệu</h1>
          <p className="subtitle">Quản lý và tra cứu quy trình, biểu mẫu, hướng dẫn công việc</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleExport}>
            <FileSpreadsheet size={18} />
            <span>Xuất báo cáo ISO</span>
          </button>
          {canCreate && (
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} />
              <span>Thêm tài liệu mới</span>
            </button>
          )}
        </div>
      </header>

      <div className="controls-row glass-card">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo mã tài liệu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
            <option value="ALL">Tất cả loại</option>
            <option value="QT">QT - Quy trình</option>
            <option value="HS">HS - Hồ sơ</option>
            <option value="BM">BM - Biểu mẫu</option>
            <option value="HDCV">HDCV - Hướng dẫn</option>
          </select>
        </div>
      </div>

      <div className="docs-table-container glass-card">
        {loading ? (
          <div className="loading-state">Đang tải danh sách tài liệu...</div>
        ) : (
          <table className="docs-table">
            <thead>
              <tr>
                <th>Mã số</th>
                <th>Tên tài liệu</th>
                <th>Phòng ban</th>
                <th>Trạng thái</th>
                <th>Ngày hiệu lực</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} onClick={() => navigate(`/documents/${doc.id}`)}>
                  <td className="code-cell">{doc.code}</td>
                  <td className="title-cell">
                    <span className="type-tag">{doc.type}</span>
                    {doc.title}
                  </td>
                  <td>{doc.department}</td>
                  <td><span className={`badge badge-${doc.status}`}>{doc.status}</span></td>
                  <td>{doc.effective_date}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="actions-cell">
                      <button className="btn-icon" title="Xem" onClick={() => navigate(`/documents/${doc.id}`)}>
                        <Eye size={18} />
                      </button>
                      <button 
                        className="btn-icon" 
                        title="Tải về" 
                        onClick={() => doc.current_version_id && user && profile && documentService.getFileActions(doc.id, doc.current_version_id, user.id, profile.full_name || 'User').download()}
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state">Không tìm thấy tài liệu phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Đăng ký tài liệu ISO mới"
      >
        <DocumentForm 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchDocs();
          }} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default DocumentHub;
