import { useTheme } from '../../context/ThemeContext';
import {
  GraduationCap, BookOpen, Clock, Target,
  CheckCircle2, AlertCircle, TrendingUp, Users
} from 'lucide-react';

/* ─── Static Data ───────────────────────────────────────────── */
const trainingStats = [
  { label: 'Avg. Completion Rate', value: '74%', icon: <Target size={20} />, trend: '+5.2%', color: '#3b82f6' },
  { label: 'Active Students', value: '1,284', icon: <Users size={20} />, trend: '+12%', color: '#10b981' },
  { label: 'Avg. Time / Session', value: '1h 24m', icon: <Clock size={20} />, trend: '+2.1%', color: '#f59e0b' },
  { label: 'Training Hours', value: '458h', icon: <Clock size={20} />, trend: '+18.4%', color: '#8b5cf6' },
];

const trainingModules = [
  { name: 'ECG Standardization', learners: 450, avgTime: '45m', status: 'Active', trend: 'up' },
  { name: 'Lead Reversal Training', learners: 320, avgTime: '1h 10m', status: 'Active', trend: 'down' },
  { name: 'Heart Rate Calc Module', learners: 280, avgTime: '30m', status: 'Active', trend: 'up' },
  { name: 'Vector Simulator Session', learners: 210, avgTime: '2h 15m', status: 'Active', trend: 'up' },
  { name: 'Chest Lead Placement', learners: 156, avgTime: '55m', status: 'Warning', trend: 'down' },
];

const studentPerformance = [
  { name: 'John Doe', module: 'Vector Sim', status: 'Completed', timeSpent: '2h 15m', date: '2 hours ago' },
  { name: 'Jane Smith', module: 'Heart Rate Calc', status: 'Completed', timeSpent: '3h 10m', date: '4 hours ago' },
  { name: 'Dr. Mike Ross', module: 'Lead Reversal', status: 'In Progress', timeSpent: '1h 45m', date: '5 hours ago' },
  { name: 'Sarah Wilson', module: 'Chest Leads', status: 'Completed', timeSpent: '2h 50m', date: 'Yesterday' },
];

/* ─── Component ─────────────────────────────────────────────── */
const TrainingDashboard = () => {
  const { theme: T } = useTheme();

  const card = (extra = {}) => ({
    backgroundColor: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    boxShadow: T.shadow,
    ...extra,
  });

  const PanelHeader = ({ title, action }) => (
    <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 16, fontWeight: 600, color: T.text }}>{title}</span>
      {action && (
        <button style={{ fontSize: 13, color: T.primary, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
          {action}
        </button>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', gap: 24, minHeight: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 4 }}>
          Training
        </h2>
        <p style={{ fontSize: 14, color: T.textSub }}>
          Monitor and analyze training performance across all modules and students.
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {trainingStats.map((s, i) => (
          <div key={i} style={card({ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: `${s.color}20`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>{s.trend}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, color: T.textSub, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: T.text }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>

        {/* Module Performance Table */}
        <div style={card({ display: 'flex', flexDirection: 'column' })}>
          <PanelHeader title="Training Module Performance" action="View All Modules" />
          <div style={{ padding: '0 24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: `1px solid ${T.border}` }}>
                  <th style={{ padding: '16px 0', fontSize: 13, fontWeight: 600, color: T.textSub }}>Module Name</th>
                  <th style={{ padding: '16px 0', fontSize: 13, fontWeight: 600, color: T.textSub }}>Learners</th>
                  <th style={{ padding: '16px 0', fontSize: 13, fontWeight: 600, color: T.textSub }}>Avg. Time</th>
                  <th style={{ padding: '16px 0', fontSize: 13, fontWeight: 600, color: T.textSub }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {trainingModules.map((mod, i) => (
                  <tr key={i} style={{ borderBottom: i < trainingModules.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                    <td style={{ padding: '16px 0', fontSize: 14, color: T.text, fontWeight: 500 }}>{mod.name}</td>
                    <td style={{ padding: '16px 0', fontSize: 14, color: T.text }}>{mod.learners}</td>
                    <td style={{ padding: '16px 0', fontSize: 14, color: T.text }}>{mod.avgTime}</td>
                    <td style={{ padding: '16px 0' }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '4px 8px', borderRadius: 4,
                        backgroundColor: mod.status === 'Active' ? `${T.success}20` : mod.status === 'Warning' ? `${T.warning}20` : `${T.danger}20`,
                        color: mod.status === 'Active' ? T.success : mod.status === 'Warning' ? T.warning : T.danger,
                      }}>
                        {mod.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Student Activity */}
        <div style={card({ display: 'flex', flexDirection: 'column' })}>
          <PanelHeader title="Recent Student Activity" action="Export Data" />
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {studentPerformance.map((student, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: T.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.primary }}>{student.name[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{student.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.success }}>{student.timeSpent}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: T.textSub }}>{student.module} • {student.status}</span>
                    <span style={{ fontSize: 12, color: T.textSub }}>{student.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Chart Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={card({ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={18} style={{ color: T.primary }} />
            <span style={{ fontSize: 16, fontWeight: 600, color: T.text }}>Engagement Over Time</span>
          </div>
          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            {[30, 45, 35, 60, 55, 80, 75, 90, 85, 100].map((h, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: `${T.primary}40`, height: `${h}%`, borderRadius: '4px 4px 0 0' }} />
            ))}
          </div>
        </div>

        <div style={card({ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={18} style={{ color: T.primary }} />
            <span style={{ fontSize: 16, fontWeight: 600, color: T.text }}>Module Popularity</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Vector Simulator', 'Arrhythmias', 'ECG Standardization', 'Heart Rate Calc'].map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, color: T.text, width: 80 }} className="truncate" title={label}>{label}</span>
                <div style={{ flex: 1, height: 8, backgroundColor: T.bg, borderRadius: 4 }}>
                  <div style={{ width: `${90 - i * 15}%`, height: '100%', backgroundColor: T.primary, borderRadius: 4 }} />
                </div>
                <span style={{ fontSize: 13, color: T.textSub }}>{90 - i * 15}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default TrainingDashboard;
