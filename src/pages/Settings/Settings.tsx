import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { User, Bell, Building2, Shield, Mail, Save, UserPlus, Trash2, AlertTriangle, Users } from 'lucide-react';
import type { Department } from '../../types';
import './Settings.css';

type TabType = 'profile' | 'organization' | 'roles' | 'notifications';

const Settings: React.FC = () => {
  const { currentUser, users } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchDeps = async () => {
      try {
        const data = await userService.getDepartments();
        if (isMounted) setDepartments(data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };
    fetchDeps();
    return () => { isMounted = false; };
  }, []);

  const renderProfileTab = () => (
    <div className="animate-fade-in w-full max-w-4xl">
      <div className="glass-panel p-8 rounded-[24px] border border-white/5 h-full relative">
        <h4 className="font-bold text-lg mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
           <User className="text-primary icon-glow"/> Hồ sơ Cá nhân (ID Card)
        </h4>
        
        <div className="flex flex-col md:flex-row gap-8 items-start mb-8 pb-8 border-b border-white/10">
           <div className="relative shrink-0">
             <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-[spin_4s_linear_infinite] shadow-[0_0_20px_var(--color-primary)]"></div>
             <img src={currentUser?.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-[#161625] relative z-10 p-1" />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-white tracking-wide">{currentUser?.name}</h2>
             <div className="flex gap-2 mt-2">
               <span className="text-primary uppercase text-[10px] font-bold tracking-widest bg-primary/10 px-2 py-1 rounded-sm border border-primary/20">
                 {currentUser?.role === 'director' ? 'Giám đốc' : currentUser?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
               </span>
               <span className="text-muted uppercase text-[10px] font-bold tracking-widest bg-white/5 px-2 py-1 rounded-sm border border-white/10">
                 ID: {currentUser?.id.substring(0,8)}
               </span>
             </div>
             <button className="btn mt-4 text-xs bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-1.5 rounded-lg transition-colors">Đổi mã định danh (Avatar)</button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="form-group">
             <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block">Họ và Tên</label>
             <input type="text" className="w-full bg-[#161625] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] outline-none transition-all font-medium" defaultValue={currentUser?.name} />
           </div>
           <div className="form-group">
             <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block flex items-center gap-1">Email liên hệ <span className="text-success ml-1 lowercase tracking-normal font-normal">*đã xác thực</span></label>
             <input type="email" className="w-full bg-[#161625] border border-success/30 rounded-xl p-3 text-sm text-white focus:border-success focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] outline-none transition-all font-medium" defaultValue={currentUser?.email} />
           </div>
           <div className="form-group">
             <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block">Chức danh / Role</label>
             <input type="text" className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm text-muted cursor-not-allowed uppercase tracking-wider" defaultValue={currentUser?.role} readOnly disabled />
           </div>
           <div className="form-group">
             <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block">Sở Chỉ Huy (Phòng ban)</label>
             <input type="text" className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm text-primary font-mono cursor-not-allowed uppercase" defaultValue={currentUser?.departmentId} readOnly disabled />
           </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end gap-3">
          <button className="btn bg-white/5 text-white border border-white/10 hover:bg-white/10 px-6 rounded-xl font-bold">Hủy</button>
          <button className="btn bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-primary/80 px-8 rounded-xl flex items-center gap-2 font-bold transition-all">
            <Save size={18}/> LƯU DỮ LIỆU CÁ NHÂN
          </button>
        </div>
      </div>
    </div>
  );

  const renderOrgTab = () => (
    <div className="animate-fade-in w-full">
      <div className="flex-between mb-6">
         <h3 className="section-title text-lg mb-0">Danh sách Phòng ban</h3>
         <button className="btn bg-primary/20 text-white hover:bg-primary border border-primary/50 shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all"><Building2 size={16}/> Thêm Phòng ban</button>
      </div>
      
      {/* Flat List Hybrid Lovable Design */}
      <div className="glass-panel overflow-hidden border border-white/10 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <table className="w-full text-left text-sm border-collapse">
           <thead>
             <tr className="bg-black/40 border-b border-white/10">
               <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px] w-1/3">Phòng ban</th>
               <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px]">Trưởng phòng</th>
               <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px] text-center">Biên chế (Nhân sự)</th>
               <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px] text-center">Thao tác</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
             {departments.map(dept => {
               const manager = users.find(u => u.id === dept.managerId);
               return (
                 <tr key={dept.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                   <td className="p-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-white/5 flex-center border border-white/10 group-hover:border-primary/50 group-hover:text-primary transition-all">
                         <Building2 size={18} />
                       </div>
                       <div>
                         <p className="font-bold text-white text-base group-hover:text-primary transition-colors">{dept.name}</p>
                         <p className="text-[10px] text-muted font-mono uppercase tracking-widest mt-0.5">ID: {dept.id}</p>
                       </div>
                     </div>
                   </td>
                   <td className="p-4">
                     {manager ? (
                       <div className="flex items-center gap-3">
                         <img src={manager.avatar} alt="manager" className="w-8 h-8 rounded-full border border-white/20"/>
                         <span className="font-medium text-white">{manager.name}</span>
                       </div>
                     ) : (
                       <span className="text-muted italic text-xs">Trống vị trí</span>
                     )}
                   </td>
                   <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center bg-success/10 text-success border border-success/30 w-8 h-8 rounded-full font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        {dept.memberIds.length}
                      </span>
                   </td>
                   <td className="p-4 text-center">
                     <div className="flex justify-center gap-2">
                        <button className="w-8 h-8 rounded-lg flex-center bg-white/5 border border-white/10 text-muted hover:text-white hover:bg-white/20 transition-all"><Users size={14}/></button>
                        <button className="w-8 h-8 rounded-lg flex-center bg-error/10 border border-error/20 text-error hover:text-white hover:bg-error transition-all"><Trash2 size={14}/></button>
                     </div>
                   </td>
                 </tr>
               )
             })}
           </tbody>
        </table>
      </div>
    </div>
  );

  const renderRolesTab = () => (
    <div className="animate-fade-in w-full">
      <div className="flex-between mb-6">
         <h3 className="section-title text-lg mb-0 inline-flex items-center gap-2"><Shield size={20} className="text-indigo icon-glow"/> Ma trận Trực quyền</h3>
      </div>
      
      <div className="glass-panel overflow-hidden border border-white/10 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <table className="w-full text-left text-sm border-collapse">
           <thead>
             <tr className="bg-black/40 border-b border-white/10">
               <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px]">Cấp bậc (Role Tier)</th>
               <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px] text-center">Tạo KH Tổng</th>
               <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px] text-center">Tạo KH Phòng</th>
               <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px] text-center">Duyệt Kế hoạch</th>
               <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px] text-center">Quản trị ISO</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
             <tr className="hover:bg-white/5 transition-colors group">
               <td className="p-4">
                 <p className="font-bold text-primary text-base">Director</p>
                 <p className="text-[10px] text-muted uppercase tracking-widest font-mono mt-0.5">Giám đốc Điều hành</p>
               </td>
               <td className="p-4 text-center"><div className="w-4 h-4 rounded-full bg-success mx-auto shadow-[0_0_12px_var(--color-success)] border border-success/50 group-hover:scale-125 transition-transform"></div></td>
               <td className="p-4 text-center"><div className="w-4 h-4 rounded-full bg-white/10 mx-auto border border-white/20"></div></td>
               <td className="p-4 text-center"><div className="w-4 h-4 rounded-full bg-success mx-auto shadow-[0_0_12px_var(--color-success)] border border-success/50 group-hover:scale-125 transition-transform"></div></td>
               <td className="p-4 text-center"><div className="w-4 h-4 rounded-full bg-success mx-auto shadow-[0_0_12px_var(--color-success)] border border-success/50 group-hover:scale-125 transition-transform"></div></td>
             </tr>
             <tr className="hover:bg-white/5 transition-colors group">
               <td className="p-4">
                 <p className="font-bold text-warning text-base">Manager</p>
                 <p className="text-[10px] text-muted uppercase tracking-widest font-mono mt-0.5">Trưởng phòng</p>
               </td>
               <td className="p-4 text-center"><div className="w-4 h-4 rounded-full bg-white/10 mx-auto border border-white/20"></div></td>
               <td className="p-4 text-center"><div className="w-4 h-4 rounded-full bg-warning mx-auto shadow-[0_0_12px_var(--color-warning)] border border-warning/50 group-hover:scale-125 transition-transform"></div></td>
               <td className="p-4 text-center"><div className="w-4 h-4 rounded-full bg-white/10 mx-auto border border-white/20"></div></td>
               <td className="p-4 text-center"><div className="w-4 h-4 rounded-full bg-warning mx-auto shadow-[0_0_12px_var(--color-warning)] border border-warning/50 group-hover:scale-125 transition-transform"></div></td>
             </tr>
             <tr className="hover:bg-white/5 transition-colors group">
               <td className="p-4">
                 <p className="font-bold text-white text-base">Staff</p>
                 <p className="text-[10px] text-muted uppercase tracking-widest font-mono mt-0.5">Chuyên viên</p>
               </td>
               <td className="p-4 text-center"><div className="w-4 h-4 rounded-full bg-white/10 mx-auto border border-white/20"></div></td>
               <td className="p-4 text-center"><div className="w-4 h-4 rounded-full bg-white/10 mx-auto border border-white/20"></div></td>
               <td className="p-4 text-center"><div className="w-4 h-4 rounded-full bg-white/10 mx-auto border border-white/20"></div></td>
               <td className="p-4 text-center"><div className="w-4 h-4 rounded-full bg-white/10 mx-auto border border-white/20"></div></td>
             </tr>
           </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="settings-page animate-fade-in h-full flex flex-col pt-2">
      <div className="page-header mb-8 pl-2">
        <h1 className="page-title text-gradient">Cài đặt Hệ thống</h1>
        <p className="text-muted mt-2 text-sm font-mono tracking-wide">Quản lý nhận diện cá nhân, tổ chức phòng ban và ủy quyền hệ thống (Lovable Hybrid Mode).</p>
      </div>

      {/* Lovable Horizontal Tab Navigation */}
      <div className="flex items-center gap-2 mb-8 pl-2 border-b border-white/10 pb-4">
         <button 
           className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all border ${activeTab === 'profile' ? 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-transparent text-muted border-transparent hover:text-white hover:bg-white/5'}`}
           onClick={() => setActiveTab('profile')}
         >
           👤 Hồ sơ cá nhân
         </button>
         <button 
           className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all border ${activeTab === 'organization' ? 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-transparent text-muted border-transparent hover:text-white hover:bg-white/5'}`}
           onClick={() => setActiveTab('organization')}
         >
           🏢 Sơ đồ Tổ chức
         </button>
         <button 
           className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all border ${activeTab === 'roles' ? 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-transparent text-muted border-transparent hover:text-white hover:bg-white/5'}`}
           onClick={() => setActiveTab('roles')}
         >
           🛡️ Ma trận Phân quyền
         </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 pr-4 pl-2 custom-scrollbar">
         {activeTab === 'profile' && renderProfileTab()}
         {activeTab === 'organization' && renderOrgTab()}
         {activeTab === 'roles' && renderRolesTab()}
      </div>
    </div>
  );
};

export default Settings;
