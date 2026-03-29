import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge } from '../../components/shared/StatusBadge';
import type { MonthlyReport } from '../../types';
import { PieChart, Download, Plus, FileText, Send, Activity, Target, Zap, AlertTriangle, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import './Reports.css';

const Reports: React.FC = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<MonthlyReport[]>(() => reportService.getMonthlyReports());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MonthlyReport | null>(null);

  const handleCreateReport = () => {
    // Mock save
    const newReport: MonthlyReport = {
      id: `rep_${Date.now()}`,
      departmentId: currentUser?.departmentId || 'mkt',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      summary: 'Hoàn thành vượt tiêu chí. Đã liên hệ 35 khách hàng mới, ký được 3 hợp đồng trị giá 2.5 tỷ VNĐ.',
      attachments: [{ name: 'BaoCao.xlsx', url: '#' }],
      status: 'submitted',
      submittedBy: currentUser?.id,
      submittedAt: new Date().toISOString()
    };
    reportService.saveReport(newReport);
    setReports(reportService.getMonthlyReports());
    setShowCreateModal(false);
  };

  return (
    <div className="reports-page animate-fade-in relative h-full flex flex-col pt-2">
      <div className="page-header flex-between mb-8 pl-2 pr-4">
        <div>
          <h1 className="page-title text-gradient">Báo cáo (Hybrid List)</h1>
          <p className="text-muted mt-2 text-sm font-mono tracking-wide">Báo cáo tổng hợp hàng tháng theo phòng ban.</p>
        </div>
        <div className="actions flex gap-3">
          <button className="btn bg-primary text-white hover:bg-primary/80 shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-primary/50 flex items-center gap-2 rounded-xl px-6 py-2.5 font-bold transition-all" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} /> Tạo báo cáo
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-4 pl-2 pb-8">
         <div className="glass-panel overflow-hidden border border-white/10 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <table className="w-full text-left text-sm border-collapse">
               <thead>
                 <tr className="bg-black/40 border-b border-white/10">
                   <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px] w-24">Tháng</th>
                   <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px] w-48">Phòng ban</th>
                   <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px]">Tóm tắt</th>
                   <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px] text-center w-24">Đính kèm</th>
                   <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px] w-32">Ngày nộp</th>
                   <th className="p-4 font-bold text-muted uppercase tracking-widest text-[10px] text-center w-32">Trạng thái</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {reports.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="p-8 text-center text-muted italic">Chưa có báo cáo nào được ghi nhận.</td>
                   </tr>
                 ) : (
                   reports.map((rep) => (
                     <tr key={rep.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedReport(rep)}>
                        <td className="p-4">
                           <span className="font-bold text-white group-hover:text-info transition-colors">T{rep.month}/{rep.year}</span>
                        </td>
                        <td className="p-4">
                           <span className="text-white font-medium uppercase text-sm tracking-wide">{rep.departmentId}</span>
                        </td>
                        <td className="p-4">
                           <p className="text-muted text-sm line-clamp-1 group-hover:text-white transition-colors">{rep.summary || 'Chưa có nội dung'}</p>
                        </td>
                        <td className="p-4 text-center">
                           <div className="flex-center">
                              {rep.attachments && rep.attachments.length > 0 ? (
                                <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                                   <Paperclip size={14}/>
                                   <span className="text-xs font-bold">{rep.attachments.length}</span>
                                </div>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                           </div>
                        </td>
                        <td className="p-4 text-white text-xs font-mono">
                           {rep.submittedAt ? format(new Date(rep.submittedAt), 'yyyy-MM-dd') : '—'}
                        </td>
                        <td className="p-4 text-center">
                           <div className="flex justify-center">
                             <StatusBadge status={rep.status} />
                           </div>
                        </td>
                     </tr>
                   ))
                 )}
                 {/* Mock Empty Row for Lovable visual faithful */}
                 <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="p-4"><span className="font-bold text-white">T3/2026</span></td>
                    <td className="p-4"><span className="text-white font-medium uppercase text-sm tracking-wide">PHÒNG KỸ THUẬT</span></td>
                    <td className="p-4"><p className="text-muted text-sm italic">Chưa có nội dung</p></td>
                    <td className="p-4 text-center"><span className="text-muted">—</span></td>
                    <td className="p-4 text-white text-xs font-mono">—</td>
                    <td className="p-4 text-center">
                       <span className="inline-flex items-center justify-center px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest text-muted uppercase">Chưa Nộp</span>
                    </td>
                 </tr>
               </tbody>
            </table>
         </div>
      </div>

      {/* Modal Creating Report */}
      {showCreateModal && (
        <div className="modal-overlay fixed inset-0 z-50 flex-center bg-black/80 backdrop-blur-md" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content glass-panel p-8 max-w-2xl w-full animate-slide-up border-primary/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] rounded-[32px] overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] pointer-events-none rounded-full"></div>
            
            <div className="flex-between mb-8 relative z-10">
              <div>
                 <h3 className="text-2xl font-bold flex items-center gap-3 text-white mb-2">
                    <Activity className="text-primary animate-pulse"/>
                    Soạn Báo cáo T{new Date().getMonth() + 1}/{new Date().getFullYear()}
                 </h3>
                 <p className="text-sm text-primary font-mono tracking-widest uppercase">Report Creation Protocol</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex-center text-muted border border-white/10 transition-colors" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="bg-black/30 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex-center text-primary"><Target size={20}/></div>
                 <div>
                    <span className="text-[10px] text-muted block uppercase tracking-widest font-bold mb-1">Đơn vị Phát tín hiệu</span>
                    <strong className="text-white uppercase tracking-widest">{currentUser?.departmentId}</strong>
                 </div>
              </div>
              
              <div className="form-group">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">Tóm tắt Kết quả *</label>
                <textarea className="w-full bg-[#161625] border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-primary/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] outline-none transition-all min-h-[100px] font-medium leading-relaxed" placeholder="Nhập tóm tắt quá trình thực hiện công việc trong tháng..."></textarea>
              </div>
              
              <div className="form-group">
                <label className="text-[10px] font-bold text-warning uppercase tracking-widest block mb-2">Vướng mắc & Đề xuất (Tùy chọn)</label>
                <textarea className="w-full bg-warning/5 border border-warning/20 rounded-2xl p-4 text-sm text-white focus:border-warning/50 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)] outline-none transition-all min-h-[80px] font-medium leading-relaxed" placeholder="Ghi nhận rủi ro, dự kiến trễ tiến độ hoặc cần hỗ trợ..."></textarea>
              </div>
              
              <div className="form-group">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">Đính kèm Dữ liệu (Excel, PDF, PPTX)</label>
                <div className="upload-zone py-8 bg-black/40 border-2 border-dashed border-white/10 rounded-[24px] text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                     <FileText size={32} className="text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm font-bold text-white mb-2 tracking-wide">Kéo thả File Báo Cáo vào Trạm</p>
                  <p className="text-[10px] text-muted font-mono">Dung lượng tối đa: 50MB / File</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3 relative z-10 pt-6 border-t border-white/5">
              <button className="btn bg-[#161625] text-white hover:bg-white/10 px-8 rounded-xl font-bold border border-white/10" onClick={() => setShowCreateModal(false)}>Hủy</button>
              <button className="btn bg-primary text-white hover:bg-primary/80 shadow-[0_0_20px_rgba(99,102,241,0.5)] px-8 rounded-xl flex items-center gap-2 font-bold transition-all" onClick={handleCreateReport}>
                <Send size={18} /> Gửi Báo Cáo Bấm Chốt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Slide Panel (Reused Vanguard Element) */}
      {selectedReport && (
        <div className="slide-panel-overlay fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md" onClick={() => setSelectedReport(null)}>
          <div className="slide-panel w-full max-w-xl h-full bg-[#161625]/95 border-l border-white/10 p-0 flex flex-col shadow-[-30px_0_100px_rgba(0,0,0,0.8)] animate-slide-left" onClick={e => e.stopPropagation()}>
             {/* Header */}
             <div className="p-8 border-b border-white/5 bg-gradient-to-br from-primary/20 to-transparent relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/30 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="flex-between relative z-10 mb-2">
                   <h2 className="text-2xl font-bold flex items-center gap-3 text-white tracking-wide">
                      <PieChart className="text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]"/> Báo cáo Tháng {selectedReport.month}/{selectedReport.year}
                   </h2>
                   <button className="w-10 h-10 rounded-full bg-white/5 flex-center hover:bg-white/10 border border-white/10 transition-colors text-muted hover:text-white" onClick={() => setSelectedReport(null)}>✕</button>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                   <p className="text-[10px] text-primary uppercase font-bold tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20"><Target size={12} className="inline mr-1 -mt-0.5"/> Dept: {selectedReport.departmentId}</p>
                   <StatusBadge status={selectedReport.status} />
                </div>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative">
                <div>
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 flex items-center gap-2"><Activity size={14}/> Khái quát Dữ liệu</h4>
                  <p className="text-sm leading-relaxed bg-[#1e1e2d] p-5 rounded-2xl border border-white/5 text-white shadow-inner">{selectedReport.summary || 'Trống'}</p>
                </div>
                
                <div>
                   <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><FileText size={14}/> Tệp đính kèm Bức xạ</h4>
                   <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/10 group cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[16px] bg-primary/10 flex-center text-primary group-hover:scale-110 transition-transform"><FileText size={24}/></div>
                        <div>
                          <p className="text-sm font-bold text-white mb-1">BaoCaoThang{selectedReport.month}.xlsx</p>
                          <p className="text-[10px] text-muted font-mono">ENCRYPTED • 2.4 MB</p>
                        </div>
                      </div>
                      <button className="w-10 h-10 rounded-full flex-center bg-white/5 text-muted group-hover:bg-primary group-hover:text-white transition-all shadow-[0_0_15px_rgba(236,72,153,0)] group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                         <Download size={18} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
