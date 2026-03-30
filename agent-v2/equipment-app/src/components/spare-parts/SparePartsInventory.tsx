import React, { useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  Search, 
  Plus, 
  MoreVertical,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronRight,
  Filter
} from 'lucide-react';
import type { SparePart } from '../../types';

const mockParts: SparePart[] = [
  {
    id: '1',
    part_code: 'FLT-OIL-01',
    part_name: 'Bộ lọc dầu công nghiệp (Lớn)',
    description: 'Bộ lọc dầu thủy lực áp suất cao cho hệ thống CNC.',
    quantity: 45,
    unit_cost: 312000,
    min_threshold: 10,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    part_code: 'BRG-X92',
    part_name: 'Vòng bi chính xác X-Axis',
    description: 'Vòng bi trục chính cho máy Haas dòng VF.',
    quantity: 4,
    unit_cost: 2150000,
    min_threshold: 5,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    part_code: 'OIL-H5-G',
    part_name: 'Dầu thủy lực (5 Gal)',
    description: 'Chất lỏng thủy lực thông dụng Grade 5.',
    quantity: 12,
    unit_cost: 2850000,
    min_threshold: 4,
    created_at: new Date().toISOString()
  }
];

const SparePartsInventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Module Header */}
      <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-mono">KHO PHỤ TÙNG & VẬT TƯ</h1>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mt-1">Quản lý tồn kho & Chuỗi cung ứng vận hành</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[11px] font-bold hover:bg-white/10 transition-all font-mono uppercase tracking-wider text-gray-400 hover:text-white">
            <ShoppingCart size={16} />
            Đặt hàng vật tư
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-[#0a0a0f] rounded-lg text-[11px] font-bold hover:bg-cyan-400 transition-all font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Plus size={16} />
            Thêm linh kiện
          </button>
        </div>
      </div>

      {/* Inventory Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="hud-card p-4 flex items-center gap-4 bg-white/[0.01]">
           <div className="p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-400">
              <Layers size={18} />
           </div>
           <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none font-mono mb-1.5">Tổng mã linh kiện</p>
              <p className="text-xl font-bold font-mono tracking-tighter">148 SKU</p>
           </div>
        </div>
        <div className="hud-card p-4 flex items-center gap-4 bg-white/[0.01] border-l-amber-500/30">
           <div className="p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-500">
              <AlertTriangle size={18} />
           </div>
           <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none font-mono mb-1.5">Tồn kho thấp</p>
              <p className="text-xl font-bold font-mono tracking-tighter text-amber-500">12 CẢNH BÁO</p>
           </div>
        </div>
        <div className="hud-card p-4 flex items-center gap-4 bg-white/[0.01]">
           <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
              <ArrowDownToLine size={18} />
           </div>
           <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none font-mono mb-1.5">Nhập kho (30 ngày)</p>
              <p className="text-xl font-bold font-mono tracking-tighter text-emerald-400">542 ĐƠN VỊ</p>
           </div>
        </div>
        <div className="hud-card p-4 flex items-center gap-4 bg-white/[0.01]">
           <div className="p-2.5 bg-rose-500/10 rounded-lg border border-rose-500/20 text-rose-400">
              <ArrowUpFromLine size={18} />
           </div>
           <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none font-mono mb-1.5">Xuất kho (30 ngày)</p>
              <p className="text-xl font-bold font-mono tracking-tighter text-rose-400">218 ĐƠN VỊ</p>
           </div>
        </div>
      </div>

      {/* Parts Table */}
      <div className="hud-card overflow-hidden bg-white/[0.01]">
        <div className="p-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
              <input 
                type="text" 
                placeholder="Tìm kiếm linh kiện theo mã, tên hoặc mô tả..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-[11px] focus:outline-none focus:border-cyan-500/50 transition-all font-mono placeholder:text-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
               <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold font-mono text-gray-500 hover:text-white transition-all uppercase tracking-wider">
                <Filter size={12} />
                Lọc kho
              </button>
            </div>
        </div>
        
        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-mono">Thông tin linh kiện</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-mono">Mức tồn kho</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-mono text-right">Đơn giá</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-mono text-center">Tình trạng</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-mono text-center">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockParts.map((part) => (
                <tr key={part.id} className="group hover:bg-cyan-500/[0.02] transition-all cursor-pointer">
                  <td className="px-6 py-2.5">
                    <div className="flex items-center gap-4">
                       <div className="p-2 bg-white/5 rounded border border-white/10 text-gray-500 group-hover:text-cyan-400 transition-colors">
                          <Package size={16} />
                       </div>
                       <div>
                          <p className="text-[13px] font-bold group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{part.part_name}</p>
                          <p className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-widest mt-0.5">{part.part_code}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-2.5">
                    <div className="flex items-center gap-3 w-48">
                       <span className="text-[11px] font-mono font-bold text-white w-8">{part.quantity}</span>
                       <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${part.quantity <= part.min_threshold ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-cyan-500 shadow-[0_0_8px_#00f0ff]'}`} style={{ width: `${Math.min((part.quantity/100)*100, 100)}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-2.5 text-right font-mono font-bold text-[12px] text-cyan-400">
                    {part.unit_cost.toLocaleString('vi-VN')} Đ
                  </td>
                  <td className="px-6 py-2.5 text-center">
                    {part.quantity <= part.min_threshold ? (
                       <span className="badge badge-warning">TỒN THẤP</span>
                    ) : (
                       <span className="badge badge-active">TỐT</span>
                    )}
                  </td>
                  <td className="px-6 py-2.5">
                    <div className="flex items-center justify-center gap-1.5">
                       <button className="p-1.5 hover:bg-white/10 rounded border border-transparent hover:border-white/10 transition-all text-gray-500 hover:text-cyan-400" title="Chi tiết">
                         <ChevronRight size={14} />
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
      </div>
    </div>
  );
};

export default SparePartsInventory;
