import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { planService } from '../../services/planService';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { FileText, Download, Trash2, Plus, Calendar, Filter, Activity, Clock, User } from 'lucide-react';
import type { CompanyPlan } from '../../types';
import './CompanyPlans.css';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { storageService } from '../../services/storageService';

const CompanyPlans: React.FC = () => {
  const location = useLocation();
  const [plans, setPlans] = useState<CompanyPlan[]>(() => planService.getCompanyPlans());
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('create') === 'true') {
      setShowUploadModal(true);
    }
  }, [location.search]);
  const [selectedPlan, setSelectedPlan] = useState<CompanyPlan | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium' as const,
    files: [] as { name: string; size: number }[] // Keep for UI display/mock fallback
  });

  const refreshPlans = () => {
    setPlans(planService.getCompanyPlans());
  };

  const handleCreatePlan = async () => {
    if (!formData.title) return;

    try {
      setIsUploading(true);
      
      // 1. Upload files to Supabase
      const uploadedAttachments = [];
      for (const file of selectedFiles) {
        const result = await storageService.uploadFile(file);
        uploadedAttachments.push({
          id: result.id,
          name: result.name,
          size: result.size,
          url: result.url,
          type: result.type,
          path: result.path // Store path for deletion
        });
      }

      // 2. Create the plan object
      const newPlan: CompanyPlan = {
        id: `cp_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        attachments: uploadedAttachments,
        createdBy: 'Director', // Mock
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      planService.saveCompanyPlan(newPlan);
      refreshPlans();
      setShowUploadModal(false);
      setFormData({
        title: '',
        description: '',
        deadline: format(new Date(), 'yyyy-MM-dd'),
        priority: 'medium',
        files: []
      });
      setSelectedFiles([]);
    } catch (error) {
      alert('Lỗi khi tải file lên Supabase: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...filesArray.map(f => ({ name: f.name, size: f.size }))]
      }));
    }
  };

  const handleDownload = async (e: React.MouseEvent, url: string, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Direct download failed, falling back to new tab:', err);
      window.open(url, '_blank');
    }
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa kế hoạch này?')) {
      planService.deleteCompanyPlan(id);
      refreshPlans();
    }
  };


  return (
    <div className="company-plans-page animate-fade-in relative h-full flex flex-col">
      <div className="page-header flex-between mb-8">
        <div>
          <h1 className="page-title text-gradient flex items-center gap-3">
             <Activity className="text-primary icon-glow"/> 
             Kế hoạch Tổng Công ty (Master Plans)
          </h1>
          <p className="text-muted mt-2">Quản lý và ban hành các chiến lược cấp cao phủ sóng toàn hệ thống phòng ban.</p>
        </div>
        <div className="actions flex gap-3">
          <button className="btn bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl flex items-center gap-2 px-5 transition-all">
            <Filter size={18} className="text-muted"/> Lọc Kế hoạch
          </button>
          <button className="btn btn-primary shadow-glow rounded-xl flex items-center gap-2 px-6" onClick={() => setShowUploadModal(true)}>
            <Plus size={18} /> Khởi tạo Kế hoạch mới
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-6">
        {plans.length === 0 ? (
           <div className="flex-center h-full text-muted flex-col gap-4">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex-center border border-white/10"><FileText size={32} className="opacity-50"/></div>
              <p>Chưa có Kế hoạch Tổng nào được ban hành.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {plans.map(plan => (
                 <div key={plan.id} className="glass-panel p-6 rounded-[24px] border border-white/5 hover:border-primary/40 transition-all cursor-pointer group flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.2)] hover:-translate-y-1 relative overflow-hidden" onClick={() => setSelectedPlan(plan)}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-colors pointer-events-none"></div>
                    
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-5 relative z-10">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-[20px] bg-primary/10 flex-center border border-primary/20 text-primary shadow-inner group-hover:scale-105 transition-transform"><FileText size={28}/></div>
                          <div>
                             <h3 className="font-bold text-white text-lg truncate max-w-[180px] tracking-wide" title={plan.title}>{plan.title}</h3>
                             <p className="text-[11px] uppercase tracking-widest text-primary mt-1 font-semibold flex items-center gap-1.5"><Clock size={12}/> Hạn: {format(new Date(plan.deadline), 'dd/MM/yyyy')}</p>
                          </div>
                       </div>
                    </div>
                    
                    {/* Content */}
                    <div className="mb-6 flex-1 relative z-10">
                       <p className="text-sm text-muted line-clamp-2 leading-relaxed">{plan.description || 'Không có mô tả chi tiết.'}</p>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex justify-between items-center pt-5 border-t border-white/10 relative z-10">
                       <div className="flex items-center gap-3">
                          <StatusBadge status={plan.status} />
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 text-muted">
                             <Download size={12} className="text-success"/> {plan.attachments.length} Phụ lục
                          </span>
                       </div>
                       <button className="btn btn-sm w-10 h-10 flex-center bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all" onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }} title="Xóa Kế hoạch">
                          <Trash2 size={16}/>
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>

      {showUploadModal && (
        <div className="modal-overlay fixed inset-0 z-50 flex-center bg-black/80 backdrop-blur-md" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content glass-panel p-8 max-w-2xl w-full animate-slide-up border-primary/20 rounded-[24px]" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-gradient">Khởi tạo Master Plan</h3>
              <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex-center text-muted border border-white/10 transition-colors" onClick={() => setShowUploadModal(false)}>✕</button>
            </div>
            
            <div className="space-y-5">
              <div className="form-group">
                <label className="text-xs font-bold text-muted uppercase block mb-2">Tên Kế hoạch Tổng (Master Plan)</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all" 
                  placeholder="Nhập tiêu đề chiến lược..." 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="text-xs font-bold text-muted uppercase block mb-2">Mô tả Tổng quan (Framework)</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all min-h-[100px]" 
                  placeholder="Mô tả mục tiêu OKR, KPI cốt lõi và các yêu cầu chung cho toàn bộ phòng ban..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="text-xs font-bold text-muted uppercase block mb-2">Ngày chốt sổ (Deadline)</label>
                  <input 
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-primary outline-none transition-all text-white" 
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="text-xs font-bold text-muted uppercase block mb-2">Mức độ Cấp cực (Priority)</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-primary outline-none transition-all appearance-none text-white"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                  >
                    <option value="medium" className="bg-[#1e1e2d]">Bình thường (Normal)</option>
                    <option value="high" className="bg-[#1e1e2d]">Cao (High)</option>
                    <option value="urgent" className="bg-[#1e1e2d]">Khẩn cấp (Urgent)</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="text-xs font-bold text-muted uppercase block mb-2">Tài liệu Căn cứ (Phụ lục, File định hướng)</label>
                <input 
                  type="file" 
                  multiple 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange}
                />
                <div 
                  className="py-6 border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl text-center cursor-pointer hover:border-primary/60 hover:bg-primary/10 transition-all group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText size={32} className={`mb-3 mx-auto transition-all ${isUploading ? 'animate-bounce text-primary' : 'text-primary/50 group-hover:scale-110'}`} />
                  <p className="text-sm font-bold text-white mb-1">Kéo thả Blueprint vào đây hoặc <span className="text-primary hover:underline">Duyệt File</span></p>
                  <p className="text-xs text-muted">Hỗ trợ PDF, DOCX, XLSX (Báo cáo nội bộ tối đa 20MB).</p>
                  
                  {formData.files.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-primary/20 space-y-2 max-w-sm mx-auto">
                      {formData.files.map((f, idx) => (
                        <div key={idx} className="text-xs text-white bg-white/5 py-1.5 px-3 rounded-lg border border-white/10 flex justify-between items-center">
                          <span className="truncate flex-1 text-left flex items-center gap-2"><FileText size={12} className="text-primary"/> {f.name}</span>
                          <span className="text-muted ml-2 shrink-0">{(f.size/1024).toFixed(0)} KB</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-white/5">
              <button className="btn bg-white/5 hover:bg-white/10 text-white rounded-xl px-6" onClick={() => setShowUploadModal(false)} disabled={isUploading}>Hủy Lệnh</button>
              <button 
                className="btn btn-primary shadow-glow rounded-xl px-8" 
                onClick={handleCreatePlan}
                disabled={!formData.title || isUploading}
              >
                {isUploading ? (
                   <span className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> 
                     Đang mã hóa & Tải lên...
                   </span>
                ) : 'Khởi chạy Kế hoạch (Deploy)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPlan(null)}>
          <div className="w-full max-w-lg h-full bg-[#161625]/95 border-l border-white/10 transform transition-transform animate-slide-left flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
            
            <div className="p-8 border-b border-white/5 flex justify-between items-start bg-gradient-to-br from-primary/10 to-transparent">
               <div>
                  <h2 className="text-2xl font-bold mb-3 text-white tracking-wide leading-tight">{selectedPlan.title}</h2>
                  <div className="flex items-center gap-3">
                     <StatusBadge status={selectedPlan.status} />
                     <span className="text-[10px] text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 flex items-center gap-1"><Clock size={10}/> Ban hành: {format(new Date(selectedPlan.createdAt), 'dd MMMM, vvvv', { locale: vi })}</span>
                  </div>
               </div>
               <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex-center text-muted border border-white/10 transition-colors shrink-0" onClick={() => setSelectedPlan(null)}>✕</button>
            </div>
             
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
               <div className="space-y-8">
                  {/* Scope */}
                  <div>
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><Activity size={12}/> Phạm vi & Yêu cầu Chiến lược</h4>
                    <p className="text-sm text-muted leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{selectedPlan.description}</p>
                  </div>
                  
                  {/* Timeline */}
                  <div className="flex gap-4">
                     <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Ngày phong tỏa rủi ro (Deadline)</h4>
                        <p className="text-base font-bold text-white flex items-center gap-2"><Calendar size={16} className="text-error"/> {format(new Date(selectedPlan.deadline), 'dd/MM/yyyy')}</p>
                     </div>
                     <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Người giao nhiệm vụ</h4>
                        <p className="text-base font-bold text-white flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-primary/20 flex-center border border-primary/30"><User size={10} className="text-primary"/></div> {selectedPlan.createdBy}</p>
                     </div>
                  </div>
                  
                  {/* Attachments */}
                  <div>
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><FileText size={12}/> Phụ lục & Biểu mẫu (Blueprints)</h4>
                    {selectedPlan.attachments.length === 0 ? (
                      <p className="text-sm text-muted italic bg-white/5 p-4 rounded-xl border border-white/5 text-center">Tài liệu rỗng. Vui lòng cập nhật bổ sung.</p>
                    ) : (
                      <ul className="space-y-3">
                        {selectedPlan.attachments.map(file => (
                          <li key={file.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex-center text-primary"><FileText size={18}/></div>
                              <div>
                                <p className="text-sm font-bold text-white w-48 truncate">{file.name}</p>
                                <p className="text-xs text-muted mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleDownload(e, file.url, file.name)}
                              className="btn w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 text-muted hover:text-primary transition-all flex-center"
                              title="Tải về Căn cứ"
                            >
                              <Download size={16}/>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
               </div>
            </div>
            
            <div className="p-6 border-t border-white/5 bg-[#161625] flex justify-end">
               <button className="btn btn-primary shadow-glow rounded-xl px-8 flex items-center gap-2">Phân bổ ngay cho Phòng Ban</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPlans;
