import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  History, 
  Search,
  Download,
  Package,
  X,
  ExternalLink,
  Wrench,
  Clock,
  Shield,
  FileText
} from 'lucide-react';
import type { Equipment } from '../../types';

const mockEquipment: Equipment[] = [
  {
    id: '1',
    asset_code: 'CNC-01',
    asset_name: 'Máy phay trung tâm CNC',
    model: 'VF-2',
    manufacturer: 'Haas',
    status: 'active',
    department: 'Xưởng sản xuất',
    location: 'Khu vực A-01',
    next_maintenance_date: '15/04/2026',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    asset_code: 'LC-04',
    asset_name: 'Máy cắt Laser XL',
    model: 'Fusion Pro',
    manufacturer: 'Epilog',
    status: 'maintenance',
    department: 'Xưởng cơ khí',
    location: 'Khu vực B-04',
    next_maintenance_date: '31/03/2026',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    asset_code: 'PR-12',
    asset_name: 'Máy in 3D công nghiệp',
    model: 'F370',
    manufacturer: 'Stratasys',
    status: 'repair',
    department: 'Phòng R&D',
    location: 'Lab 02',
    next_maintenance_date: '10/05/2026',
    created_at: new Date().toISOString()
  }
];

const EquipmentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Equipment | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="badge badge-active">Đang chạy</span>;
      case 'maintenance': return <span className="badge badge-maintenance">Bảo trì</span>;
      case 'repair': return <span className="badge badge-critical">Đang sửa</span>;
      default: return <span className="badge badge-inactive">Ngoại tuyến</span>;
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-160px)]">
      <div className={`space-y-6 transition-all duration-500 ${selectedAsset ? 'pr-[400px]' : ''}`}>
        <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-xl">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-mono">DANH MỤC THIẾT BỊ</h1>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mt-1">Quản lý vòng đời tài sản & Tình trạng vận hành</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
              <Download size={18} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-[#0a0a0f] rounded-lg text-[11px] font-bold hover:bg-cyan-400 transition-all font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Plus size={16} />
              Đăng ký thiết bị
            </button>
          </div>
        </div>

        <div className="hud-card overflow-hidden bg-white/[0.01]">
          <div className="p-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                <input 
                  type="text" 
                  placeholder="Tìm theo S/N, Tên hoặc Mã thiết bị..." 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-[11px] focus:outline-none focus:border-cyan-500/50 transition-all font-mono placeholder:text-gray-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold font-mono text-gray-500 hover:text-white transition-all uppercase tracking-wider">
                <Filter size={12} />
                Lọc
              </button>
            </div>
            <div className="flex gap-4 text-[9px] font-bold font-mono text-gray-500 uppercase tracking-widest px-4">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div> 
                 <span>HOẠT ĐỘNG: 1,102</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div> 
                 <span>BẢO TRÌ: 8</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div> 
                 <span>GẶP SỰ CỐ: 5</span>
               </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/5">
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-mono">Thông tin tài sản</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-mono">Phòng ban / Vị trí</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-mono">Tình trạng</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-mono">Bảo trì tiếp theo</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-mono text-center">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockEquipment.map((asset) => (
                  <tr 
                    key={asset.id} 
                    onClick={() => setSelectedAsset(asset)}
                    className={`group hover:bg-cyan-500/[0.03] transition-all cursor-pointer ${selectedAsset?.id === asset.id ? 'bg-cyan-500/10' : ''}`}
                  >
                    <td className="px-6 py-2.5">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded border flex items-center justify-center transition-all duration-300 ${
                          asset.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                          asset.status === 'maintenance' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                          'bg-rose-500/10 border-rose-500/20 text-rose-500 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                        }`}>
                          <Package size={16} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{asset.asset_name}</p>
                          <p className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest">{asset.asset_code} • {asset.manufacturer} {asset.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2.5 text-[11px] font-semibold text-gray-300">
                      <div className="flex flex-col">
                        <span>{asset.department}</span>
                        <span className="text-[10px] font-mono text-gray-500 mt-0.5 uppercase">{asset.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-2.5">
                      {getStatusBadge(asset.status)}
                    </td>
                    <td className="px-6 py-2.5">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${
                           asset.status === 'maintenance' ? 'bg-amber-500' : 'bg-cyan-500/30'
                         }`}></div>
                         <span className={`text-[11px] font-mono font-bold ${
                           asset.status === 'maintenance' ? 'text-amber-500 underline underline-offset-4' : 'text-gray-400'
                         }`}>
                           {asset.next_maintenance_date}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                         <button className="p-1.5 hover:bg-white/10 rounded border border-transparent hover:border-white/10 transition-all text-gray-500 hover:text-cyan-400" title="Lịch sử">
                           <History size={14} />
                         </button>
                         <button className="p-1.5 hover:bg-white/10 rounded border border-transparent hover:border-white/10 transition-all text-gray-500 hover:text-amber-400" title="Kiểm định">
                           <ShieldCheck size={14} />
                         </button>
                         <button className="p-1.5 hover:bg-white/10 rounded border border-transparent hover:border-white/10 transition-all text-gray-500 hover:text-white">
                           <MoreVertical size={14} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-3 border-t border-white/5 flex justify-between items-center text-[10px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
             <div>ĐANG HIỂN THỊ 3 / 1,248 THIẾT BỊ</div>
             <div className="flex gap-2">
               <button className="px-3 py-1 border border-white/5 rounded bg-white/5 hover:bg-white/10 opacity-50 cursor-not-allowed transition-colors">TRƯỚC</button>
               <button className="px-3 py-1 border border-white/10 rounded bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors">SAU</button>
             </div>
          </div>
        </div>
      </div>

      {/* Asset Inspector Side-panel */}
      <div className={`fixed top-16 right-0 bottom-0 w-[400px] bg-[#0f0f18] border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-40 transition-transform duration-300 transform ${selectedAsset ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedAsset && (
          <div className="h-full flex flex-col font-sans">
            <div className="p-5 border-b border-white/5 bg-black/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded border border-cyan-500/20 text-cyan-400">
                  <Package size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-tight leading-none">Thông số thiết bị</h2>
                  <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-widest">{selectedAsset.asset_code}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAsset(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/5">
              {/* Asset Header Info */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-black text-white leading-tight uppercase">{selectedAsset.asset_name}</h3>
                  <button className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-400">
                    <ExternalLink size={16} />
                  </button>
                </div>
                {getStatusBadge(selectedAsset.status)}
              </div>

              {/* Technical Specifications Area */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Thông số Kỹ thuật & Master Data</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">Model / Loại</p>
                    <p className="text-[12px] font-bold text-white uppercase">{selectedAsset.model}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">Nhà sản xuất</p>
                    <p className="text-[12px] font-bold text-white uppercase">{selectedAsset.manufacturer}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">Phòng ban</p>
                    <p className="text-[12px] font-bold text-white uppercase">{selectedAsset.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">Vị trí lắp đặt</p>
                    <p className="text-[12px] font-bold text-white uppercase">{selectedAsset.location}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Status */}
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:border-cyan-500/30 transition-all group">
                  <div className="p-2 bg-cyan-400/10 rounded border border-cyan-400/20 text-cyan-400">
                    <Wrench size={14} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[11px] font-bold text-white">Yêu cầu bảo trì</span>
                    <span className="text-[9px] font-medium text-gray-500">Tạo phiếu công tác mới</span>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:border-amber-500/30 transition-all group">
                  <div className="p-2 bg-amber-400/10 rounded border border-amber-400/20 text-amber-400">
                    <Shield size={14} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[11px] font-bold text-white">Lịch sử kiểm định</span>
                    <span className="text-[9px] font-medium text-gray-500">Xem hồ sơ pháp lý</span>
                  </div>
                </button>
              </div>

              {/* Lifecycle Info */}
              <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-4">
                 <div className="flex gap-4 items-center">
                   <Clock className="text-cyan-400/40" size={24} />
                   <div>
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Bảo trì gần nhất</p>
                     <p className="text-xs font-mono font-bold text-white">12/01/2026 - ĐÃ HOÀN TẤT</p>
                   </div>
                 </div>
                 <div className="flex gap-4 items-center">
                   <FileText className="text-cyan-400/40" size={24} />
                   <div>
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hồ sơ thiết bị</p>
                     <p className="text-xs font-mono font-bold text-cyan-400 underline cursor-pointer">DOC_CNC01_MANUAL.PDF</p>
                   </div>
                 </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/5 bg-black/20 flex gap-2">
              <button className="flex-1 py-2.5 bg-cyan-500 text-[#0a0a0f] rounded-lg text-[11px] font-bold uppercase font-mono shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                Chi tiết đầy đủ
              </button>
              <button className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[11px] font-bold uppercase transition-all hover:bg-white/10">
                In nhãn
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentList;
