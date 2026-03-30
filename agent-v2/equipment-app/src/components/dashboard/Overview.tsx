import React from 'react';
import { 
  Package, 
  Wrench, 
  AlertTriangle, 
  Activity, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  FileText,
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import StatCard from './StatCard';

const Overview: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Info - Compact & Professional */}
      <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-mono">TỔNG QUAN HỆ THỐNG</h1>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mt-1">
              Thời gian thực: <span className="text-cyan-400">{new Date().toLocaleTimeString('vi-VN')}</span>
            </p>
          </div>
          <div className="h-10 w-px bg-white/10"></div>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Hiệu suất (OEE)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-emerald-400 font-mono">82.4%</span>
                <span className="text-[10px] text-emerald-400/50 uppercase font-mono">Đạt mục tiêu</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Sẵn sàng (Availability)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-cyan-400 font-mono">94.1%</span>
                <span className="text-[10px] text-cyan-400/50 uppercase font-mono">Ổn định</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[11px] font-bold hover:bg-white/10 transition-all font-mono uppercase tracking-wider text-gray-400 hover:text-white">
            <FileText size={14} />
            Báo cáo nhanh
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500 text-[#0a0a0f] rounded-lg text-[11px] font-bold hover:bg-cyan-400 transition-all font-mono uppercase tracking-wider">
            <TrendingUp size={14} />
            Tăng hiệu suất
          </button>
        </div>
      </div>

      {/* Primary Metrics Group */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard 
          label="Tổng thiết bị" 
          value="1,248" 
          unit="Tài sản"
          icon={<Package />} 
          trend={{ value: '2.1%', positive: true }}
          color="cyan"
          statusLabel="Đang quản lý"
        />
        <StatCard 
          label="Thiết bị Hoạt động" 
          value="1,102" 
          unit="Đã Online"
          icon={<CheckCircle2 />} 
          color="emerald"
          statusLabel="Trạng thái Tốt"
        />
        <StatCard 
          label="Lịch Bảo trì" 
          value="08" 
          unit="Kế hoạch"
          icon={<Clock />} 
          trend={{ value: '3 hạng mục', positive: false }}
          color="amber"
          statusLabel="Sắp đến hạn"
        />
        <StatCard 
          label="Đang sửa chữa" 
          value="05" 
          unit="Yêu cầu"
          icon={<Wrench />} 
          color="rose"
          statusLabel="Khẩn cấp"
        />
        <StatCard 
          label="Linh kiện tồn kho" 
          value="452" 
          unit="SKU"
          icon={<Layers />} 
          color="purple"
          statusLabel="Trung bình"
        />
      </div>

      {/* Secondary Layout - Integrated Control Panel */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Operations & Alerts */}
        <div className="col-span-8 flex flex-col gap-6">
          <div className="hud-card overflow-hidden flex flex-col bg-white/[0.01]">
            <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" />
                Cảnh báo vận hành & Bảo dưỡng
              </h2>
              <button className="text-[9px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest flex items-center gap-1 transition-colors">
                Xem tất cả cảnh báo <ArrowRight size={10} />
              </button>
            </div>
            <div className="p-0 flex-1">
              {/* Alert Item 1 */}
              <div className="border-b border-white/5 p-4 flex items-center justify-between group hover:bg-cyan-400/[0.02] transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-rose-500/50 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                  <div>
                    <p className="text-[13px] font-bold group-hover:text-cyan-400 transition-colors uppercase tracking-tight">Hết hạn đăng kiểm: Máy CNC 01-A (Main Milling)</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider">Mã: 293-AX92-01</span>
                      <div className="w-1 h-1 rounded-full bg-white/10"></div>
                      <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider">Phòng: Sản xuất 01</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-rose-500 font-mono py-0.5 px-2 bg-rose-500/10 border border-rose-500/20 rounded">ĐÃ QUÁ HẠN</span>
                  <p className="text-[9px] text-gray-600 font-mono mt-1.5 uppercase font-bold tracking-widest">2 giờ trước</p>
                </div>
              </div>
              {/* Alert Item 2 */}
              <div className="border-b border-white/5 p-4 flex items-center justify-between group hover:bg-cyan-400/[0.02] transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-amber-500/50 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                  <div>
                    <p className="text-[13px] font-bold group-hover:text-cyan-400 transition-colors uppercase tracking-tight">Cần hiệu chuẩn: Máy cắt Laser X2</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider">Mã: 112-LZ04-99</span>
                      <div className="w-1 h-1 rounded-full bg-white/10"></div>
                      <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider">Phòng: Thí nghiệm 04</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-amber-500 font-mono py-0.5 px-2 bg-amber-500/10 border border-amber-500/20 rounded">CÒN 3 NGÀY</span>
                  <p className="text-[9px] text-gray-600 font-mono mt-1.5 uppercase font-bold tracking-widest">6 giờ trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Control Panel */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="hud-card flex flex-col border-l-cyan-500 bg-white/[0.01]">
            <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                <Activity size={14} className="text-cyan-400" />
                Bảng điều khiển nhanh
              </h2>
            </div>
            <div className="p-5 space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-cyan-400/5 hover:border-cyan-500/30 transition-all text-[12px] font-bold group">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-cyan-500/10 rounded border border-cyan-500/20 text-cyan-400">
                     <FileText size={16} />
                   </div>
                   Tạo phiếu sửa chữa
                 </div>
                 <ChevronRight size={14} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-emerald-400/5 hover:border-emerald-500/30 transition-all text-[12px] font-bold group">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20 text-emerald-400">
                     <Layers size={16} />
                   </div>
                   Yêu cầu linh kiện
                 </div>
                 <ChevronRight size={14} className="text-gray-600 group-hover:text-emerald-400 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-amber-400/5 hover:border-amber-500/30 transition-all text-[12px] font-bold group">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-amber-500/10 rounded border border-amber-500/20 text-amber-400">
                     <ShieldCheck size={16} />
                   </div>
                   Đăng ký kiểm định
                 </div>
                 <ChevronRight size={14} className="text-gray-600 group-hover:text-amber-400 transition-colors" />
              </button>

              <div className="mt-6 pt-5 border-t border-white/5">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Truy cập nhanh</p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-3 py-2 bg-white/5 border border-white/10 rounded flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-cyan-400 hover:bg-white/10 transition-all uppercase tracking-tighter">
                    <span className="text-cyan-500">→</span> Bảo trì
                  </button>
                  <button className="px-3 py-2 bg-white/5 border border-white/10 rounded flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-cyan-400 hover:bg-white/10 transition-all uppercase tracking-tighter">
                    <span className="text-cyan-500">→</span> Linh kiện
                  </button>
                  <button className="px-3 py-2 bg-white/5 border border-white/10 rounded flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-cyan-400 hover:bg-white/10 transition-all uppercase tracking-tighter">
                    <span className="text-cyan-500">→</span> Bảo hành
                  </button>
                  <button className="px-3 py-2 bg-white/5 border border-white/10 rounded flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-cyan-400 hover:bg-white/10 transition-all uppercase tracking-tighter">
                    <span className="text-cyan-500">→</span> Báo cáo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRight: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
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
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default Overview;
