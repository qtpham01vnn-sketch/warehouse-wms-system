import React, { useState } from 'react';
import { Upload, CheckCircle2, Shield } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import type { ISODocument, DocumentType, DocumentStatus, DocumentVisibility } from '../../types';
import './Form.css';

interface DocumentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ onSuccess, onCancel }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    type: 'QT' as DocumentType,
    department: profile?.department || '',
    owner: profile?.full_name || '',
    reviewer: '',
    approver: '',
    next_review_date: '',
    visibility: 'department_only' as DocumentVisibility
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user || !profile) {
      alert('Vui lòng chọn file và đảm bảo bạn đã đăng nhập.');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload file (using generic upload method)
      const fileUrl = await storageService.uploadDocument(formData.code, 'v1.0', file);

      // 2. Prepare metadata
      const docData: Omit<ISODocument, 'id' | 'created_at' | 'updated_at'> = {
        ...formData,
        status: 'draft' as DocumentStatus,
        published_date: new Date().toISOString().split('T')[0],
        effective_date: new Date().toISOString().split('T')[0],
      };

      const versionData = {
        version_number: 'v1.0',
        file_url: fileUrl,
        change_log: 'Khởi tạo tài liệu mới.',
        uploader_name: profile.full_name || 'Hệ thống'
      };

      // 3. Atomic creation
      await documentService.createDocumentWithVersion(
        docData, 
        versionData, 
        user.id, 
        profile.full_name || 'User'
      );
      
      onSuccess();
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Có lỗi xảy ra khi tạo tài liệu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="iso-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Mã tài liệu</label>
          <input 
            type="text" 
            placeholder="VD: QT-CL-01" 
            value={formData.code}
            onChange={e => setFormData({...formData, code: e.target.value})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Loại tài liệu</label>
          <select 
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value as DocumentType})}
          >
            <option value="QT">QT - Quy trình</option>
            <option value="HS">HS - Hồ sơ</option>
            <option value="BM">BM - Biểu mẫu</option>
            <option value="HDCV">HDCV - Hướng dẫn công việc</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Tên tài liệu</label>
        <input 
          type="text" 
          placeholder="Tên đầy đủ của tài liệu" 
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
          required 
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Người xem xét (Reviewer)</label>
          <input 
            type="text" 
            value={formData.reviewer}
            onChange={e => setFormData({...formData, reviewer: e.target.value})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Người phê duyệt (Approver)</label>
          <input 
            type="text" 
            value={formData.approver}
            onChange={e => setFormData({...formData, approver: e.target.value})}
            required 
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Ngày rà soát định kỳ</label>
          <input 
            type="date" 
            value={formData.next_review_date}
            onChange={e => setFormData({...formData, next_review_date: e.target.value})}
            required 
          />
        </div>
        <div className="form-group">
          <label><Shield size={14} /> Phạm vi hiển thị</label>
          <select 
            value={formData.visibility}
            onChange={e => setFormData({...formData, visibility: e.target.value as DocumentVisibility})}
          >
            <option value="department_only">Chỉ trong phòng ban ({profile?.department})</option>
            <option value="company_wide">Toàn công ty (Public)</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>File tài liệu (PDF/Word)</label>
        <div className={`file-upload-zone ${file ? 'has-file' : ''}`}>
          <input 
            type="file" 
            onChange={e => setFile(e.target.files?.[0] || null)} 
            id="file-input"
            hidden
          />
          <label htmlFor="file-input" className="upload-label">
            {file ? (
              <><CheckCircle2 size={24} /> <span>{file.name}</span></>
            ) : (
              <><Upload size={24} /> <span>Nhấn để chọn file hoặc kéo thả vào đây</span></>
            )}
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Tạo tài liệu'}
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;
