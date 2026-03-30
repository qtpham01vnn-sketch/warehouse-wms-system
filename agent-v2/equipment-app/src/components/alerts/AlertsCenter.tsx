import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  CalendarDays,
  CheckCircle2,
  Bell,
  Settings,
  ArrowRight
} from 'lucide-react';

const mockAlerts = [
  {
    id: '1',
    type: 'maintenance_due',
    priority: 'high',
    title: 'Quá hạn bảo trì: Máy CNC 01-A',
    message: 'Lịch bảo trì định kỳ cho CNC 01-A đã quá hạn 48 giờ. Nguy cơ suy giảm hiệu năng trục chính.',
    timestamp: '2 giờ trước',
    equipment: 'CNC 01-A'
  },
  {
    id: '2',
    type: 'warranty_expiring',
    priority: 'medium',
    title: 'Sắp hết hạn bảo hành: Máy cắt Laser X2',
    message: 'Bảo hành từ nhà sản xuất cho Máy cắt Laser X2 sẽ hết hạn trong 7 ngày tới.',
    timestamp: '6 giờ trước',
    equipment: 'LC-X2'
  },
  {
    id: '3',
    type: 'calibration_due',
    priority: 'low',
    title: 'Yêu cầu hiệu chuẩn thiết bị',
    message: 'Bộ thước đo kỹ thuật số Set B cần được hiệu chuẩn lại trước ngày 05/04.',
    timestamp: '1 ngày trước',
    equipment: 'MIC-B'
  }
];

const AlertsCenter: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Module Header */}
      <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20 text-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Bell size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-mono">TRUNG TÂM CẢNH BÁO</h1>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mt-1">Giám sát sức khỏe hệ thống & Thông báo vận hành</p>
          </div>
        </div>
        <button className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-[0.2em] font-mono transition-colors border-b border-cyan-500/20 hover:border-cyan-400 pb-0.5">
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Alerts List - High Density */}
        <div className="col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-500 font-mono">Danh sách thông báo gần đây</h2>
             <div className="flex gap-3">
                <span className="text-[9px] font-bold text-rose-500 px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded uppercase font-mono">03 Chưa đọc</span>
             </div>
          </div>

          <div className="space-y-3">
             {mockAlerts.map((alert) => (
               <div key={alert.id} className={`hud-card p-4 flex gap-5 border-l-4 group transition-all duration-300 cursor-pointer hover:bg-white/[0.03] ${
                 alert.priority === 'high' ? 'border-l-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 
                 alert.priority === 'medium' ? 'border-l-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.05)]' : 'border-l-cyan-500 shadow-[0_0_15px_rgba(0,240,255,0.05)]'
               }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 ${
                     alert.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 
                     alert.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
                  }`}>
                     {alert.type === 'maintenance_due' ? <AlertTriangle size={20} /> : 
                      alert.type === 'warranty_expiring' ? <ShieldAlert size={20} /> : <CalendarDays size={20} />}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                           <h3 className="text-[13px] font-bold uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors leading-none">
                              {alert.title}
                           </h3>
                           <div className="flex items-center gap-2 mt-2">
                             <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono ${
                               alert.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                               alert.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                             }`}>
                                {alert.priority === 'high' ? 'KHẨN CẤP' : alert.priority === 'medium' ? 'CẢNH BÁO' : 'THÔNG TIN'}
                             </span>
                             <span className="w-1 h-1 rounded-full bg-white/10"></span>
                             <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest">{alert.equipment}</span>
                           </div>
                        </div>
                        <span className="text-[10px] font-bold font-mono text-gray-600 uppercase tracking-widest">{alert.timestamp}</span>
                     </div>
                     <p className="text-[12px] text-gray-400 mt-3 leading-relaxed border-t border-white/5 pt-3 group-hover:text-gray-300 transition-colors">
                        {alert.message}
                     </p>
                     <div className="mt-4 flex gap-2">
                         <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold uppercase hover:bg-white/10 transition-all font-mono text-gray-400 hover:text-white">
                           Xem thiết bị <ArrowRight size={12} />
                         </button>
                         <button className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 text-[#0a0a0f] rounded text-[10px] font-bold uppercase hover:bg-cyan-400 transition-all font-mono">
                           <CheckCircle2 size={12} /> Xác nhận xử lý
                         </button>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Analytics & Configuration */}
        <div className="col-span-4 flex flex-col gap-6">
           <div className="hud-card p-5 bg-white/[0.01]">
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-6 flex items-center gap-2 font-mono">
                <Info size={14} className="text-cyan-400" />
                PHÂN BỔ CẢNH BÁO
              </h2>
              <div className="space-y-4">
                 <div className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono group-hover:text-rose-500 transition-colors">NGUY CẤP (CRITICAL)</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-rose-500">02</span>
                 </div>
                 <div className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(251,191,36,0.5)]"></div>
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono group-hover:text-amber-500 transition-colors">CẢNH BÁO (WARNING)</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-amber-500">05</span>
                 </div>
                 <div className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(0,240,255,0.5)]"></div>
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono group-hover:text-cyan-400 transition-colors">THÔNG TIN (INFO)</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-cyan-400">12</span>
                 </div>
              </div>
              <div className="mt-6 pt-5 border-t border-white/5">
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                    <div className="h-full bg-rose-500" style={{ width: '15%' }}></div>
                    <div className="h-full bg-amber-500" style={{ width: '35%' }}></div>
                    <div className="h-full bg-cyan-500" style={{ width: '50%' }}></div>
                 </div>
                 <p className="text-[9px] text-center text-gray-600 mt-2 font-bold uppercase tracking-widest leading-none">Phân bổ tỷ lệ trong 30 ngày qua</p>
              </div>
           </div>

           <div className="hud-card p-5 border-cyan-500/20 bg-cyan-500/[0.01]">
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2 font-mono">
                 <Settings size={14} className="text-cyan-400" />
                 CẤU HÌNH PROTOCOL
              </h2>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Thông báo hệ thống hiện đang được kích hoạt qua Email và Push Notification. Các cảnh báo Nguy cấp tự động bỏ qua khung giờ bảo trì.</p>
              <button className="mt-5 w-full py-2.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase hover:bg-white/10 transition-all font-mono text-gray-400 hover:text-white">
                Thiết lập thông báo
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsCenter;
