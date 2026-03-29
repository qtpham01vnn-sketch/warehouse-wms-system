import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { planService } from '../../services/planService';
import { approvalService } from '../../services/approvalService';
import { FileText, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './Dashboard.css';

const AnimatedNumber = ({ value }: { value: number | undefined }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === undefined) return;
    const duration = 1000; // 1 second animation
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(easeProgress * value));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return <>{displayValue}</>;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [planStats, setPlanStats] = useState({ totalActive: 0, pendingApprovals: 0, healthScore: 0 });
  const [approvalsData, setApprovalsData] = useState<any[]>([]);

  // Mock data for Plan Progress Trend (Vanguard feature)
  const planProgressData = [
    { month: 'T1', value: 30 },
    { month: 'T2', value: 45 },
    { month: 'T3', value: 40 },
    { month: 'T4', value: 65 },
    { month: 'T5', value: 85 },
    { month: 'T6', value: 75 },
    { month: 'T7', value: 98 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [m, c, a, act] = await Promise.all([
          dashboardService.getISOMetrics(),
          dashboardService.getISOChartData(),
          dashboardService.getExpiryAlerts(),
          dashboardService.getRecentActivity()
        ]);
        setMetrics(m);
        setChartData(c);
        setAlerts(a);
        setActivities(act);

        // Fetch Core Workflow Data
        const deptPlans = planService.getDepartmentPlans();
        const companyPlans = planService.getCompanyPlans();
        const pendingPlansList = approvalService.getAllPendingPlans();
        
        const totalPlans = deptPlans.length + companyPlans.length;
        const pendingCount = pendingPlansList.length;

        // Calculate a hybrid Health Score (Plan Progress + ISO Compliance)
        const isoScore = m?.totalDocs > 0 ? (m.activeDocs / m.totalDocs) * 100 : 90;
        const healthScore = Math.floor((isoScore * 0.4) + (85 * 0.6)); // Mock 85% base plan progress 
        
        setPlanStats({
          totalActive: totalPlans || 12, // fallback for demo
          pendingApprovals: pendingCount,
          healthScore: healthScore
        });

        // Donut Chart logic for Approvals
        const approved = deptPlans.filter(p => p.status === 'approved').length || 15;
        const pending = pendingCount || 4;
        const rejected = deptPlans.filter(p => p.status === 'rejected' || p.status === 'revision').length || 2;
        
        setApprovalsData([
          { name: 'Đã duyệt', value: approved, color: '#10B981' }, // emerald
          { name: 'Chờ duyệt', value: pending, color: '#F59E0B' }, // amber
          { name: 'Sửa/Hủy', value: rejected, color: '#F43F5E' }  // rose
        ]);

      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center"><p className="text-muted animate-pulse">Đang tải dữ liệu ISO...</p></div>;
  }

  return (
    <div className="dashboard-page animate-fade-in custom-scrollbar">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title text-gradient">Trung tâm Điều hành WorkFlow Pro</h1>
          <p className="text-muted mt-1">Giám sát Kế hoạch Mục tiêu & Quản trị Tuân thủ ISO 9001</p>
        </div>
        <div className="actions flex gap-2">
          <button className="btn btn-primary shadow-glow" onClick={() => navigate('/documents')}>Vào kho tài liệu</button>
        </div>
      </div>

      <div className="bento-dashboard-grid pb-6 pt-2">
        {/* ROW 1 */}
        {/* 1. Health Score */}
        <div className="bento-card glass col-span-3 health-score-container text-center">
            <h3 className="bento-title absolute top-4 left-4 m-0"><Activity size={18} className="text-emerald icon-glow"/> Sức khỏe C.Ty</h3>
            <div className="health-score-value mt-6">
               <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-[3px] border-emerald/20 shadow-[0_0_40px_rgba(16,185,129,0.15)] bg-white/5">
                   {/* Cool SVG Gauge */}
                   <svg className="absolute w-[120%] h-[120%] -rotate-90 pointer-events-none">
                      <circle cx="50%" cy="50%" r="42%" fill="none" stroke="url(#emeraldGradient)" strokeWidth="8" strokeDasharray="300" strokeDashoffset={300 - (300 * planStats.healthScore / 100)} className="transition-all duration-1000" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                   </svg>
                   <div className="flex flex-col items-center">
                      <span className="health-number text-4xl"><AnimatedNumber value={planStats.healthScore} /></span>
                   </div>
               </div>
               <span className="health-label mt-5 text-xs text-muted font-semibold tracking-widest">Năng suất & Tuân thủ</span>
            </div>
        </div>

        {/* 2. KPIs (Pills) */}
        <div className="col-span-9 kpi-row-nested">
            <div className="kpi-pill glow-primary">
                <span className="kpi-title">Kế hoạch đang chạy</span>
                <span className="kpi-val text-indigo"><AnimatedNumber value={planStats.totalActive} /></span>
            </div>
            <div className="kpi-pill glow-warning">
                <span className="kpi-title">Tờ trình Chờ duyệt</span>
                <span className="kpi-val text-amber"><AnimatedNumber value={planStats.pendingApprovals} /></span>
            </div>
            <div className="kpi-pill glow-success">
                <span className="kpi-title">Tổng Tài liệu ISO</span>
                <span className="kpi-val text-emerald"><AnimatedNumber value={metrics?.totalDocs} /></span>
            </div>
            <div className="kpi-pill glow-danger border-rose/30">
                <span className="kpi-title text-rose/70">Cảnh báo Tuân thủ</span>
                <span className="kpi-val text-rose"><AnimatedNumber value={metrics?.overdueDocs + metrics?.nearExpiryDocs} /></span>
            </div>
        </div>

        {/* ROW 2 & 3: CENTER CORE */}
        {/* Plan Trend Area Chart */}
        <div className="bento-card glass col-span-6 row-span-2">
           <h3 className="bento-title mb-6"><Activity size={18} className="text-indigo icon-glow"/> Tốc độ Hoàn thành Mục tiêu</h3>
           <div className="flex-1 min-h-[220px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={planProgressData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ background: 'rgba(15, 15, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}/>
                    <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
               </ResponsiveContainer>
           </div>
        </div>

        {/* Approvals Donut Chart */}
        <div className="bento-card col-span-3 row-span-2">
           <h3 className="bento-title mb-2"><CheckCircle size={18} className="text-amber icon-glow"/> Luồng Phê duyệt</h3>
           <div className="flex-1 min-h-[220px] pb-4">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={approvalsData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {approvalsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                 </Pie>
                 <Tooltip contentStyle={{ background: 'rgba(15, 15, 26, 0.9)', border: 'none', borderRadius: '12px' }}/>
                 <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* ROW 2, 3, 4: RIGHT SIDEBAR (Spans 3 rows) */}
        <div className="bento-card glass" style={{ gridRow: '2 / span 3', gridColumn: '10 / span 3' }}>
            <h3 className="bento-title"><AlertTriangle size={18} className="text-rose icon-glow"/> Hộp Thư Khẩn (Action)</h3>
            <div className="flex flex-col gap-2 mb-6 custom-scrollbar pr-1">
                {planStats.pendingApprovals > 0 && (
                    <div className="action-box yellow">
                       <div>
                         <p className="action-title">{planStats.pendingApprovals} Tờ trình</p>
                         <p className="action-meta">Chờ Giám đốc phê duyệt</p>
                       </div>
                       <button className="btn btn-sm btn-outline-warning text-[10px] py-1 px-2" onClick={() => navigate('/approvals')}>Duyệt ngay</button>
                    </div>
                )}
                {alerts.slice(0, 2).map(a => (
                    <div key={a.id} className="action-box red">
                       <div>
                         <p className="action-title max-w-[120px] truncate">[{a.docCode}] {a.name}</p>
                         <p className="action-meta text-xs mt-1">Sắp quá hạn soát xét</p>
                       </div>
                       <button className="btn btn-sm btn-outline-danger text-[10px] py-1 px-2" onClick={() => navigate('/documents')}>Xử lý</button>
                    </div>
                ))}
            </div>
            
            <h3 className="bento-title border-t border-white/5 pt-4"><Activity size={18} className="text-emerald icon-glow"/> Dòng thời gian</h3>
            <div className="timeline-feed overflow-y-auto flex-1 custom-scrollbar pr-2 mt-2" style={{ maxHeight: '280px' }}>
                 {activities.length === 0 ? (
                    <p className="text-muted text-sm text-center">Chưa có thông báo</p>
                 ) : activities.map(activity => (
                     <div key={activity.id} className="timeline-item">
                         <img src={activity.user.avatar} className="timeline-avatar" alt="Avatar"/>
                         <div className="timeline-content">
                             <p className="m-0"><strong className="text-primary">{activity.user.name}</strong> {activity.actionText}</p>
                             <p className="text-info text-xs mt-1 truncate">{activity.targetText}</p>
                             <span className="timeline-time mt-2 block">{activity.timeText}</span>
                         </div>
                     </div>
                 ))}
            </div>
        </div>

        {/* ROW 4 */}
        <div className="bento-card col-span-4" style={{ gridColumn: '1 / span 4', gridRow: '4' }}>
           <h3 className="bento-title mb-0"><FileText size={18} className="text-success icon-glow"/> Kho Tài liệu ISO</h3>
           <div className="flex-1 min-h-[160px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                       {chartData.map((e,i) => <Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(15, 15, 26, 0.9)', border: 'none', borderRadius: '12px' }}/>
                    <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
               </ResponsiveContainer>
           </div>
        </div>
        
        <div className="bento-card glass col-span-5" style={{ gridColumn: '5 / span 5', gridRow: '4' }}>
           <h3 className="bento-title"><AlertTriangle size={18} className="text-primary icon-glow"/> Nhật ký Kiểm toán (Audit Log)</h3>
           <div className="text-muted text-sm leading-relaxed overflow-y-auto custom-scrollbar h-full pr-2">
             <p className="mb-2">Hệ thống đang tích cực đồng bộ trạng thái thực thi của <strong>{planStats.totalActive} Kế hoạch</strong> và sự tuân thủ <strong>ISO 9001</strong>.</p>
             <p className="text-xs border-l-2 border-emerald pl-2 py-1 bg-emerald/5 rounded-r">🚀 Engine WorkFlow Pro hoạt động mượt mà.</p>
             {metrics?.overdueDocs > 0 && <p className="text-xs border-l-2 border-rose pl-2 py-1 bg-rose/5 rounded-r mt-2">⚠️ Cảnh báo: Phát hiện {metrics.overdueDocs} tài liệu vỡ deadline soát xét.</p>}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
