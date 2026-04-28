import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Calendar as CalendarIcon, Clock, User, 
  ChevronLeft, ChevronRight, Plus, MoreHorizontal,
  CheckCircle2, AlertCircle, Phone, Video
} from 'lucide-react';

/* ── Mock Appointments ────────────────────────────────────────── */
const MOCK_APPOINTMENTS = [
  { id: 1, patient: 'Maria Garcia', type: 'Clinical Review', time: '09:30 AM', status: 'Confirmed', priority: 'Normal' },
  { id: 2, patient: 'James Wilson', type: 'Post-MI Follow-up', time: '11:00 AM', status: 'Pending', priority: 'High' },
  { id: 3, patient: 'Casey Smith', type: 'ECG Interpretation', time: '02:30 PM', status: 'Confirmed', priority: 'Normal' },
  { id: 4, patient: 'Alex Mercer', type: 'Initial Screening', time: '04:00 PM', status: 'Confirmed', priority: 'Low' },
];

const AdminAppointments = () => {
  const { theme: T } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const cardStyle = (extra = {}) => ({
    backgroundColor: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: '24px',
    boxShadow: T.shadow,
    ...extra,
  });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: T.text, marginBottom: 4 }}>Appointments</h2>
          <p style={{ fontSize: 14, color: T.textSub, fontWeight: 500 }}>Manage your clinical schedule and patient consultations.</p>
        </div>
        <button style={{ 
          padding: '12px 24px', 
          borderRadius: 12, 
          backgroundColor: T.primary, 
          color: '#fff', 
          border: 'none', 
          fontSize: 14, 
          fontWeight: 700, 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: `0 4px 12px ${T.primary}40`
        }}>
          <Plus size={18} /> Schedule Appointment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        
        {/* ── Main: Agenda View ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={cardStyle({ padding: 0 })}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Today's Agenda</div>
                  <div style={{ fontSize: 12, color: T.textSub }}>Wednesday, April 22, 2026</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ p: 8, border: `1px solid ${T.border}`, borderRadius: 8, backgroundColor: T.bg, cursor: 'pointer', color: T.text }}><ChevronLeft size={16} /></button>
                <button style={{ p: 8, border: `1px solid ${T.border}`, borderRadius: 8, backgroundColor: T.bg, cursor: 'pointer', color: T.text }}><ChevronRight size={16} /></button>
              </div>
            </div>

            <div style={{ padding: '8px 0' }}>
              {MOCK_APPOINTMENTS.map((app, i) => (
                <div key={app.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 20, 
                  padding: '20px 24px', 
                  borderBottom: i < MOCK_APPOINTMENTS.length - 1 ? `1px solid ${T.border}` : 'none',
                  transition: '0.2s',
                  cursor: 'pointer'
                }}>
                  <div style={{ width: 80, fontSize: 13, fontWeight: 700, color: T.primary }}>{app.time}</div>
                  <div style={{ width: 2, height: 40, backgroundColor: app.priority === 'High' ? '#EF4444' : T.border, borderRadius: 1 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 2 }}>{app.patient}</div>
                    <div style={{ fontSize: 12, color: T.textSub }}>{app.type}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ 
                      padding: '6px 12px', 
                      borderRadius: 8, 
                      fontSize: 11, 
                      fontWeight: 800, 
                      backgroundColor: app.status === 'Confirmed' ? '#10B98115' : '#F59E0B15',
                      color: app.status === 'Confirmed' ? '#10B981' : '#F59E0B',
                      textTransform: 'uppercase'
                    }}>{app.status}</div>
                    <button style={{ p: 8, background: 'none', border: 'none', color: T.textSub, cursor: 'pointer' }}><MoreHorizontal size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sidebar: Calendar & Stats ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Mini Calendar Placeholder View */}
          <div style={cardStyle()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: T.text }}>April 2026</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <ChevronLeft size={16} style={{ color: T.textSub, cursor: 'pointer' }} />
                <ChevronRight size={16} style={{ color: T.textSub, cursor: 'pointer' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, textAlign: 'center' }}>
              {['S','M','T','W','T','F','S'].map((d, i) => <span key={`${d}-${i}`} style={{ fontSize: 10, fontWeight: 800, color: T.textSub }}>{d}</span>)}
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const isToday = day === 22;
                return (
                  <div key={i} style={{ 
                    height: 32, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: 12, 
                    fontWeight: 700,
                    borderRadius: 8,
                    backgroundColor: isToday ? T.primary : 'transparent',
                    color: isToday ? '#fff' : T.text,
                    cursor: 'pointer'
                  }}>{day}</div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={cardStyle({ backgroundColor: T.primary, color: '#fff' })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Clock size={20} opacity={0.8} />
              <span style={{ fontSize: 14, fontWeight: 700 }}>Schedule Summary</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ opacity: 0.8 }}>Total Consultations</span>
                <span style={{ fontWeight: 800 }}>12</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ opacity: 0.8 }}>Pending Reviews</span>
                <span style={{ fontWeight: 800 }}>04</span>
              </div>
              <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.2)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ opacity: 0.8 }}>Next: Maria Garcia</span>
                <span style={{ fontWeight: 800 }}>09:30 AM</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAppointments;
