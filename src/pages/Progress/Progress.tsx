import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { planService } from '../../services/planService';
import type { PlanTask, TaskStatus, DepartmentPlan } from '../../types';
import { Clock, CheckCircle, Activity, Target, Zap, ChevronDown, ChevronRight, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
import './Progress.css';

const Progress: React.FC = () => {
  const { currentUser } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Group tasks by department
  const { allTasks, deptStats, rawPlans } = useMemo(() => {
    const plans = planService.getDepartmentPlans();
    const tasks: PlanTask[] = [];
    const stats: Record<string, { total: number; completed: number; progressAvg: number, tasks: PlanTask[] }> = {};

    plans.forEach(p => {
      if (!stats[p.departmentId]) {
        stats[p.departmentId] = { total: 0, completed: 0, progressAvg: 0, tasks: [] };
      }
      
      if (p.tasks) {
        tasks.push(...p.tasks);
        stats[p.departmentId].tasks.push(...p.tasks);
        stats[p.departmentId].total += p.tasks.length;
        stats[p.departmentId].completed += p.tasks.filter(t => t.status === 'completed').length;
      }
    });

    // Calculate averages
    Object.keys(stats).forEach(deptId => {
       const deptInfo = stats[deptId];
       if (deptInfo.total > 0) {
         const totalProg = deptInfo.tasks.reduce((sum, t) => sum + t.progress, 0);
         deptInfo.progressAvg = Math.round(totalProg / deptInfo.total);
       } else {
         deptInfo.progressAvg = 0;
       }
    });

    return { allTasks: tasks, deptStats: stats, rawPlans: plans };
  }, [refreshKey]);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
     const init: Record<string, boolean> = {};
     Object.keys(deptStats).forEach(k => init[k] = true);
     return init;
  });

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus, newProgress: number) => {
    const plans = planService.getDepartmentPlans();
    for (const plan of plans) {
      if (!plan.tasks) continue;
      const taskIdx = plan.tasks.findIndex(t => t.id === taskId);
      if (taskIdx > -1) {
        plan.tasks[taskIdx].status = newStatus;
        plan.tasks[taskIdx].progress = newProgress;
        planService.saveDepartmentPlan(plan);
        setRefreshKey(k => k + 1);
        break;
      }
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'urgent') return <span className="inline-block px-3 py-1 bg-error/20 text-error border border-error/30 rounded-full text-[10px] font-bold tracking-widest uppercase">Khẩn cấp</span>;
    if (priority === 'high') return <span className="inline-block px-3 py-1 bg-warning/20 text-warning border border-warning/30 rounded-full text-[10px] font-bold tracking-widest uppercase">Cao</span>;
    return <span className="inline-block px-3 py-1 bg-info/20 text-info border border-info/30 rounded-full text-[10px] font-bold tracking-widest uppercase">Trung bình</span>;
  };

  const getStatusBadge = (status: TaskStatus) => {
    if (status === 'completed') return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success border border-success/30 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(16,185,129,0.2)]"><CheckCircle size={12}/> Hoàn thành</span>;
    if (status === 'in_progress') return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary border border-primary/40 rounded-full text-[10px] font-bold tracking-widest uppercase"><Activity size={12}/> Đang làm</span>;
    if (status === 'overdue') return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-error/10 text-error border border-error/30 rounded-full text-[10px] font-bold tracking-widest uppercase"><Clock size={12}/> Quá hạn</span>;
    return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 text-muted border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase">Chưa bắt đầu</span>;
  };

  const toggleGroup = (deptId: string) => {
    setExpandedGroups(prev => ({ ...prev, [deptId]: !prev[deptId] }));
  };

  return (
    <div className="progress-page animate-fade-in relative h-full flex flex-col pt-2">
       <div className="page-header mb-8 pl-2 pr-4 flex-between">
        <div>
          <h1 className="page-title text-gradient">Tiến độ (Hybrid Dashboard)</h1>
          <p className="text-muted mt-2 text-sm font-mono tracking-wide">Tổng quan tiến độ thực thi mục tiêu của từng Đơn vị tác chiến.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-8 px-2">
        
        {/* Top Section: Lovable Progress Cards */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.keys(deptStats).map(deptId => {
               const stats = deptStats[deptId];
               let barColor = 'bg-primary';
               let glowColor = 'shadow-[0_0_15px_var(--color-primary)]';
               if (stats.progressAvg >= 100) { barColor = 'bg-success'; glowColor = 'shadow-[0_0_15px_var(--color-success)]'; }
               else if (stats.progressAvg < 30 && stats.total > 0) { barColor = 'bg-error'; glowColor = 'shadow-[0_0_15px_rgba(239,68,68,0.5)]'; }

               return (
                 <div key={deptId} className="glass-panel p-6 rounded-[20px] border border-white/10 hover:border-primary/40 transition-all group relative overflow-hidden bg-black/40 shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]">
                   <div className="flex justify-between items-end mb-4 relative z-10">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">{deptId}</h3>
                      </div>
                      <span className={`text-xl font-bold font-mono ${stats.progressAvg >= 100 ? 'text-success' : 'text-primary'}`}>{stats.progressAvg}%</span>
                   </div>
                   
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex mb-4 relative z-10">
                      <div className={`h-full transition-all duration-1000 ease-out ${barColor} ${glowColor}`} style={{ width: `${stats.progressAvg}%` }}></div>
                   </div>
                   
                   <div className="flex gap-4 text-[10px] font-mono text-muted uppercase tracking-widest relative z-10">
                      <span>Tổng: <span className="text-white">{stats.total}</span></span>
                      <span>Xong: <span className="text-success">{stats.completed}</span></span>
                   </div>
                 </div>
               );
            })}
          </div>
        </div>

        {/* Bottom Section: Lovable Task List Accordions */}
        <div className="space-y-6">
           {Object.keys(deptStats).map(deptId => {
              const tasks = deptStats[deptId].tasks;
              const isExpanded = expandedGroups[deptId];

              return (
                <div key={deptId} className="glass-panel overflow-hidden border border-white/10 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                   {/* Header Row (Toggle) */}
                   <div 
                      className="flex items-center gap-3 p-4 bg-black/40 cursor-pointer hover:bg-white/5 transition-colors border-b border-transparent hover:border-white/5"
                      onClick={() => toggleGroup(deptId)}
                   >
                      <div className="text-primary">
                        {isExpanded ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                      </div>
                      <h3 className="font-bold text-white text-sm tracking-wide flex-1 uppercase">{deptId} - Chi tiết công việc</h3>
                   </div>

                   {/* Content List */}
                   {isExpanded && (
                     <div className="divide-y divide-white/5">
                        {tasks.length === 0 ? (
                          <div className="p-6 text-center text-muted italic text-sm">Chưa có đầu việc nào.</div>
                        ) : (
                          tasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group cursor-pointer">
                               
                               <div className="flex-1 min-w-0 pr-6">
                                  <h4 className="font-bold text-white text-sm mb-1 group-hover:text-primary transition-colors">{task.title}</h4>
                                  <div className="text-[10px] text-muted font-mono uppercase tracking-widest">
                                     <span className="text-white/60">{task.assigneeId}</span>
                                     <span className="mx-2">•</span>
                                     <span>Hạn: {format(new Date(task.deadline), 'yyyy-MM-dd')}</span>
                                  </div>
                               </div>

                               <div className="flex items-center gap-6 shrink-0">
                                  {getPriorityBadge(task.priority)}
                                  {getStatusBadge(task.status)}
                                  
                                  {/* Inline Progress Update */}
                                  <div className="w-32 flex items-center gap-3">
                                     <span className="text-[10px] font-mono font-bold text-primary w-8 text-right">{task.progress}%</span>
                                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex cursor-pointer" onClick={(e) => {
                                        // Quick advance by 25% hack for testing
                                        e.stopPropagation();
                                        const nextProg = task.progress >= 100 ? 0 : Math.min(task.progress + 25, 100);
                                        const nextStatus = nextProg === 100 ? 'completed' : nextProg > 0 ? 'in_progress' : 'not_started';
                                        updateTaskStatus(task.id, nextStatus as TaskStatus, nextProg);
                                     }}>
                                        <div className={`h-full transition-all duration-300 ${task.progress === 100 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${task.progress}%` }}></div>
                                     </div>
                                  </div>
                               </div>

                            </div>
                          ))
                        )}
                     </div>
                   )}
                </div>
              );
           })}
        </div>

      </div>
    </div>
  );
};

export default Progress;
