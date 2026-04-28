import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  BookOpen, Search, Filter, 
  ChevronRight, Play, CheckCircle2,
  Clock, Users, BarChart2, Star
} from 'lucide-react';

const AdminLearning = () => {
  const { theme: T } = useTheme();
  
  const [search, setSearch] = useState('');

  const modules = [
    { 
      id: 1, 
      title: 'Clinical ECG Fundamentals', 
      description: 'Understanding the electrochemical basis of the heart\'s conduction system.',
      category: 'Basic',
      enrollment: 142,
      completion: 85,
      rating: 4.8,
      duration: '4h 20m'
    },
    { 
      id: 2, 
      title: 'Arrhythmia Management', 
      description: 'Comprehensive guide to identifying and treating various cardiac arrhythmias.',
      category: 'Advanced',
      enrollment: 98,
      completion: 72,
      rating: 4.9,
      duration: '6h 45m'
    },
    { 
      id: 3, 
      title: 'Ischemic Heart Disease', 
      description: 'Detecting ST-segment changes and localizing myocardial infarction.',
      category: 'Intermediate',
      enrollment: 115,
      completion: 60,
      rating: 4.7,
      duration: '5h 15m'
    },
    { 
      id: 4, 
      title: 'Pediatric ECG Interpretation', 
      description: 'Key differences between adult and pediatric cardiac conduction patterns.',
      category: 'Specialized',
      enrollment: 45,
      completion: 30,
      rating: 4.6,
      duration: '3h 30m'
    },
  ];

  const cardStyle = (extra = {}) => ({
    backgroundColor: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 20,
    padding: '24px',
    boxShadow: T.shadow,
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    ...extra,
  });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: T.text, marginBottom: 8 }}>Learning Management</h2>
          <p style={{ fontSize: 15, color: T.textSub, fontWeight: 500 }}>Monitor and manage clinical training modules for your medical staff and students.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.textSub }} />
            <input 
              type="text" 
              placeholder="Search modules..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                padding: '12px 16px 12px 44px', 
                borderRadius: 14, 
                border: `1px solid ${T.border}`, 
                backgroundColor: T.inputBg, 
                color: T.text,
                fontSize: 14,
                width: 300,
                outline: 'none'
              }} 
            />
          </div>
          <button style={{ padding: '12px 20px', borderRadius: 14, backgroundColor: T.card, border: `1px solid ${T.border}`, color: T.text, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {[
          { label: 'Active Modules', value: '12', icon: <BookOpen size={20} />, color: T.primary },
          { label: 'Total Enrolled', value: '1,248', icon: <Users size={20} />, color: '#10B981' },
          { label: 'Completion Rate', value: '78%', icon: <CheckCircle2 size={20} />, color: '#8B5CF6' },
          { label: 'Avg. Rating', value: '4.8', icon: <Star size={20} />, color: '#F59E0B' },
        ].map((stat, i) => (
          <div key={i} style={cardStyle({ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px' })}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>{stat.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.textSub, textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
        {modules.map(mod => (
          <div key={mod.id} style={cardStyle()} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = T.shadow;
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ padding: '4px 12px', borderRadius: 20, backgroundColor: T.primaryBg, color: T.primary, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {mod.category}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B', fontSize: 13, fontWeight: 700 }}>
                <Star size={14} fill="#F59E0B" /> {mod.rating}
              </div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 8 }}>{mod.title}</h3>
            <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.5, marginBottom: 24, height: 42, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {mod.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, padding: '16px', backgroundColor: T.bg, borderRadius: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.textSub, textTransform: 'uppercase', marginBottom: 4 }}>Duration</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} /> {mod.duration}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.textSub, textTransform: 'uppercase', marginBottom: 4 }}>Completion</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}><BarChart2 size={14} /> {mod.completion}%</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, color: T.textSub, fontWeight: 600 }}>
                <strong style={{ color: T.text }}>{mod.enrollment}</strong> Students
              </div>
              <button style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.primary, color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminLearning;
