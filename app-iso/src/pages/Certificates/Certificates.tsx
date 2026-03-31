import React, { useState, useEffect } from 'react';
import { Plus, Search, Award, Download, Eye, Calendar, ShieldCheck } from 'lucide-react';
import { certificateService } from '../../services/certificateService';
import Modal from '../../components/shared/Modal';
import CertificateForm from '../../components/specific/CertificateForm';
import type { ISOCertificate } from '../../types';
import './Certificates.css';

const Certificates: React.FC = () => {
  const [certificates, setCertificates] = useState<ISOCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const data = await certificateService.getCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredCerts = certificates.filter(cert => 
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cert.standard?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <span className="badge badge-obsolete">Hết hạn</span>;
    if (diffDays < 30) return <span className="badge badge-urgent">Nguy hiểm</span>;
    if (diffDays < 60) return <span className="badge badge-warning">Cảnh báo</span>;
    return <span className="badge badge-active">Hiệu lực</span>;
  };

  return (
    <div className="certificates-page">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Quản lý Chứng nhận ISO</h1>
          <p className="subtitle">Theo dõi hiệu lực các chứng chỉ hệ thống và sản phẩm</p>
        </div>
        <button className="btn-primary hover-lift" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Thêm chứng nhận</span>
        </button>
      </header>

      <section className="controls-row glass-card">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm theo tên chứng nhận hoặc tiêu chuẩn..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <div className="certificates-grid">
        {loading ? (
          <div className="loading-state">Đang tải danh sách chứng nhận...</div>
        ) : filteredCerts.length > 0 ? (
          filteredCerts.map(cert => (
            <div key={cert.id} className="cert-card glass-card hover-lift">
              <div className="cert-card-header">
                <div className="cert-icon">
                  <Award size={24} />
                </div>
                <div className="cert-status">
                  {getStatusBadge(cert.expiry_date)}
                </div>
              </div>
              
              <div className="cert-card-body">
                <h3>{cert.name}</h3>
                <p className="cert-standard">{cert.standard}</p>
                
                <div className="cert-meta">
                  <div className="meta-item">
                    <ShieldCheck size={16} />
                    <span>Số: {cert.cert_number}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>Hết hạn: {cert.expiry_date}</span>
                  </div>
                </div>
              </div>

              <div className="cert-card-actions">
                <button 
                  className="btn-secondary btn-sm"
                  onClick={() => cert.file_url && certificateService.getCertificateActions(cert.file_url).view()}
                >
                  <Eye size={16} /> Xem
                </button>
                <button 
                  className="btn-primary btn-sm"
                  onClick={() => cert.file_url && certificateService.getCertificateActions(cert.file_url).download()}
                >
                  <Download size={16} /> Tải về
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state full-width">
            <p>Chưa có dữ liệu chứng nhận ISO.</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Đăng ký Chứng nhận ISO"
      >
        <CertificateForm 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchCertificates();
          }} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default Certificates;
