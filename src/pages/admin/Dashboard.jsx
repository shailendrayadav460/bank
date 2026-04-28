import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, HeartPulse, CheckCircle2, 
  ArrowUpRight, TrendingUp, GraduationCap,
  Activity, Clock, ChevronRight
} from 'lucide-react';

/* ─── Optimized Sub-Components ─────────────────────────────────── */
const StatCard = React.memo(({ label, icon, value, footer, T }) => (
  <div 
    className="group transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-500" 
    style={{ 
      backgroundColor: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      boxShadow: T.shadow,
      padding: '16px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 8 
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = T.primary;
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, fontWeight: 800, color: T.textSub, letterSpacing: '1px', textTransform: 'uppercase' }}>
      {label}
      <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: 22, fontWeight: 800, color: T.text, lineHeight: 1.2 }}>{value}</div>
    <div style={{ fontSize: 10, fontWeight: 700 }}>{footer}</div>
  </div>
));

StatCard.displayName = 'StatCard';

const AdminDashboard = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();

  const DOT = useMemo(() => ({
    green: T.success,
    blue: T.primary,
    red: T.danger,
  }), [T]);

  const bars = useMemo(() => [
    { label: 'Mon', h: 40 },
    { label: 'Tue', h: 65 },
    { label: 'Wed', h: 45 },
    { label: 'Thu', h: 80 },
    { label: 'Fri', h: 55 },
    { label: 'Sat', h: 90 },
    { label: 'Sun', h: 70 },
  ], []);

  const patientActivities = useMemo(() => [
    { type: 'green', text: 'Maria Garcia completed "ECG Basics"', time: '2h ago' },
    { type: 'blue', text: 'New Case assigned: #CAS-1024', time: '4h ago' },
    { type: 'green', text: 'James Wilson finished "Chest Leads"', time: '5h ago' },
    { type: 'red', text: 'Urgent Review: Alex Mercer', time: '14:30' },
  ], []);

  return (
    <div className="flex flex-col gap-6 font-['DM_Sans',_sans-serif] antialiased" style={{ color: T.text }}>
      
      {/* ── Greeting ── */}
      <div className="animate-in fade-in slide-in-from-left duration-700">
        <h2 className="text-xl sm:text-2xl font-black mb-1">
          Good morning, <span style={{ color: T.primary }}>Dr. {user?.first_name || 'Ankit'}</span> 👋
        </h2>
        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest" style={{ color: T.textSub }}>
          Clinical Performance Overview
        </p>
      </div>

      {/* ── Stat Cards Grid (Responsive) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          label="My Patients" icon={<Users size={18} />} value="124" T={T}
          footer={<span style={{ color: T.success }}>+8% this month</span>}
        />
        <StatCard 
          label="Module Reads" icon={<BookOpen size={18} />} value="458" T={T}
          footer={<span style={{ color: T.success }}>+12% total</span>}
        />
        <StatCard 
          label="Training Live" icon={<GraduationCap size={18} />} value="12" T={T}
          footer={<span style={{ color: T.textSub }}>Sessions active</span>}
        />
        <StatCard 
          label="Active Cases" icon={<HeartPulse size={18} />} value="18" T={T}
          footer={<span style={{ color: T.textSub }}>Urgent review: 02</span>}
        />
        <StatCard 
          label="Avg Accuracy" icon={<CheckCircle2 size={18} />} value="74.2%" T={T}
          footer={<span style={{ color: T.success }}>+3.1% improved</span>}
        />
      </div>

      {/* ── Main Dashboard Layout (Responsive) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Impact Panel */}
        <div className="xl:col-span-2 border rounded-2xl p-6 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-700" style={{ backgroundColor: T.card, borderColor: T.border }}>
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black uppercase tracking-tight">Educational Impact</h3>
              <Link to="/admin/patients" className="text-xs font-black uppercase tracking-widest hover:underline" style={{ color: T.primary }}>Full Report</Link>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                 <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2" style={{ color: T.textSub }}><GraduationCap size={14} /> Training Mastery</div>
                 {[
                   { label: 'ECG Basics', pct: 88, patients: '94' },
                   { label: 'Chest Leads', pct: 64, patients: '42' },
                   { label: 'Arrhythmias', pct: 41, patients: '28' }
                 ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-xs font-bold">
                          <span style={{ color: T.text }}>{item.label}</span>
                          <span style={{ color: T.textSub }}>{item.patients} Pts</span>
                       </div>
                       <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: T.bg }}>
                          <div className="h-full" style={{ backgroundColor: T.primary, width: `${item.pct}%` }} />
                       </div>
                    </div>
                 ))}
              </div>
              <div className="space-y-5">
                 <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2" style={{ color: T.textSub }}><HeartPulse size={14} /> Case Performance</div>
                 {[
                   { label: 'Reviewed', val: '12', color: T.success },
                   { label: 'Pending', val: '04', color: T.warning },
                   { label: 'Critical', val: '02', color: T.danger }
                 ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b last:border-none" style={{ borderColor: T.border }}>
                       <span className="text-xs font-bold uppercase" style={{ color: T.textSub }}>{item.label}</span>
                       <span className="text-sm font-black" style={{ color: item.color }}>{item.val}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Activity Feed */}
        <div className="border rounded-2xl p-6 shadow-sm flex flex-col animate-in fade-in slide-in-from-right duration-700" style={{ backgroundColor: T.card, borderColor: T.border }}>
           <h3 className="text-sm font-black uppercase tracking-tight mb-6">Recent Activity</h3>
           <div className="flex-1 space-y-5">
              {patientActivities.map((act, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: DOT[act.type] }} />
                    <div>
                       <div className="text-[12px] font-bold leading-tight" style={{ color: T.text }}>{act.text}</div>
                       <div className="text-[10px] font-black uppercase mt-1 tracking-widest" style={{ color: T.textSub }}>{act.time}</div>
                    </div>
                 </div>
              ))}
           </div>
           <button className="mt-6 w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors" style={{ backgroundColor: T.bg, color: T.textSub }} onMouseEnter={(e) => e.currentTarget.style.color = T.primary} onMouseLeave={(e) => e.currentTarget.style.color = T.textSub}>View All Logs</button>
        </div>

      </div>

      {/* ── Weekly Status (Responsive) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
         <div className="border rounded-2xl p-6 shadow-sm" style={{ backgroundColor: T.card, borderColor: T.border }}>
            <h3 className="text-sm font-black uppercase tracking-tight mb-8 flex items-center gap-2"><TrendingUp size={16} style={{ color: T.primary }} /> Weekly Patient Load</h3>
            <div className="h-48 flex items-end justify-between gap-2 px-4">
               {bars.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                     <div className="w-full max-w-[40px] rounded-t-lg transition-all" style={{ height: `${bar.h}%`, backgroundColor: T.primary }} onMouseEnter={(e) => e.currentTarget.style.opacity = 0.8} onMouseLeave={(e) => e.currentTarget.style.opacity = 1} />
                     <span className="text-[10px] font-black uppercase" style={{ color: T.textSub }}>{bar.label}</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-around gap-8" style={{ backgroundColor: T.card, borderColor: T.border }}>
            <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-lg" style={{ background: `conic-gradient(${T.success} 0% 60%, ${T.primary} 60% 85%, ${T.danger} 85% 100%)` }}>
               <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-inner" style={{ backgroundColor: T.card }}>
                  <span className="text-2xl font-black">124</span>
                  <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Total Pts</span>
               </div>
            </div>
            <div className="space-y-4 w-full md:w-auto">
               {[
                 { color: T.success, label: 'Stable', val: '60%' },
                 { color: T.primary, label: 'Monitoring', val: '25%' },
                 { color: T.danger, label: 'Critical', val: '15%' }
               ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                     <div className="w-3 h-3 rounded-md" style={{ backgroundColor: item.color }} />
                     <span className="text-xs font-bold w-20" style={{ color: T.textSub }}>{item.label}</span>
                     <span className="text-xs font-black">{item.val}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
