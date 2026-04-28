import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lmsService from '../../services/lmsService';
import { useTheme } from '../../context/ThemeContext';
import { BookOpen, PlayCircle, ClipboardCheck, ArrowRight, Book } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Courses() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme: T } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      const data = await lmsService.getChapters();
      setChapters(data);
    } catch (err) {
      toast.error('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: T.textSub }}>
      Loading Learning Modules...
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto', animation: 'fadeUp 0.6s ease-out' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 8, letterSpacing: '-0.5px' }}>
          Learning <span style={{ color: T.primary }}>Modules</span>
        </h1>
        <p style={{ color: T.textSub, fontSize: 14 }}>Master ECG diagnostics with our comprehensive curriculum.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            style={{
              backgroundColor: T.card,
              borderRadius: 24,
              padding: '1.75rem',
              border: `1px solid ${T.border}`,
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: T.shadow
            }}
            className="course-card"
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12, backgroundColor: `${T.primary}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.primary, marginBottom: 20
            }}>
              <Book size={24} />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 12, lineHeight: 1.4 }}>
              {chapter.title}
            </h3>

            <div style={{ display: 'flex', gap: 16, marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.textSub }}>
                <PlayCircle size={14} /> {chapter.units_count || 0} Units
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.textSub }}>
                <ClipboardCheck size={14} /> {chapter.quiz_count || 0} Quiz
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: 12 }}>
              <button
                onClick={() => navigate(`/student/course/${chapter.id}`)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 12, border: 'none',
                  backgroundColor: T.primary, color: '#fff', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                Learn Now <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate(`/student/quiz/${chapter.id}`)}
                style={{
                  padding: '10px 16px', borderRadius: 12, border: `1px solid ${T.border}`,
                  backgroundColor: T.bg, color: T.text, fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}
              >
                Quiz
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .course-card:hover { transform: translateY(-8px); border-color: ${T.primary}50; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
