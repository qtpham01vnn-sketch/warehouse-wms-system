import React, { useState } from 'react';
import { Upload, CheckCircle2, Shield } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { ISO_DEPARTMENTS } from '../../services/dashboardService';
import type { DocumentType, DocumentStatus } from '../../types';
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
    name: '' as string,
    type: 'QT' as DocumentType,
    departmentid: profile?.departmentid || '',
    ownername: profile?.full_name || '',
    reviewer: '',
    approver: '',
    nextreviewdate: '',
    access_scope: 'department_only' as 'department_only' | 'company_wide'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user || !profile) {
      alert('Vui lòng chọn file và đảm bảo bạn đã đăng nhập.');
      return;
    }

    setLoading(true);
    console.log('--- Starting Document Creation ---');
    try {
      // 1. Upload file
      console.log('Uploading file to storage...');
      const fileUrl = await storageService.uploadDocument(formData.code, 'v1.0', file);
      console.log('File uploaded successfully:', fileUrl);

      // 2. Prepare metadata
      const docData: any = {
        ...formData,
        status: 'draft' as DocumentStatus,
      };

      const versionData = {
        version_number: 'v1.0',
        file_url: fileUrl,
        change_log: 'Khởi tạo tài liệu mới.',
        uploader_name: profile.full_name || 'Hệ thống'
      };

      // 3. Document creation
      console.log('Inserting document records...');
      await documentService.createDocumentWithVersion(
        docData,
        versionData,
        user.id,
        profile.full_name || 'User'
      );
      console.log('Document created successfully!');

      onSuccess();
    } catch (error: any) {
      console.error('CRITICAL ERROR during document creation:', error);
      const errorMsg = error.message || (typeof error === 'string' ? error : 'Lỗi không xác định');
      alert(`Có lỗi xảy ra khi tạo tài liệu: ${errorMsg}. Vui lòng kiểm tra Console để biết chi tiết.`);
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
            onChange={e => setFormData({ ...formData, code: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Loại tài liệu</label>
          <select
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as DocumentType })}
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
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Phòng ban sở tại</label>
          <select 
            value={formData.departmentid}
            onChange={e => setFormData({ ...formData, departmentid: e.target.value })}
            required
          >
            <option value="">-- Chọn phòng ban --</option>
            {ISO_DEPARTMENTS.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Người soạn thảo</label>
          <input
            type="text"
            value={formData.ownername}
            onChange={e => setFormData({ ...formData, ownername: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Người xem xét (Reviewer)</label>
          <input
            type="text"
            value={formData.reviewer}
            onChange={e => setFormData({ ...formData, reviewer: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Người phê duyệt (Approver)</label>
          <input
            type="text"
            value={formData.approver}
            onChange={e => setFormData({ ...formData, approver: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Ngày rà soát định kỳ</label>
          <input
            type="date"
            value={formData.nextreviewdate}
            onChange={e => setFormData({ ...formData, nextreviewdate: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label><Shield size={14} /> Phạm vi hiển thị</label>
          <select
            value={formData.access_scope}
            onChange={e => setFormData({ ...formData, access_scope: e.target.value as any })}
          >
            <option value="department_only">Chỉ trong phòng ban</option>
            <option value="company_wide">Toàn công ty (Công khai)</option>
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
