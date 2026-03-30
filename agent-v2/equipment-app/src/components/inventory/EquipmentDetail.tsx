import React from 'react';
import { 
  ArrowLeft, 
  Settings, 
  History, 
  Wrench, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  Database,
  Tag,
  MapPin,
  Calendar,
  Box,
  FileText
} from 'lucide-react';

interface EquipmentDetailProps {
  id?: string;
  onBack?: () => void;
}

const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ onBack }) => {
  // Mock data for the selected equipment
  const asset = {
    id: '1',
    asset_code: 'CNC-01',
    asset_name: 'Máy phay trung tâm CNC',
    model: 'VF-2',
    manufacturer: 'Haas Automation',
    status: 'active',
    department: 'Xưởng sản xuất chính',
    location: 'Khu vực A, Line 01',
    install_date: '2024-05-15',
    warranty_expiry: '2026-05-15',
    last_maintenance: '2026-01-12',
    next_maintenance: '2026-04-15',
    specs: [
      { label: 'Công suất', value: '30 HP' },
      { label: 'Điện áp', value: '440V/3Ph' },
      { label: 'Tốc độ trục', value: '8100 RPM' },
      { label: 'Hành trình X,Y,Z', value: '30" x 16" x 20"' }
    ]
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      {/* Detail Header */}
      <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg border border-white/10 transition-all text-gray-400 hover:text-cyan-400 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex flex-col">
             <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">{asset.asset_code}</span>
               <h1 className="text-xl font-bold tracking-tight text-white uppercase">{asset.asset_name}</h1>
             </div>
             <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase">ONLINE - ĐANG HOẠT ĐỘNG</span>
                </div>
                <div className="h-2.5 w-px bg-white/10"></div>
                <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-widest">{asset.department} • {asset.location}</span>
             </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold hover:bg-white/10 transition-all font-mono uppercase tracking-wider text-gray-300">
            <History size={14} />
            Lịch sử vận hành
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-[#0a0a0f] rounded-lg text-[10px] font-bold hover:bg-cyan-400 transition-all font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Settings size={14} />
            Cấu hình thiết bị
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Asset Info & Specs */}
        <div className="col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
             {/* General Info Card */}
             <div className="hud-card p-6 bg-white/[0.01]">
                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-5 border-b border-white/5 pb-2">THÔNG TIN CHUNG</h3>
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-gray-500">
                         <Database size={20} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Mã định danh</span>
                         <span className="text-sm font-bold text-white font-mono">{asset.asset_code}</span>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-gray-500">
                         <Tag size={20} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Nhà sản xuất / Model</span>
                         <span className="text-sm font-bold text-white uppercase">{asset.manufacturer} - {asset.model}</span>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-gray-500">
                         <MapPin size={20} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Vị trí lắp đặt</span>
                         <span className="text-sm font-bold text-white uppercase">{asset.location}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Dates & Lifecycle Card */}
             <div className="hud-card p-6 bg-white/[0.01]">
                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-5 border-b border-white/5 pb-2">VÒNG ĐỜI & BẢO TRÌ</h3>
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-gray-500">
                         <Calendar size={20} />
                      </div>
                      <div className="flex flex-col text-right ml-auto">
                         <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Ngày lắp đặt</span>
                         <span className="text-sm font-bold text-white font-mono">{asset.install_date}</span>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-gray-500">
                         <ShieldCheck size={20} />
                      </div>
                      <div className="flex flex-col text-right ml-auto">
                         <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Hết hạn bảo hành</span>
                         <span className="text-sm font-bold text-cyan-400 font-mono">{asset.warranty_expiry}</span>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-amber-500/50">
                         <Clock size={20} />
                      </div>
                      <div className="flex flex-col text-right ml-auto">
                         <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest">Bảo trì tiếp theo</span>
                         <span className="text-sm font-bold text-amber-500 font-mono underline decoration-amber-500/30 underline-offset-4">{asset.next_maintenance}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="hud-card p-6 bg-white/[0.01]">
             <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-2">THÔNG SỐ KỸ THUẬT CHI TIẾT</h3>
             <div className="grid grid-cols-4 gap-4">
                {asset.specs.map((spec, i) => (
                   <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-lg group hover:border-cyan-500/30 transition-all">
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2 font-mono group-hover:text-cyan-400 transition-colors">{spec.label}</p>
                      <p className="text-sm font-bold text-white tracking-tight uppercase leading-none">{spec.value}</p>
                   </div>
                ))}
             </div>
          </div>

          <div className="hud-card flex-1 overflow-hidden flex flex-col bg-white/[0.01]">
            <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">NHẬT KÝ SỬA CHỮA & CÔNG TÁC</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-6 py-2 text-[9px] font-black text-gray-600 uppercase tracking-widest">Mã Phiếu</th>
                    <th className="px-6 py-2 text-[9px] font-black text-gray-600 uppercase tracking-widest">Loại</th>
                    <th className="px-6 py-2 text-[9px] font-black text-gray-600 uppercase tracking-widest">Ngày</th>
                    <th className="px-6 py-2 text-[9px] font-black text-gray-600 uppercase tracking-widest">Nội dung</th>
                    <th className="px-6 py-2 text-[9px] font-black text-gray-600 uppercase tracking-widest">Kỹ thuật viên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-cyan-500/[0.02] cursor-pointer group">
                    <td className="px-6 py-3 text-[11px] font-bold font-mono text-cyan-400">#WO-2026-012</td>
                    <td className="px-6 py-3"><span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded uppercase">BẢO TRÌ</span></td>
                    <td className="px-6 py-3 text-[11px] font-mono text-gray-400">12/01/2026</td>
                    <td className="px-6 py-3 text-[11px] text-gray-300">Thay dầu trục chính và căn chỉnh dao</td>
                    <td className="px-6 py-3 text-[11px] text-gray-300 font-bold">LÊ VĂN AN</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Files */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="hud-card p-6 bg-white/[0.01]">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-5 border-b border-white/5 pb-2">THAO TÁC NHANH</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/30 transition-all group">
                <div className="flex items-center gap-3">
                  <Wrench className="text-amber-500" size={18} />
                  <span className="text-xs font-bold text-white uppercase tracking-tight">Yêu cầu sửa chữa khẩn cấp</span>
                </div>
                <AlertTriangle size={14} className="text-amber-500 animate-pulse" />
              </button>
              <button className="w-full flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/30 transition-all group">
                <div className="flex items-center gap-3">
                  <Box className="text-cyan-400" size={18} />
                  <span className="text-xs font-bold text-white uppercase tracking-tight">Cấp phát linh kiện</span>
                </div>
                <ArrowLeft size={14} className="rotate-180 text-gray-600 group-hover:text-cyan-400" />
              </button>
            </div>
          </div>

          <div className="hud-card p-6 bg-white/[0.01]">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-5 border-b border-white/5 pb-2">HỒ SƠ TÀI LIỆU</h3>
            <div className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5 group hover:border-cyan-400/20 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                     <FileText size={16} className="text-gray-500 group-hover:text-cyan-400" />
                     <span className="text-[11px] font-bold text-gray-300 uppercase tracking-tight truncate w-48">Manual_CNC01_Haas.pdf</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-600">2.4 MB</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5 group hover:border-cyan-400/20 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                     <FileText size={16} className="text-gray-500 group-hover:text-cyan-400" />
                     <span className="text-[11px] font-bold text-gray-300 uppercase tracking-tight truncate w-48">So_do_dien_A01.dwg</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-600">0.8 MB</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5 group hover:border-cyan-400/20 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                     <FileText size={16} className="text-gray-500 group-hover:text-cyan-400" />
                     <span className="text-[11px] font-bold text-gray-300 uppercase tracking-tight truncate w-48">Chung_nhan_Kiem_dinh.pdf</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 underline decoration-emerald-500/30">VALID</span>
               </div>
            </div>
          </div>

          <div className="hud-card p-6 bg-white/[0.01] border-l-cyan-500">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">CHI PHÍ VẬN HÀNH (YTD)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tiền điện</span>
                <span className="text-lg font-black text-white font-mono">12.4M đ</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Bảo trì / Thay thế</span>
                <span className="text-lg font-black text-white font-mono">4.2M đ</span>
              </div>
              <p className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em] text-center mt-2">Dữ liệu tính toán từ Hệ thống Quản lý Chi phí</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
