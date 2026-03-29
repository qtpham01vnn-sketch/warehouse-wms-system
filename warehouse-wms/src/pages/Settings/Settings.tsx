import React from 'react';
import { Shield, Box, Database } from 'lucide-react';
import './Settings.css';

const Settings: React.FC = () => {
  return (
    <div className="settings-page animate-fade-in">
      <div className="page-header mb-8">
        <h1 className="page-title text-gradient">Cấu hình Hệ thống</h1>
        <p className="page-subtitle">Quản lý các thông số kỹ thuật, người dùng và kho bãi.</p>
      </div>

      <div className="grid-3">
        <div className="glass-card p-6 flex flex-col gap-4">
           <div className="icon-glow text-primary"><Shield size={24} /></div>
           <h3 className="text-white font-bold">Phân quyền</h3>
           <p className="text-muted text-sm">Quản lý nhân viên vận hành và quyền nhập xuất.</p>
           <button className="btn-text">Cấu hình</button>
        </div>
        <div className="glass-card p-6 flex flex-col gap-4">
           <div className="icon-glow text-success"><Database size={24} /></div>
           <h3 className="text-white font-bold">Dữ liệu Danh mục</h3>
           <p className="text-muted text-sm">Cập nhật kích thước, quy cách đóng gói hộp/m2.</p>
           <button className="btn-text">Cấu hình</button>
        </div>
        <div className="glass-card p-6 flex flex-col gap-4">
           <div className="icon-glow text-warning"><Box size={24} /></div>
           <h3 className="text-white font-bold">Kho bãi</h3>
           <p className="text-muted text-sm">Định nghĩa các dãy kệ và vị trí lưu kho.</p>
           <button className="btn-text">Cấu hình</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
