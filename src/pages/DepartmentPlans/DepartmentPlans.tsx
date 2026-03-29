import React, { useState, useMemo, useRef } from 'react';
import { planService } from '../../services/planService';
import { approvalService } from '../../services/approvalService';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge } from '../../components/shared/StatusBadge';
import type { DepartmentPlan, PlanTask, CompanyPlan, ApprovalAction } from '../../types';
import { FileText, Send, Plus, ListTodo, Trash2, Calendar, Download, AlertTriangle, Clock, Upload, Briefcase, User, Target } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { storageService } from '../../services/storageService';
import './DepartmentPlans.css';
const DepartmentPlans: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Since we don't have a real DB, we memoize local state and just trigger re-renders
  const [refreshKey, setRefreshKey] = useState(0);
  const companyPlans = useMemo(() => planService.getCompanyPlans(), [refreshKey]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const revisionFileInputRef = useRef<HTMLInputElement>(null);
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    companyPlanId: '',
    goals: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    budget: 0,
    files: [] as { name: string; size: number }[]
  });

  const plans = useMemo(() => {
    const all = planService.getDepartmentPlans();
    // In real app, filter by user's department. Here currentUser.departmentId could be used.
    if (currentUser?.role === 'staff' || currentUser?.role === 'manager') {
      return all.filter(p => p.departmentId === currentUser.departmentId);
    }
    return all;
  }, [currentUser, refreshKey]);

  const [selectedPlan, setSelectedPlan] = useState<DepartmentPlan | null>(null);

  // Task Modal state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    assigneeId: '',
    deadline: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    weight: 10
  });

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
      console.error('Direct download failed:', err);
      window.open(url, '_blank');
    }
  };

  const handleAddTask = () => {
    if (!selectedPlan || !taskForm.title) return;
    
    // Create new task
    const newTask: PlanTask = {
      id: `task_${Date.now()}`,
      planId: selectedPlan.id,
      title: taskForm.title,
      assigneeId: taskForm.assigneeId,
      deadline: taskForm.deadline,
      priority: 'medium',
      status: 'not_started',
      progress: 0,
      weight: taskForm.weight,
      notes: '',
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update the local plan object
    const updatedPlan = {
      ...selectedPlan,
      tasks: [...(selectedPlan.tasks || []), newTask]
    };
    
    setSelectedPlan(updatedPlan);
    
    // In a real app with DB, we'd wait for API response here:
    planService.saveDepartmentPlan(updatedPlan);
    setRefreshKey(k => k + 1);
    
    // Reset and close
    setShowTaskModal(false);
    setTaskForm({ title: '', assigneeId: '', deadline: format(addDays(new Date(), 7), 'yyyy-MM-dd'), weight: 10 });
  };

  const handleSubmitApproval = (planId: string) => {
    if (!currentUser) return;
    const isRevision = selectedPlan?.status === 'revision';
    approvalService.submitForApproval(planId, currentUser.id, isRevision ? 'Gửi lại sau khi sửa đổi' : 'Xin phê duyệt kế hoạch tháng này');
    setRefreshKey(k => k + 1);
    setSelectedPlan(null);
  };

  const handleAddAttachments = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedPlan) return;
    const filesArray = Array.from(e.target.files);
    try {
      setIsAddingAttachment(true);
      const uploadedAttachments = [];
      for (const file of filesArray) {
        const result = await storageService.uploadFile(file);
        uploadedAttachments.push({
          id: result.id,
          name: result.name,
          size: result.size,
          url: result.url,
          type: result.type,
          path: result.path
        });
      }
      const updatedPlan = {
        ...selectedPlan,
        attachments: [...(selectedPlan.attachments || []), ...uploadedAttachments]
      };
      planService.saveDepartmentPlan(updatedPlan);
      setSelectedPlan(updatedPlan);
      setRefreshKey(k => k + 1);
    } catch (error) {
      alert('Lỗi khi tải file: ' + (error as Error).message);
    } finally {
      setIsAddingAttachment(false);
    }
  };

  // Get approval history for selected plan
  const approvalHistory = useMemo(() => {
    if (!selectedPlan) return [];
    return approvalService.getActionsByPlan(selectedPlan.id);
  }, [selectedPlan, refreshKey]);

  const handleCreatePlan = async () => {
    if (!currentUser || !formData.title || !formData.companyPlanId) return;

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
          path: result.path
        });
      }

      // 2. Create the plan object
      const newPlan: DepartmentPlan = {
        id: `dp_${Date.now()}`,
        companyPlanId: formData.companyPlanId,
        departmentId: currentUser.departmentId,
        title: formData.title,
        description: formData.goals,
        goals: formData.goals,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        tasks: [],
        status: 'draft',
        versions: [],
        currentVersion: 'v1.0',
        attachments: uploadedAttachments,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      planService.saveDepartmentPlan(newPlan);
      setRefreshKey((k: number) => k + 1);
      setShowCreateModal(false);
      setFormData({
        title: '',
        companyPlanId: '',
        goals: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        budget: 0,
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

  const handleDeletePlan = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa kế hoạch phòng ban này?')) {
      planService.deleteDepartmentPlan(id);
      setRefreshKey((k: number) => k + 1);
    }
  };


  return (
    <div className="dept-plans-page animate-fade-in relative h-full flex flex-col">
      <div className="page-header flex-between mb-8">
        <div>
          <h1 className="page-title text-gradient flex items-center gap-3">
             <Briefcase className="text-secondary icon-glow"/> 
             Kế hoạch Phòng ban (Department Plans)
          </h1>
          <p className="text-muted mt-2">Lập kế hoạch phân bổ WBS, trình duyệt và bám sát tiến độ phòng ban.</p>
        </div>
        <div className="actions flex gap-3">
          <button className="btn btn-primary shadow-glow flex items-center gap-2 rounded-xl px-6" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} /> Phác thảo Kế hoạch mới
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-6">
        {plans.length === 0 ? (
           <div className="flex-center h-full text-muted flex-col gap-4">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex-center border border-white/10"><Briefcase size={32} className="opacity-50"/></div>
              <p>Chưa có Kế hoạch Phòng ban nào được lập.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {plans.map((plan: DepartmentPlan) => (
                 <div key={plan.id} className="glass-panel p-6 rounded-[24px] border border-white/5 hover:border-secondary/40 transition-all cursor-pointer group flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_32px_rgba(236,72,153,0.15)] hover:-translate-y-1 relative overflow-hidden" onClick={() => setSelectedPlan(plan)}>
                    
                    {/* Revision Alert background glow */}
                    {plan.status === 'revision' && (
                       <div className="absolute top-0 right-0 w-32 h-32 bg-warning/20 rounded-full blur-[50px] animate-pulse pointer-events-none"></div>
                    )}

                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-5 relative z-10">
                       <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-[20px] flex-center border shadow-inner transition-transform group-hover:scale-105 ${plan.status === 'revision' ? 'bg-warning/10 border-warning/30 text-warning' : 'bg-secondary/10 border-secondary/20 text-secondary'}`}>
                             {plan.status === 'revision' ? <AlertTriangle size={28}/> : <Briefcase size={28}/>}
                          </div>
                          <div>
                             <h3 className="font-bold text-white text-lg truncate max-w-[180px] tracking-wide" title={plan.title}>{plan.title}</h3>
                             <p className="text-[11px] uppercase tracking-widest text-muted mt-1 font-semibold flex items-center gap-1.5"><Calendar size={12}/> Hạn: {format(new Date(plan.endDate || plan.updatedAt), 'dd/MM/yyyy')}</p>
                          </div>
                       </div>
                    </div>
                    
                    {/* Content */}
                    <div className="mb-6 flex-1 relative z-10">
                       <div className="flex items-center gap-4 mb-3 text-sm">
                          <div className="flex gap-1.5 items-center text-muted"><ListTodo size={14} className="text-primary"/> {plan.tasks?.length || 0} Tasks</div>
                          <div className="flex gap-1.5 items-center text-muted"><FileText size={14} className="text-success"/> {plan.attachments?.length || 0} Files</div>
                       </div>
                       <p className="text-sm text-muted line-clamp-2 leading-relaxed">{plan.goals}</p>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex justify-between items-center pt-5 border-t border-white/10 relative z-10">
                       <div className="flex items-center gap-2">
                          <StatusBadge status={plan.status} />
                       </div>
                       <div className="flex gap-2">
                          {(plan.status === 'draft' || plan.status === 'revision') && (
                            <button 
                              className="btn btn-sm bg-primary/20 text-primary hover:bg-primary border-none rounded-xl"
                              onClick={(e) => { e.stopPropagation(); handleSubmitApproval(plan.id); }}
                              title={plan.status === 'revision' ? 'Gửi lại' : 'Trình duyệt'}
                            >
                              <Send size={16} />
                            </button>
                          )}
                          <button className="btn btn-sm w-10 h-10 flex-center bg-error/10 text-error hover:bg-error/20 border-none rounded-xl transition-all" onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }} title="Xóa Kế hoạch">
                             <Trash2 size={16}/>
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay fixed inset-0 z-50 flex-center bg-black/80 backdrop-blur-md" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content glass-panel p-8 max-w-2xl w-full animate-slide-up border-primary/20 rounded-[24px]" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-gradient">Phác thảo Kế hoạch Phòng (Draft)</h3>
              <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex-center text-muted border border-white/10 transition-colors" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="form-group">
                <label className="text-xs font-bold text-muted uppercase block mb-2 text-primary">Map với Căn cứ Kế hoạch Tổng *</label>
                <select 
                  className="w-full bg-primary/5 border border-primary/30 text-primary font-bold rounded-xl p-3 text-sm focus:border-primary outline-none transition-all appearance-none"
                  value={formData.companyPlanId}
                  onChange={(e) => setFormData({...formData, companyPlanId: e.target.value})}
                >
                  <option value="" className="bg-[#1e1e2d] text-muted">-- Liên kết với Mũi nhọn cấp trên --</option>
                  {companyPlans.map((cp: CompanyPlan) => (
                    <option key={cp.id} value={cp.id} className="bg-[#1e1e2d] text-white">[{cp.id.slice(-4)}] - {cp.title}</option>
                  ))}
                </select>
                {companyPlans.length === 0 && <p className="text-xs text-error mt-1 italic">* Không tìm thấy Master Plan nào.</p>}
              </div>

              <div className="form-group">
                <label className="text-xs font-bold text-muted uppercase block mb-2">Tên Chiến dịch/Kế hoạch Nội bộ *</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all" 
                  placeholder="Ví dụ: Triển khai Marketing Q2..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="text-xs font-bold text-muted uppercase block mb-2">Mục tiêu & Đo lường (OKR/KPIs)</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all min-h-[80px]" 
                  placeholder="Định lượng các chỉ số cần đạt được..."
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="text-xs font-bold text-muted uppercase block mb-2">Từ ngày (Start)</label>
                  <input 
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="text-xs font-bold text-muted uppercase block mb-2">Đến ngày (End)</label>
                  <input 
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="text-xs font-bold text-muted uppercase block mb-2 flex items-center gap-2">Ngân sách dự chi <span className="text-warning bg-warning/10 px-2 py-0.5 rounded text-[10px]">VNĐ</span></label>
                <input 
                  type="number" 
                  className="w-full bg-warning/5 border border-warning/20 rounded-xl p-3 text-sm text-warning font-bold focus:border-warning outline-none transition-all placeholder:text-warning/30"
                  placeholder="0"
                  value={formData.budget || ''}
                  onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                />
              </div>

              <div className="form-group">
                <label className="text-xs font-bold text-muted uppercase block mb-2">Tài liệu Thuyết minh bổ sung</label>
                <input type="file" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                <div className="py-4 border-2 border-dashed border-white/20 bg-white/5 rounded-2xl text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group" onClick={() => fileInputRef.current?.click()}>
                   <Upload size={24} className="mx-auto mb-2 text-muted group-hover:text-primary transition-colors"/>
                   <p className="text-sm font-bold text-white mb-1">Upload Phụ lục đính kèm</p>
                   {formData.files.length > 0 && (
                     <div className="mt-3 flex flex-wrap gap-2 justify-center px-4">
                        {formData.files.map((f, idx) => (
                           <span key={idx} className="bg-primary/20 text-primary px-2 py-1 rounded text-[10px] font-bold">
                              {f.name} ({(f.size/1024).toFixed(0)}KB)
                           </span>
                        ))}
                     </div>
                   )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-5 border-t border-white/5 flex justify-end gap-3">
              <button className="btn bg-white/5 hover:bg-white/10 text-white rounded-xl px-6" onClick={() => setShowCreateModal(false)} disabled={isUploading}>Hủy Lệnh</button>
              <button 
                className="btn btn-primary shadow-glow rounded-xl px-8" 
                onClick={handleCreatePlan}
                disabled={!formData.title || !formData.companyPlanId || isUploading}
              >
                {isUploading ? 'Đang mã hóa...' : 'Tạo Bản nháp (Draft)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPlan(null)}>
          <div className="w-full max-w-2xl h-full bg-[#161625]/95 border-l border-white/10 transform transition-transform animate-slide-left flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
            
            <div className="p-8 border-b border-white/5 flex justify-between items-start bg-gradient-to-br from-secondary/10 to-transparent">
               <div>
                  <h2 className="text-2xl font-bold mb-3 text-white tracking-wide leading-tight">{selectedPlan.title}</h2>
                  <div className="flex items-center gap-3">
                     <StatusBadge status={selectedPlan.status} />
                     <span className="text-[10px] text-muted uppercase tracking-widest bg-white/5 px-2 py-1 flex items-center gap-1 rounded"><Target size={10}/> Map ID: {selectedPlan.companyPlanId.slice(-6)}</span>
                  </div>
               </div>
               <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex-center text-muted border border-white/10 transition-colors shrink-0" onClick={() => setSelectedPlan(null)}>✕</button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
              
              {/* Revision Warning Banner */}
              {selectedPlan.status === 'revision' && selectedPlan.rejectionReason && (
                <div className="p-5 rounded-2xl mb-8 bg-warning/10 border border-warning/30 shadow-[0_0_20px_rgba(245,158,11,0.1)] flex gap-4 animate-pulse">
                   <div className="w-10 h-10 rounded-full bg-warning/20 flex-center text-warning shrink-0"><AlertTriangle size={20}/></div>
                   <div>
                     <h4 className="font-bold text-warning mb-1">Cảnh báo: Sếp yêu cầu sửa lại Tờ trình</h4>
                     <p className="text-sm text-warning/90 whitespace-pre-wrap">{selectedPlan.rejectionReason}</p>
                     <p className="text-xs text-muted mt-2 italic">* Vui lòng update WBS/Tài liệu bên dưới và Trình duyệt lại.</p>
                   </div>
                </div>
              )}

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Bắt đầu</p>
                  <p className="font-bold text-white">{format(new Date(selectedPlan.startDate || selectedPlan.createdAt), 'dd/MM/yyyy')}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Chốt sổ</p>
                  <p className="font-bold text-error">{format(new Date(selectedPlan.endDate || selectedPlan.updatedAt), 'dd/MM/yyyy')}</p>
                </div>
                <div className="bg-warning/5 p-4 rounded-2xl border border-warning/20">
                  <p className="text-[10px] font-bold text-warning uppercase tracking-widest mb-1">Dự toán NS</p>
                  <p className="font-bold text-warning">{selectedPlan.budget?.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>

              {/* Goals */}
              <div className="mb-8">
                 <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Mục tiêu thiết lập (OKR)</h4>
                 <p className="text-sm text-muted leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{selectedPlan.goals}</p>
              </div>

              {/* WBS Tasks */}
              <div className="mb-8">
                 <div className="flex-between mb-4">
                   <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2"><ListTodo size={14}/> Phân rã WBS (Work Breakdown)</h4>
                   {(selectedPlan.status === 'draft' || selectedPlan.status === 'revision') && (
                     <button className="btn btn-sm bg-primary/20 hover:bg-primary/40 text-primary border-none rounded-lg text-xs flex items-center gap-1 px-3" onClick={() => setShowTaskModal(true)}>
                       <Plus size={12}/> Thêm Task
                     </button>
                   )}
                 </div>

                 <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-[#161625] text-muted border-b border-white/5">
                       <tr>
                         <th className="p-4 font-bold text-[10px] uppercase">Hạng mục</th>
                         <th className="p-4 font-bold text-[10px] uppercase text-center">Assignee</th>
                         <th className="p-4 font-bold text-[10px] uppercase text-center">DL / Trọng số</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                       {selectedPlan.tasks?.map((task: PlanTask, idx: number) => (
                         <tr key={task.id} className="hover:bg-white/5 transition-colors">
                           <td className="p-4">
                             <div className="font-bold text-white text-sm mb-1">{idx + 1}. {task.title}</div>
                             <StatusBadge status={task.status} />
                           </td>
                           <td className="p-4 text-center">
                              <span className="bg-white/10 text-muted px-2 py-1 rounded text-xs flex items-center justify-center gap-1 mx-auto w-max"><User size={10}/> {task.assigneeId.toUpperCase()}</span>
                           </td>
                           <td className="p-4 text-center text-xs">
                              <div className="text-error font-medium mb-1">{format(new Date(task.deadline), 'dd/MM/yy')}</div>
                              <div className="text-success font-bold">{task.weight}%</div>
                           </td>
                         </tr>
                       ))}
                       {(!selectedPlan.tasks || selectedPlan.tasks.length === 0) && (
                         <tr><td colSpan={3} className="p-8 text-center text-muted italic text-sm">Chưa băm nhỏ công việc.</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
              </div>

              {/* Attachments */}
              <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex-between mb-4">
                  <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2"><FileText size={14}/> Căn cứ & Hồ sơ</h4>
                  {(selectedPlan.status === 'draft' || selectedPlan.status === 'revision') && (
                    <>
                      <input type="file" multiple ref={revisionFileInputRef} style={{ display: 'none' }} onChange={handleAddAttachments} />
                      <button className="text-primary hover:text-white text-xs font-bold underline transition-colors" onClick={() => revisionFileInputRef.current?.click()} disabled={isAddingAttachment}>
                        {isAddingAttachment ? 'Đang Upload...' : '+ Upload Thêm'}
                      </button>
                    </>
                  )}
                </div>
                {(!selectedPlan.attachments || selectedPlan.attachments.length === 0) ? (
                  <p className="text-xs text-muted">Hồ sơ trống.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedPlan.attachments.map(file => (
                      <div key={file.id} className="flex-between p-3 bg-black/40 rounded-xl border border-white/5 group">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-primary"/>
                          <div>
                            <p className="text-xs font-bold text-white">{file.name}</p>
                            <p className="text-[10px] text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button onClick={(e) => handleDownload(e, file.url, file.name)} className="text-muted hover:text-success transition-colors" title="Download"><Download size={14}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Approval History Timeline */}
              {approvalHistory.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-info uppercase tracking-widest mb-4 flex items-center gap-2"><Clock size={14}/> Lịch trình Trạng thái</h4>
                  <div className="space-y-0 pl-2 border-l border-white/10 ml-2">
                    {approvalHistory.map((act: ApprovalAction) => (
                      <div key={act.id} className="relative pl-6 pb-6 last:pb-0">
                        <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ring-4 ring-[#161625] ${act.action === 'approve' ? 'bg-success' : act.action === 'reject' ? 'bg-error' : act.action === 'request_revision' ? 'bg-warning' : 'bg-primary shadow-[0_0_10px_var(--color-primary)]'}`}></div>
                        <div className="flex-between mb-1">
                          <strong className="text-xs uppercase flex items-center gap-2">
                            {act.action === 'submit' && <span className="text-primary">📤 Trình duyệt</span>}
                            {act.action === 'approve' && <span className="text-success">✅ Sếp đã Duyệt</span>}
                            {act.action === 'reject' && <span className="text-error">❌ Bác bỏ</span>}
                            {act.action === 'request_revision' && <span className="text-warning">🔄 Yêu cầu sửa</span>}
                          </strong>
                          <span className="text-[10px] text-muted font-mono">{format(new Date(act.performedAt), 'dd/MM/yyyy HH:mm')}</span>
                        </div>
                        <p className="text-sm text-muted bg-white/5 p-3 rounded-lg border border-white/5 mt-2">{act.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-[#161625] flex justify-end gap-3">
               <button className="btn bg-white/5 hover:bg-white/10 text-white rounded-xl px-6" onClick={() => setSelectedPlan(null)}>Đóng Panel</button>
               {(selectedPlan.status === 'draft' || selectedPlan.status === 'revision') && (
                  <button className="btn btn-primary shadow-glow rounded-xl px-6 flex items-center gap-2" onClick={() => handleSubmitApproval(selectedPlan.id)}>
                    <Send size={16}/> {selectedPlan.status === 'revision' ? 'Bắn Trình duyệt lại (Resend)' : 'Bắn Trình duyệt (Submit)'}
                  </button>
               )}
            </div>

            {/* Task Addition Modal */}
            {showTaskModal && (
              <div className="modal-overlay fixed inset-0 z-[100] flex-center bg-black/50 backdrop-blur-sm" onClick={() => setShowTaskModal(false)}>
                <div className="modal-content glass-panel p-6 max-w-md w-full animate-slide-up border-primary/20 rounded-2xl" onClick={e => e.stopPropagation()}>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><Plus size={16} className="text-primary"/> Bổ sung Công việc con</h3>
                  <div className="space-y-4">
                    <div className="form-group">
                      <label className="text-xs font-bold text-muted uppercase block mb-1">Tên Hạng mục</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:border-primary outline-none" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})}/>
                    </div>
                    <div className="form-group">
                       <label className="text-xs font-bold text-muted uppercase block mb-1">Mã NV phụ trách (Kép/Đơn)</label>
                       <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:border-primary outline-none" value={taskForm.assigneeId} onChange={e => setTaskForm({...taskForm, assigneeId: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="form-group">
                          <label className="text-xs font-bold text-muted uppercase block mb-1">Chốt khối lượng (Deadline)</label>
                          <input type="date" className="w-full bg-error/5 border border-error/20 rounded-xl p-2.5 text-sm text-error focus:border-error outline-none" value={taskForm.deadline} onChange={e => setTaskForm({...taskForm, deadline: e.target.value})}/>
                       </div>
                       <div className="form-group">
                          <label className="text-xs font-bold text-muted uppercase block mb-1">Tỉ trọng Kế hoạch</label>
                          <div className="relative">
                            <input type="number" min="0" max="100" className="w-full bg-success/5 border border-success/20 rounded-xl p-2.5 text-sm font-bold text-success focus:border-success outline-none pl-4 pr-8" value={taskForm.weight} onChange={e => setTaskForm({...taskForm, weight: Number(e.target.value)})}/>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success">%</span>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button className="btn bg-white/5 hover:bg-white/10 rounded-lg px-4" onClick={() => setShowTaskModal(false)}>Hủy</button>
                    <button className="btn btn-primary shadow-glow rounded-lg px-6" onClick={handleAddTask} disabled={!taskForm.title}>Ép vào WBS</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentPlans;
