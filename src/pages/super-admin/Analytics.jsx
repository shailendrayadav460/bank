import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Users, Clock, CheckCircle, TrendingUp, ChevronDown, Download,
  Search, Bell, LayoutGrid, BookOpen, HeartPulse, CheckSquare, 
  BarChart2, FileText, Settings, LogOut, Crown, Award
} from 'lucide-react';

/* ── Static Data ────────────────────────────────────────────── */
const ENGAGEMENT_DATA = [
  { label: 'M1', val: 95, type: 'LEARN' },
  { label: 'M2', val: 88, type: 'LEARN' },
  { label: 'T1', val: 82, type: 'TRAIN' },
  { label: 'M3', val: 76, type: 'LEARN' },
  { label: 'T2', val: 70, type: 'TRAIN' },
  { label: 'M4', val: 65, type: 'LEARN' },
  { label: 'T3', val: 58, type: 'TRAIN' },
  { label: 'M5', val: 52, type: 'LEARN' },
  { label: 'T4', val: 45, type: 'TRAIN' },
  { label: 'T5', val: 38, type: 'TRAIN' },
];

const STACKED_DATA = [
  { label: 'M1', fail: 15, pass: 85, h: 120 },
  { label: 'M2', fail: 20, pass: 80, h: 110 },
  { label: 'M3', fail: 25, pass: 75, h: 130 },
  { label: 'M4', fail: 35, pass: 65, h: 90 },
  { label: 'M5', fail: 40, pass: 60, h: 100 },
  { label: 'T1', fail: 10, pass: 90, h: 140 },
  { label: 'T2', fail: 30, pass: 70, h: 115 },
];

const TOP_USERS = [
  { rank: '#1', name: 'Sarah Jenkins', avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FEuropean%2F2', modules: '10 / 10', score: '98.5%', time: '45h 20m', badge: 'crown', color: '#f59e0b' },
  { rank: '#2', name: 'Michael Omondi', avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FAfrican%2F1', modules: '10 / 10', score: '96.0%', time: '42h 15m', badge: 'crown', color: '#9ca3af' },
  { rank: '#3', name: 'Elena Rodriguez', avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FHispanic%2F3', modules: '9 / 10', score: '94.2%', time: '38h 45m', badge: 'crown', color: '#b45309' },
  { rank: '#4', name: 'David Chen', avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F18-25%2FEast%20Asian%2F4', modules: '9 / 10', score: '92.8%', time: '35h 10m', badge: 'award', color: 'muted' },
  { rank: '#5', name: 'Priya Patel', avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F35-50%2FSouth%20Asian%2F5', modules: '8 / 10', score: '91.5%', time: '31h 05m', badge: 'award', color: 'muted' },
];

/* ── Component ─────────────────────────────────────────────── */
const Analytics = () => {
  const { theme: T } = useTheme();
  const [timeRange, setTimeRange] = useState('30D');

  /* Colors */
  const ACCENT = T.primary;
  const PURPLE = '#8b5cf6';
  const SUCCESS = '#10b981';
  const DANGER = '#ef4444';
  const WARNING = '#f97316';

  /* Styles */
  const cardStyle = {
    backgroundColor: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 200ms ease',
  };

  const cardHover = (e) => {
    e.currentTarget.style.boxShadow = `0 0 20px rgba(27, 111, 222, 0.08)`;
  };
  const cardLeave = (e) => {
    e.currentTarget.style.boxShadow = 'none';
  };

  const btnOutline = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: `1px solid ${ACCENT}`,
    color: ACCENT,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  };

  const tableHeaderStyle = {
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: T.textSub,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '16px 24px',
    borderBottom: `1px solid ${T.border}`,
    background: T.activeNav,
  };

  const tableCellStyle = {
    padding: '16px 24px',
    borderBottom: `1px solid ${T.border}`,
    fontSize: 14,
    color: T.text,
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>

      {/* ── Page Header Actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.text }}>
          Analytics Overview
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 180,
            backgroundColor: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px', cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color={T.textSub} />
              <span style={{ fontSize: 14, color: T.text }}>Last 30 Days</span>
            </div>
            <ChevronDown size={14} color={T.textSub} />
          </div>
          <button style={btnOutline}>
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* ── ROW 1: KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        <div style={cardStyle} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ color: T.textSub, fontWeight: 500, fontSize: 14 }}>Total Active Users</div>
            <div style={{ width: 36, height: 36, background: 'rgba(27, 111, 222, 0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color={ACCENT} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: T.text }}>2,481</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: SUCCESS }}>
              <TrendingUp size={14} /> 12%
            </div>
          </div>
        </div>

        <div style={cardStyle} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ color: T.textSub, fontWeight: 500, fontSize: 14 }}>Total Study Hours</div>
            <div style={{ width: 36, height: 36, background: 'rgba(139, 92, 246, 0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color={PURPLE} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: T.text }}>14,208</div>
            <div style={{ fontSize: 13, color: T.textSub, fontWeight: 500 }}>this week</div>
          </div>
        </div>

        <div style={{ ...cardStyle, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
          <div>
            <div style={{ color: T.textSub, fontWeight: 500, fontSize: 14, marginBottom: 12 }}>Overall Completion Rate</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: T.text }}>78%</div>
            </div>
          </div>
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke={T.border} strokeWidth="6" />
              <circle cx="32" cy="32" r="28" fill="none" stroke={ACCENT} strokeWidth="6" strokeDasharray="175.9" strokeDashoffset="38.7" strokeLinecap="round" transform="rotate(-90 32 32)" />
            </svg>
          </div>
        </div>

        <div style={cardStyle} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ color: T.textSub, fontWeight: 500, fontSize: 14 }}>Average Quiz Score</div>
            <div style={{ width: 36, height: 36, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={20} color={SUCCESS} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: T.text }}>82.4%</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: SUCCESS }}>
              <TrendingUp size={14} /> 3.1%
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Wide Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24 }}>
        {/* Daily Active Users Line Chart */}
        <div style={cardStyle} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Daily Active Users</div>
            <div style={{ display: 'inline-flex', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: 2 }}>
              {['7D', '30D', '90D'].map(r => (
                <div
                  key={r}
                  onClick={() => setTimeRange(r)}
                  style={{
                    padding: '4px 12px', fontSize: 12, fontWeight: 600, borderRadius: 4, cursor: 'pointer',
                    background: timeRange === r ? T.card : 'transparent',
                    color: timeRange === r ? T.text : T.textSub,
                    boxShadow: timeRange === r ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                  }}
                >
                  {r}
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ height: 240, width: '100%', position: 'relative', paddingTop: 10, display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 40, left: '60%', transform: 'translateX(-50%)', background: T.card, border: `1px solid ${T.border}`, padding: '8px 12px', borderRadius: 6, zIndex: 10 }}>
              <div style={{ fontSize: 12, color: T.textSub, marginBottom: 4 }}>Oct 24</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <div style={{ width: 6, height: 6, background: ACCENT, borderRadius: '50%' }} /> New: 142
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, background: T.textSub, borderRadius: '50%' }} /> Returning: 890
              </div>
            </div>

            <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <line x1="40" y1="20" x2="600" y2="20" stroke={T.border} strokeDasharray="4" />
              <line x1="40" y1="70" x2="600" y2="70" stroke={T.border} strokeDasharray="4" />
              <line x1="40" y1="120" x2="600" y2="120" stroke={T.border} strokeDasharray="4" />
              <line x1="40" y1="170" x2="600" y2="170" stroke={T.border} />

              <text x="30" y="25" fill={T.textSub} fontSize="11" textAnchor="end">1k</text>
              <text x="30" y="75" fill={T.textSub} fontSize="11" textAnchor="end">750</text>
              <text x="30" y="125" fill={T.textSub} fontSize="11" textAnchor="end">500</text>
              <text x="30" y="175" fill={T.textSub} fontSize="11" textAnchor="end">0</text>

              <path d="M40,150 C100,140 160,110 220,130 C280,150 340,90 400,60 C460,30 520,80 600,40" fill="none" stroke={ACCENT} strokeWidth="3" />
              <path d="M40,160 C100,165 160,150 220,155 C280,160 340,140 400,120 C460,100 520,110 600,90" fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />

              <circle cx="400" cy="60" r="5" fill={T.card} stroke={ACCENT} strokeWidth="2" />
              <line x1="400" y1="60" x2="400" y2="170" stroke={T.border} strokeDasharray="4" />
            </svg>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 40, marginTop: 8, fontSize: 11, color: T.textSub }}>
              <span>Oct 1</span><span>Oct 8</span><span>Oct 15</span><span>Oct 22</span><span>Oct 29</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.textSub }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT }} /> New Users
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.textSub }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', border: `2px dashed ${ACCENT}`, background: 'transparent' }} /> Returning Users
            </div>
          </div>
        </div>

        {/* Module Engagement Bar Chart */}
        <div style={cardStyle} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Module Engagement</div>
            <div style={{ fontSize: 12, color: T.textSub }}>% Completion</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ENGAGEMENT_DATA.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ width: 30, fontSize: 12, fontWeight: 500, color: T.textSub }}>{item.label}</span>
                <div style={{ flex: 1, height: 8, background: T.border, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${item.val}%`, height: '100%', borderRadius: 4, background: item.type === 'LEARN' ? ACCENT : PURPLE }} />
                </div>
                <span style={{ width: 32, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>{item.val}%</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.textSub }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT }} /> LEARN
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.textSub }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: PURPLE }} /> TRAIN
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Three Columns Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {/* Stacked Bar Chart */}
        <div style={cardStyle} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 16 }}>Quiz Performance by Module</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, paddingTop: 20, borderBottom: `1px solid ${T.border}` }}>
            {STACKED_DATA.map((item) => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 20, height: item.h, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
                  <div style={{ background: DANGER, width: '100%', height: `${item.fail}%`, opacity: 0.8 }} />
                  <div style={{ background: ACCENT, width: '100%', height: `${item.pass}%` }} />
                </div>
                <div style={{ fontSize: 11, color: T.textSub, textAlign: 'center', marginTop: 8, width: 20 }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 16 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.textSub }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT }} /> Pass
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.textSub }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: DANGER, opacity: 0.8 }} /> Fail
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div style={cardStyle} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 24, textAlign: 'center' }}>User Role Breakdown</div>
          <div style={{ width: 140, height: 140, borderRadius: '50%', background: `conic-gradient(${ACCENT} 0% 55%, ${SUCCESS} 55% 85%, ${WARNING} 85% 100%)`, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
            <div style={{ content: '""', width: 90, height: 90, background: T.card, borderRadius: '50%', position: 'absolute' }} />
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: T.text }}>2.4k</span>
              <span style={{ fontSize: 11, color: T.textSub }}>Total Users</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24, padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.textSub }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT }} /> Students</div>
              <span style={{ fontWeight: 600, fontSize: 13, color: T.text }}>55%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.textSub }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: SUCCESS }} /> Admins</div>
              <span style={{ fontWeight: 600, fontSize: 13, color: T.text }}>30%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.textSub }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: WARNING }} /> Doctors</div>
              <span style={{ fontWeight: 600, fontSize: 13, color: T.text }}>15%</span>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div style={cardStyle} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 24, textAlign: 'center' }}>Device Usage</div>
          <div style={{ width: 140, height: 140, borderRadius: '50%', background: `conic-gradient(${ACCENT} 0% 72%, ${PURPLE} 72% 100%)`, margin: '0 auto' }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: T.text }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT }} /> iOS
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: T.text }}>72%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: T.text }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: PURPLE }} /> Android
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: T.text }}>28%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 4: Table ── */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 0 24px', marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Top Performing Users</div>
          <div style={{ color: ACCENT, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View All</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
          <thead>
            <tr>
              <th style={{ ...tableHeaderStyle, width: 80 }}>Rank</th>
              <th style={tableHeaderStyle}>User</th>
              <th style={tableHeaderStyle}>Modules Completed</th>
              <th style={tableHeaderStyle}>Quiz Score Avg</th>
              <th style={tableHeaderStyle}>Time Spent</th>
              <th style={tableHeaderStyle}>Badge</th>
            </tr>
          </thead>
          <tbody>
            {TOP_USERS.map((u, i) => (
              <tr 
                key={i} 
                style={{ 
                  background: i === 0 ? T.primaryBg : 'transparent',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = T.cardHover }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = i === 0 ? T.primaryBg : 'transparent' }}
              >
                <td style={tableCellStyle}>
                  <div style={{ fontSize: i < 3 ? 16 : 15, fontWeight: i < 3 ? 700 : 600, color: i < 3 ? T.text : T.textSub }}>{u.rank}</div>
                </td>
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={u.avatar} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ fontWeight: i < 3 ? 600 : 500 }}>{u.name}</div>
                  </div>
                </td>
                <td style={tableCellStyle}>{u.modules}</td>
                <td style={tableCellStyle}>
                  <span style={{ color: i < 2 ? SUCCESS : T.text, fontWeight: 600 }}>{u.score}</span>
                </td>
                <td style={tableCellStyle}>{u.time}</td>
                <td style={{ ...tableCellStyle, borderBottom: i === TOP_USERS.length - 1 ? 'none' : `1px solid ${T.border}` }}>
                  {u.badge === 'crown' ? (
                    <Crown size={20} style={{ color: u.color }} />
                  ) : (
                    <Award size={20} style={{ color: T.textSub }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Analytics;
