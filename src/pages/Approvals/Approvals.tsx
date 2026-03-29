import React, { useState, useMemo, useEffect } from 'react';
import { approvalService } from '../../services/approvalService';
import { planService } from '../../services/planService';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge } from '../../components/shared/StatusBadge';
import type { DepartmentPlan, ApprovalAction as ApprovalActionType } from '../../types';
import { CheckCircle, XCircle, RotateCcw, Eye, Clock, FileText, ListTodo, Calendar, Download, Target, DollarSign, ShieldCheck, Zap, AlertOctagon, History } from 'lucide-react';
import { format } from 'date-fns';
import './Approvals.css';

const Approvals: React.FC = () => {
  const { currentUser } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [allPlans, setAllPlans] = useState<DepartmentPlan[]>([]);

  useEffect(() => {
    setAllPlans(planService.getDepartmentPlans());
  }, [refreshKey]);

  const pendingPlans = useMemo(() => {
    return allPlans.filter(p => p.status === 'pending').sort((a,b) => new Date(b.submittedAt || '').getTime() - new Date(a.submittedAt || '').getTime());
  }, [allPlans]);

  const historyPlans = useMemo(() => {
    return allPlans.filter(p => ['approved', 'rejected', 'revision'].includes(p.status)).sort((a,b) => {
      const timeA = new Date(a.approvedAt || a.updatedAt || '').getTime();
      const timeB = new Date(b.approvedAt || b.updatedAt || '').getTime();
      return timeB - timeA;
    });
  }, [allPlans]);

  const [selectedPlan, setSelectedPlan] = useState<DepartmentPlan | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'revision' | null>(null);
  const [comment, setComment] = useState('');

  const handleAction = () => {
    if (!currentUser || !selectedPlan || !actionType) return;
    
    if (actionType === 'approve') {
      approvalService.approvePlan(selectedPlan.id, currentUser.id, comment || 'Đồng ý phê duyệt');
    } else if (actionType === 'reject') {
      approvalService.rejectPlan(selectedPlan.id, currentUser.id, comment || 'Từ chối phê duyệt');
    } else if (actionType === 'revision') {
      approvalService.requestRevision(selectedPlan.id, currentUser.id, comment || 'Yêu cầu làm lại');
    }
    
    setComment('');
    setActionType(null);
    setSelectedPlan(null);
    setRefreshKey(k => k + 1);
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
      console.error('Direct download failed:', err);
      window.open(url, '_blank');
    }
  };

  const renderPlanRow = (plan: DepartmentPlan, isPending: boolean) => (
    <div 
      key={plan.id} 
      className={`p-4 mb-3 rounded-[16px] border flex items-center justify-between cursor-pointer transition-all group ${isPending ? 'bg-warning/10 border-warning/30 hover:bg-warning/20 shadow-[0_4px_20px_rgba(245,158,11,0.1)]' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
      onClick={() => setSelectedPlan(plan)}
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
         <div className={`w-12 h-12 rounded-lg flex-center shrink-0 border ${isPending ? 'bg-warning/20 border-warning/40 text-warning group-hover:scale-110' : 'bg-white/5 border-white/10 text-muted'} transition-transform`}>
            {isPending ? <Clock size={20} className="animate-pulse" /> : <FileText size={20} />}
         </div>
         <div className="flex-1 min-w-0 pr-4">
            <h4 className={`font-bold text-base mb-1 truncate ${isPending ? 'text-white' : 'text-white/80 group-hover:text-white transition-colors'}`}>{plan.title}</h4>
            <div className="flex gap-4 text-xs font-mono">
               <span className="text-muted flex items-center gap-1">
                 <Target size={12}/> {plan.departmentId.toUpperCase()}
               </span>
               {isPending && plan.submittedAt && (
                 <span className="text-warning flex items-center gap-1">
                   <Clock size={12}/> Trình ký: {format(new Date(plan.submittedAt), 'yyyy-MM-dd')}
                 </span>
               )}
               {!isPending && (
                 <span className="text-muted flex items-center gap-1">
                   Lưu vết: {format(new Date(plan.approvedAt || plan.updatedAt || new Date()), 'yyyy-MM-dd')}
                 </span>
               )}
            </div>
         </div>
      </div>
      <div className="shrink-0 pl-4 border-l border-white/10">
         <StatusBadge status={plan.status} />
      </div>
    </div>
  );

  return (
    <div className="approvals-page animate-fade-in relative h-full flex flex-col pt-2">
      <div className="page-header mb-8 pl-2 pr-4 flex-between">
        <div>
          <h1 className="page-title text-gradient">Phê duyệt Kế hoạch (Hybrid Mode)</h1>
          <p className="text-muted mt-2 text-sm font-mono tracking-wide">Xem xét và phê duyệt kế hoạch từ cấp cơ sở.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pl-2 pr-4 pb-8">
        
        {/* Pending Section */}
        <div className="mb-8">
           <h3 className="text-sm font-bold text-warning uppercase tracking-widest mb-4 flex items-center gap-2">
             <Clock size={16} className="animate-pulse"/> 
             Chờ phê duyệt ({pendingPlans.length})
           </h3>
           <div className="space-y-3">
             {pendingPlans.length === 0 ? (
               <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                 <p className="text-muted text-sm italic font-mono">Không có tờ trình nào chờ xử lý.</p>
               </div>
             ) : (
               pendingPlans.map(p => renderPlanRow(p, true))
             )}
           </div>
        </div>

        {/* History Section */}
        <div>
           <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
             <History size={16}/> 
             Lịch sử phê duyệt
           </h3>
           <div className="space-y-3">
             {historyPlans.length === 0 ? (
               <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                 <p className="text-muted text-sm italic font-mono">Chưa có lịch sử xử lý.</p>
               </div>
             ) : (
               historyPlans.map(p => renderPlanRow(p, false))
             )}
           </div>
        </div>

      </div>

      {/* Detail Slide Panel (Preserved Vanguard Action UI) */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md" onClick={() => !actionType && setSelectedPlan(null)}>
          <div className="w-full max-w-3xl h-full bg-[#161625] border-l border-white/10 transform transition-transform animate-slide-left flex flex-col shadow-[-30px_0_100px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className={`p-8 border-b border-white/5 bg-gradient-to-br from-transparent relative overflow-hidden ${selectedPlan.status === 'pending' ? 'to-warning/10' : selectedPlan.status === 'approved' ? 'to-success/10' : 'to-error/10'}`}>
              <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[100px] rounded-full ${selectedPlan.status === 'pending' ? 'bg-warning/20' : selectedPlan.status === 'approved' ? 'bg-success/20' : 'bg-error/20'}`}></div>
              <div className="flex-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-[20px] bg-black/40 border flex-center shadow-inner ${selectedPlan.status === 'pending' ? 'border-warning/30 text-warning' : selectedPlan.status === 'approved' ? 'border-success/30 text-success' : 'border-error/30 text-error'}`}>
                     {selectedPlan.status === 'pending' ? <AlertOctagon size={28}/> : selectedPlan.status === 'approved' ? <CheckCircle size={28}/> : <XCircle size={28}/>}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold m-0 text-white tracking-wide">{selectedPlan.title}</h2>
                    <div className="flex items-center gap-3 mt-2">
                       <StatusBadge status={selectedPlan.status} />
                       <span className="text-[10px] text-primary uppercase font-bold tracking-widest bg-primary/10 px-2 py-1 rounded border border-primary/20"><Target size={10} className="inline mr-1"/> HQ: {selectedPlan.departmentId}</span>
                    </div>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex-center text-muted border border-white/10 transition-colors" onClick={() => !actionType && setSelectedPlan(null)}>✕</button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar">
              
              <div className="grid grid-cols-3 gap-4">
                 <div className="bg-black/40 p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-warning/30 transition-all">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-warning/5 rounded-bl-full"></div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 flex items-center gap-1.5"><DollarSign size={12}/> Ngân sách cấp phát</p>
                    <p className="text-xl font-bold text-warning font-mono">{selectedPlan.budget?.toLocaleString('vi-VN')} đ</p>
                 </div>
                 <div className="bg-black/40 p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-info/30 transition-all">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-info/5 rounded-bl-full"></div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 flex items-center gap-1.5"><Calendar size={12}/> Khởi động</p>
                    <p className="text-xl font-bold text-white font-mono">{selectedPlan.startDate ? format(new Date(selectedPlan.startDate), 'dd/MM/yyyy') : 'N/A'}</p>
                 </div>
                 <div className="bg-black/40 p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-error/30 transition-all">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-error/5 rounded-bl-full"></div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 flex items-center gap-1.5"><Clock size={12}/> Chốt chiến dịch</p>
                    <p className="text-xl font-bold text-error font-mono">{selectedPlan.endDate ? format(new Date(selectedPlan.endDate), 'dd/MM/yyyy') : 'N/A'}</p>
                 </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Target size={14} /> Đo lường Mục tiêu
                </h4>
                <div className="bg-[#1e1e2d] p-5 rounded-2xl border border-white/5 text-sm leading-relaxed text-white">
                  {selectedPlan.goals || selectedPlan.description || <span className="text-muted italic">Chưa có thông tin.</span>}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ListTodo size={14} /> Kiểm tra Khối lượng WBS
                </h4>
                <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#1e1e2d] text-muted">
                      <tr>
                        <th className="p-4 font-bold text-[10px] uppercase w-1/2">Hạng mục công việc</th>
                        <th className="p-4 font-bold text-[10px] uppercase text-center w-1/4">Kỳ hạn</th>
                        <th className="p-4 font-bold text-[10px] uppercase text-center w-1/4">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {selectedPlan.tasks?.map((task, idx) => (
                        <tr key={task.id} className="hover:bg-white/5">
                          <td className="p-4 font-bold text-white text-sm">{idx + 1}. {task.title}</td>
                          <td className="p-4 text-center font-mono text-xs">{format(new Date(task.deadline), 'dd/MM')}</td>
                          <td className="p-4 text-center"><StatusBadge status={task.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Comment Box */}
              {actionType && (
                <div className={`mt-auto p-6 rounded-[24px] border border-transparent animate-fade-in ${actionType === 'approve' ? 'bg-success/10 border-success/30' : actionType === 'reject' ? 'bg-error/10 border-error/30' : 'bg-warning/10 border-warning/30'}`}>
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                    {actionType === 'approve' && <CheckCircle size={24} className="text-success shadow-[0_0_15px_var(--color-success)] rounded-full" />}
                    {actionType === 'reject' && <XCircle size={24} className="text-error shadow-[0_0_15px_var(--color-error)] rounded-full" />}
                    {actionType === 'revision' && <RotateCcw size={24} className="text-warning shadow-[0_0_15px_var(--color-warning)] rounded-full" />}
                    {actionType === 'approve' && 'Xác nhận Ký Phê Duyệt'}
                    {actionType === 'reject' && 'Xác nhận Bác Bỏ Tờ Trình'}
                    {actionType === 'revision' && 'Yêu cầu Sửa đổi'}
                  </h4>
                  <textarea 
                    className={`w-full bg-[#1e1e2d] border-2 rounded-xl p-4 text-sm text-white focus:outline-none transition-colors min-h-[100px] mb-4 ${actionType === 'approve' ? 'border-success/30 focus:border-success/70' : actionType === 'reject' ? 'border-error/30 focus:border-error/70' : 'border-warning/30 focus:border-warning/70'}`}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ghi chú thêm lệnh chỉ đạo vào hồ sơ..."
                    autoFocus
                  ></textarea>
                  <div className="flex gap-3 justify-end">
                    <button className="btn bg-[#161625] text-white hover:bg-white/10 px-6 rounded-xl border border-white/10" onClick={() => setActionType(null)}>Hủy Lệnh</button>
                    <button 
                      className={`btn shadow-[0_0_15px_rgba(0,0,0,0.5)] px-8 rounded-xl font-bold ${actionType === 'approve' ? 'bg-success text-white hover:bg-success/80 border border-success' : actionType === 'reject' ? 'bg-error text-white hover:bg-error/80 border border-error' : 'bg-warning text-[#161625] hover:bg-warning/80 border border-warning'}`}
                      onClick={handleAction}
                    >
                      Ban Hành Lệnh
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer Actions (Only show if pending and user is admin/director) */}
            {!actionType && selectedPlan.status === 'pending' && (
              <div className="p-6 border-t border-white/5 bg-[#161625] z-10 sticky bottom-0 grid grid-cols-3 gap-4">
                <button className="btn bg-error/10 text-error hover:bg-error hover:text-white border border-error/20 rounded-xl flex-center gap-2 h-14 text-sm font-bold transition-all" onClick={() => setActionType('reject')}>
                  <XCircle size={20} /> BÁC BỎ
                </button>
                <button className="btn bg-warning/10 text-warning hover:bg-warning hover:text-[#161625] border border-warning/20 rounded-xl flex-center gap-2 h-14 text-sm font-bold transition-all" onClick={() => setActionType('revision')}>
                  <RotateCcw size={20} /> TRẢ VỀ SỬA
                </button>
                <button className="btn bg-success/20 text-success hover:bg-success hover:text-white border border-success/30 rounded-xl flex-center gap-2 h-14 text-lg font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.1)]" onClick={() => setActionType('approve')}>
                  <CheckCircle size={24} /> KÝ DUYỆT
                </button>
              </div>
            )}
            
            {!actionType && selectedPlan.status !== 'pending' && (
              <div className="p-6 border-t border-white/5 bg-[#161625] z-10 sticky bottom-0 flex justify-end">
                <button className="btn bg-white/5 text-white border border-white/10 px-8 py-3 rounded-xl hover:bg-white/10" onClick={() => setSelectedPlan(null)}>
                  Đóng Phiên Tra Cứu
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
