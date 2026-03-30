import React from 'react';
import { 
  Calendar, 
  Wrench, 
  Clock, 
  User, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const MaintenanceManager: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Module Header */}
      <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
            <Wrench size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-mono">BẢO TRÌ & SỬA CHỮA</h1>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mt-1">Quản lý vòng đời dịch vụ & Bảo dưỡng định kỳ</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-[#0a0a0f] rounded-lg text-[11px] font-bold hover:bg-amber-400 transition-all font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Calendar size={16} />
          Lập lịch bảo trì
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Active Maintenance Tasks - High Density */}
        <div className="col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-500 font-mono">Phiếu công tác đang thực hiện (03)</h2>
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 uppercase font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 2 Hoàn tất
               </div>
               <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-500 uppercase font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> 1 Đang chạy
               </div>
            </div>
          </div>
          
          {/* Work Order Card 1 */}
          <div className="hud-card p-5 border-l-amber-500 group hover:border-amber-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <Wrench size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase group-hover:text-amber-400 transition-colors">Bảo trì Định kỳ: Máy CNC 01-A</h3>
                  <p className="text-[10px] text-gray-500 font-mono font-bold uppercase mt-1 tracking-widest">ID: MNT-2026-0042 • LOẠI: BẢO DƯỠNG NGĂN NGỪA</p>
                </div>
              </div>
              <span className="badge badge-maintenance">ĐANG THỰC HIỆN</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 py-3 bg-black/20 rounded-lg border border-white/5 px-4 mb-4">
              <div className="flex flex-col">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1 font-mono">Kỹ thuật viên</p>
                <div className="flex items-center gap-2">
                   <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                     <User size={12} className="text-cyan-400" />
                   </div>
                   <span className="text-[11px] font-bold text-gray-300">TRẦN VĂN MINH</span>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1 font-mono">Dự kiến hoàn tất</p>
                <div className="flex items-center gap-2">
                   <Clock size={12} className="text-cyan-400" />
                   <span className="text-[11px] font-bold font-mono text-gray-300 uppercase">14:00 • 31/03</span>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1 font-mono">Vật tư sử dụng</p>
                <span className="text-[11px] font-bold text-gray-300 uppercase truncate">Dầu thủy lực, Bộ lọc</span>
              </div>
              <div className="flex flex-col items-end justify-center">
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-amber-500" style={{ width: '65%' }}></div>
                 </div>
                 <span className="text-[9px] font-bold text-amber-500 font-mono">TÌNH TRẠNG: 65%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold hover:bg-white/10 transition-all font-mono uppercase text-gray-400">Xem tài liệu</button>
                 <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold hover:bg-white/10 transition-all font-mono uppercase text-gray-400">Nhật ký</button>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold hover:bg-white/10 transition-all font-mono uppercase text-gray-400">Hủy bỏ</button>
                <button className="px-4 py-1.5 bg-emerald-500 text-[#0a0a0f] rounded-lg text-[10px] font-bold hover:bg-emerald-400 transition-all font-mono uppercase">Hoàn tất công việc</button>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Stats & History */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="hud-card p-5 bg-white/[0.01]">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-6 flex items-center gap-2 font-mono">
              <Activity size={14} className="text-cyan-400" />
              CHỈ SỐ ĐỘ TIN CẬY
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-bold mb-2 font-mono uppercase tracking-widest">
                   <span className="text-gray-500">Tỷ lệ Uptime</span>
                   <span className="text-emerald-400">98.2%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" style={{ width: '98.2%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold mb-2 font-mono uppercase tracking-widest">
                   <span className="text-gray-500">Sửa chữa tồn đọng</span>
                   <span className="text-rose-500 uppercase">05 Yêu cầu</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-rose-500 shadow-[0_0_8px_#ef4444]" style={{ width: '38%' }}></div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">MTBF (Trung bình lỗi)</span>
                    <span className="text-xs font-bold text-white font-mono">452 Giờ</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">MTTR (Trung bình sửa)</span>
                    <span className="text-xs font-bold text-white font-mono">2.4 Giờ</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="hud-card p-5 bg-[#0f0f18]/50">
            <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-2">
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-500 flex items-center gap-2 font-mono">
                <CheckCircle2 size={14} className="text-emerald-500" />
                LỊCH SỬ GẦN ĐÂY
              </h2>
              <button className="p-1 hover:bg-white/5 rounded-md transition-colors text-gray-600 hover:text-cyan-400">
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex gap-3 items-start group cursor-pointer p-2 rounded hover:bg-white/5 transition-all">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/50 shadow-[0_0_5px_#10b981]"></div>
                    <div className="flex flex-col min-w-0">
                       <p className="text-[11px] font-bold group-hover:text-cyan-400 transition-colors uppercase truncate">Hoàn tất PM: Máy khoan Drill-X2</p>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-gray-500 font-mono uppercase font-bold tracking-wider">2 ngày trước</span>
                          <span className="w-1 h-1 rounded-full bg-white/10"></span>
                          <span className="text-[9px] text-gray-400 font-mono font-bold uppercase tracking-wider">NV: TRUNG NGUYỄN</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Activity: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export default MaintenanceManager;
