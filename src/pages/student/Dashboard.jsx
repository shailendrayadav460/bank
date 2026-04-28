import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Clock, TrendingUp, Trophy, ArrowRight, PlayCircle } from 'lucide-react';
import lmsService from '../../services/lmsService';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await lmsService.getChapters();
      setChapters(data.slice(0, 3)); // show first 3
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const ACCENT = '#f59e0b';

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', animation: 'fadeUp 0.6s ease-out' }}>
      
      {/* Welcome Section */}
      <div style={{ display: 'flex', flexDirection: 'column', md: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 48 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 8, letterSpacing: '-0.5px' }}>
            Welcome back, <span style={{ color: ACCENT }}>{user?.first_name || 'Student'}</span>!
          </h1>
          <p style={{ color: T.textSub, fontSize: 15, fontWeight: 500 }}>You're doing great! You completed 65% of your total curriculum.</p>
        </div>
        
        <div style={{ 
          backgroundColor: T.card, border: `1px solid ${T.border}`, padding: '16px 24px', borderRadius: 24, 
          display: 'flex', alignItems: 'center', gap: 20, boxShadow: T.shadow 
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: `${ACCENT}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT }}>
            <Trophy size={24} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.textSub, textTransform: 'uppercase', letterSpacing: 1 }}>Overall Progress</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <div style={{ width: 120, height: 6, backgroundColor: T.bg, borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', backgroundColor: ACCENT }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: T.text }}>65%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <h2 style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <BookOpen size={20} color={ACCENT} /> Recommended Modules
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
        {loading ? [1,2,3].map(i => <div key={i} style={{ height: 200, backgroundColor: T.card, borderRadius: 24, animate: 'pulse' }} />) : (
          chapters.map((ch) => (
            <div 
              key={ch.id} 
              style={{
                backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 28, padding: '2rem',
                display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', cursor: 'pointer',
                boxShadow: T.shadow
              }}
              className="dash-card"
              onClick={() => navigate(`/student/course/${ch.id}`)}
            >
              <div style={{ 
                height: 140, borderRadius: 20, backgroundColor: T.bg, marginBottom: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: `${ACCENT}30`,
                border: `1px solid ${T.border}`
              }}>
                <PlayCircle size={48} />
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 8, lineHeight: 1.3 }}>{ch.title}</h3>
              <p style={{ color: T.textSub, fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
                  Master the fundamentals and clinical applications of this module with interactive simulations.
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {ch.units_count || 0} Lessons
                  </div>
                  <button style={{ 
                    display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', 
                    color: T.text, fontSize: 13, fontWeight: 800, cursor: 'pointer' 
                  }}>
                    Resume <ArrowRight size={16} color={ACCENT} />
                  </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .dash-card:hover { transform: translateY(-8px); border-color: ${ACCENT}30; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
