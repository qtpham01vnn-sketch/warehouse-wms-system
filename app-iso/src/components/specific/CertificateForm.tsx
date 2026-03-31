import React, { useState } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';
import { certificateService } from '../../services/certificateService';
import { storageService } from '../../services/storageService';
import type { ISOCertificate } from '../../types';
import './Form.css';

interface CertificateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    standard: '',
    cert_number: '',
    issuer: '',
    issued_date: '',
    expiry_date: '',
    status: 'Active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Vui lòng tải lên file chứng nhận!');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload file
      const fileUrl = await storageService.uploadCertificate(formData.cert_number || Date.now().toString(), file);

      // 2. Save metadata
      const certData: Omit<ISOCertificate, 'id' | 'created_at'> = {
        ...formData,
        file_url: fileUrl
      };

      await certificateService.addCertificate(certData);
      onSuccess();
    } catch (error) {
      console.error('Error adding certificate:', error);
      alert('Có lỗi xảy ra khi lưu chứng nhận.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="iso-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Tên chứng nhận *</label>
          <input 
            type="text" 
            required 
            placeholder="VD: ISO 9001:2015"
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label>Tiêu chuẩn</label>
          <input 
            type="text" 
            placeholder="VD: Quality Management Systems"
            value={formData.standard} 
            onChange={e => setFormData({...formData, standard: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label>Số chứng nhận</label>
          <input 
            type="text" 
            required 
            placeholder="VD: CERT-123456"
            value={formData.cert_number} 
            onChange={e => setFormData({...formData, cert_number: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label>Tổ chức cấp</label>
          <input 
            type="text" 
            required 
            placeholder="VD: BSI, SGS, vv."
            value={formData.issuer} 
            onChange={e => setFormData({...formData, issuer: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label>Ngày cấp</label>
          <input type="date" required value={formData.issued_date} onChange={e => setFormData({...formData, issued_date: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Ngày hết hạn</label>
          <input type="date" required value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Trạng thái</label>
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option value="Active">Hiệu lực (Active)</option>
            <option value="Expiring">Sắp hết hạn</option>
            <option value="Expired">Hết hiệu lực</option>
          </select>
        </div>
      </div>

      <div className="file-upload-zone">
        <input 
          type="file" 
          id="cert-upload" 
          accept=".pdf,.jpg,.png"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
        <label htmlFor="cert-upload" className="upload-label">
          {file ? (
            <div className="file-selected">
              <CheckCircle2 color="var(--status-success)" />
              <span>{file.name}</span>
            </div>
          ) : (
            <>
              <Upload size={24} />
              <span>Tải lên file SCAN chứng nhận (PDF, Hình ảnh)</span>
            </>
          )}
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu chứng nhận'}
        </button>
      </div>
    </form>
  );
};

export default CertificateForm;
