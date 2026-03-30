import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  unit?: string;
  color?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'gray';
  statusLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon, 
  trend, 
  unit,
  color = 'cyan',
  statusLabel 
}) => {
  const colorMap = {
    cyan: 'text-cyan-400 border-cyan-500/10 shadow-cyan-500/5 bg-cyan-500/5',
    purple: 'text-purple-400 border-purple-500/10 shadow-purple-500/5 bg-purple-500/5',
    emerald: 'text-emerald-400 border-emerald-500/10 shadow-emerald-500/5 bg-emerald-500/5',
    amber: 'text-amber-400 border-amber-500/10 shadow-amber-500/5 bg-amber-500/5',
    rose: 'text-rose-400 border-rose-500/10 shadow-rose-500/5 bg-rose-500/5',
    gray: 'text-gray-400 border-gray-500/10 shadow-gray-500/5 bg-gray-500/5',
  };

  return (
    <div className={`hud-card p-4 h-full flex flex-col group transition-all duration-300 hover:scale-[1.02] ${colorMap[color]}`}>
      {/* Decorative Background Element */}
      <div className="absolute right-0 top-0 w-24 h-24 -mr-8 -mt-8 bg-current opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.06] transition-opacity"></div>
      
      <div className="flex justify-between items-center mb-3 relative z-10">
        <div className="flex flex-col">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] font-mono leading-none mb-1">
            {label}
          </p>
          {statusLabel && (
            <div className="flex items-center gap-1.5">
              <div className={`w-1 h-1 rounded-full bg-current animate-pulse`}></div>
              <span className="text-[9px] font-bold uppercase tracking-wider font-mono opacity-80">{statusLabel}</span>
            </div>
          )}
        </div>
        <div className={`p-1.5 rounded-md bg-white/5 border border-white/10 text-current`}>
          {React.cloneElement(icon as React.ReactElement, { size: 16 })}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1.5 mt-auto relative z-10">
        <span className="text-3xl font-bold font-mono tracking-tighter text-white leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-[11px] font-bold font-mono text-gray-500 uppercase tracking-widest translate-y-[-2px]">
            {unit}
          </span>
        )}
      </div>
      
      {trend && (
        <div className="mt-3 flex items-center justify-between relative z-10 pt-3 border-t border-white/5">
          <span className={`text-[10px] font-bold font-mono ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.positive ? '▲' : '▼'} {trend.value}
          </span>
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Hiệu suất 24h</span>
        </div>
      )}
      
      {/* Tactical visual footer */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-30"></div>
    </div>
  );
};

export default StatCard;
