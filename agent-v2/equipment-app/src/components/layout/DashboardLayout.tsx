import React, { type ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  Settings, 
  Bell, 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  Database,
  Layers,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';

export type ViewType = 'dashboard' | 'inventory' | 'maintenance' | 'parts' | 'alerts';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, count }) => (
  <div 
    onClick={onClick}
    className={`group flex items-center justify-between px-4 py-2.5 mx-2 my-0.5 cursor-pointer rounded-lg transition-all duration-150 border-l-2 ${
      active 
        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-bold shadow-[0_0_15px_rgba(0,240,255,0.05)]' 
        : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`${active ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`}>
        {React.cloneElement(icon as React.ReactElement, { size: 18 })}
      </div>
      <span className="text-[13px] font-medium tracking-tight whitespace-nowrap">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {count !== undefined && count > 0 && (
        <span className="bg-rose-500/10 text-rose-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-500/20 font-mono">
          {count}
        </span>
      )}
      {active && <ChevronRight size={14} className="text-cyan-400/50" />}
    </div>
  </div>
);

interface DashboardLayoutProps {
  children: ReactNode;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentView, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#08080c] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar - Compact & Tactical */}
      <aside className="fixed left-0 top-0 w-[220px] h-screen bg-[#0f0f18] border-r border-white/5 z-50 flex flex-col shadow-2xl">
        <div className="h-16 flex items-center px-6 border-b border-white/5 flex-shrink-0 bg-black/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tighter text-white font-mono uppercase leading-tight">VANGUARD <span className="text-cyan-400">EMS</span></span>
              <span className="text-[9px] font-mono text-cyan-500/60 uppercase tracking-[0.2em] leading-none mt-0.5">Asset Protocol v2</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/5">
          <div className="px-6 mb-3">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-none">Vận hành</p>
          </div>
          <nav className="space-y-0.5">
            <SidebarItem 
              icon={<LayoutDashboard />} 
              label="Tổng quan" 
              active={currentView === 'dashboard'} 
              onClick={() => onNavigate('dashboard')}
            />
            <SidebarItem 
              icon={<Package />} 
              label="Danh mục thiết bị" 
              active={currentView === 'inventory'} 
              onClick={() => onNavigate('inventory')}
            />
            <SidebarItem 
              icon={<Wrench />} 
              label="Bảo trì & Bảo dưỡng" 
              active={currentView === 'maintenance'}
              onClick={() => onNavigate('maintenance')}
            />
            <SidebarItem 
              icon={<Layers />} 
              label="Kho phụ tùng" 
              active={currentView === 'parts'}
              onClick={() => onNavigate('parts')}
              count={5}
            />
             <SidebarItem 
              icon={<Bell />} 
              label="Trung tâm cảnh báo" 
              active={currentView === 'alerts'}
              onClick={() => onNavigate('alerts')}
              count={12}
            />
          </nav>

          <div className="px-6 mt-8 mb-3">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-none">Hệ thống</p>
          </div>
          <nav className="space-y-0.5">
            <SidebarItem icon={<ShieldCheck />} label="Hiệu chuẩn & Kiểm định" />
            <SidebarItem icon={<TrendingUp />} label="Theo dõi Chi phí" />
            <SidebarItem icon={<Settings />} label="Cài đặt hệ thống" />
          </nav>
        </div>

        {/* User Profile - Bottom Section */}
        <div className="p-4 bg-black/10 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2 py-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <User size={16} className="text-cyan-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">Administrator</span>
              <span className="text-[9px] font-mono text-gray-500 uppercase">Super User</span>
            </div>
            <LogOut size={14} className="ml-auto text-gray-600 group-hover:text-rose-500 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Top Header - Ultra Compact */}
      <header className="fixed top-0 left-[220px] right-0 h-16 bg-[#0f0f18]/90 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm thiết bị, mã tài sản, linh kiện..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-[12px] focus:outline-none focus:border-cyan-500/50 transition-all font-mono placeholder:text-gray-600"
            />
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex flex-col">
            <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-none">Module hiện tại</h2>
            <span className="text-sm font-bold text-white lowercase first-letter:uppercase mt-1">
              {currentView === 'dashboard' ? 'Tổng quan hệ thống' : 
               currentView === 'inventory' ? 'Quản lý tài sản' : 
               currentView === 'maintenance' ? 'Lịch trình bảo trì' :
               currentView === 'parts' ? 'Tồn kho linh kiện' : 'Thông báo cảnh báo'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-tighter">Hệ thống: Online</span>
          </div>
          
          <div className="h-8 w-px bg-white/10"></div>
          
          <div className="relative p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-all group" onClick={() => onNavigate('alerts')}>
            <Bell size={18} className={currentView === 'alerts' ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'} />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded flex items-center justify-center border-2 border-[#0f0f18] font-mono leading-none">12</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-[220px] pt-16 min-h-screen bg-[#08080c] transition-all">
        <div className="p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
