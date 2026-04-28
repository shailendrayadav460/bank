import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lmsService from '../../services/lmsService';
import { useTheme } from '../../context/ThemeContext';
import { ChevronLeft, CheckCircle, Lock, Play, FileText, Image as ImageIcon, Video, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function CourseDetail() {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const { theme: T } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadChapter();
  }, [id]);

  const loadChapter = async () => {
    try {
      const data = await lmsService.getChapters(); // Simplified for now
      const current = data.find(c => c.id === parseInt(id));
      
      // Need a proper Detail API to get Units with content
      const detailed = await lmsService.getUnit(current.units[0]?.id || 1); // Mocking first unit loading
      
      setChapter(current);
      if (current.units?.length > 0) {
          loadUnit(current.units[0].id);
      }
    } catch (err) {
      toast.error('Failed to load module details.');
    } finally {
      setLoading(false);
    }
  };

  const loadUnit = async (unitId) => {
      try {
          const unitData = await lmsService.getUnit(unitId);
          setSelectedUnit(unitData);
      } catch (err) {
          toast.error('Failed to load unit content.');
      }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: T.textSub }}>Loading Content...</div>;
  if (!chapter) return <div style={{ padding: 40, textAlign: 'center' }}>Chapter not found.</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: T.bg, animation: 'fadeIn 0.4s ease' }}>
      
      {/* Sidebar: Unit List */}
      <div style={{
          width: 320, borderRight: `1px solid ${T.border}`, backgroundColor: T.card,
          display: 'flex', flexDirection: 'column', overflowY: 'auto'
      }}>
          <div style={{ padding: '24px 20px', borderBottom: `1px solid ${T.border}` }}>
              <button 
                onClick={() => navigate('/student/courses')}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: T.primary, fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}
              >
                  <ChevronLeft size={16} /> Back to Modules
              </button>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: T.text, lineHeight: 1.3 }}>{chapter.title}</h2>
          </div>

          <div style={{ flex: 1, padding: '12px 0' }}>
              {chapter.units?.map((unit, index) => (
                  <div 
                    key={unit.id}
                    onClick={() => loadUnit(unit.id)}
                    style={{
                        padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                        backgroundColor: selectedUnit?.id === unit.id ? `${T.primary}10` : 'transparent',
                        borderLeft: `4px solid ${selectedUnit?.id === unit.id ? T.primary : 'transparent'}`,
                        transition: 'all 0.2s'
                    }}
                  >
                      <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: selectedUnit?.id === unit.id ? T.primary : `${T.textSub}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: selectedUnit?.id === unit.id ? '#fff' : T.textSub }}>
                          {index + 1}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: selectedUnit?.id === unit.id ? 700 : 500, color: selectedUnit?.id === unit.id ? T.text : T.textSub }}>
                          {unit.title}
                      </span>
                  </div>
              ))}
          </div>

          <div style={{ padding: 20, borderTop: `1px solid ${T.border}` }}>
              <button 
                onClick={() => navigate(`/student/quiz/${chapter.id}`)}
                style={{ width: '100%', padding: '12px', borderRadius: 12, backgroundColor: `${T.success}15`, border: `1px solid ${T.success}40`, color: T.success, fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}
              >
                  <CheckCircle size={16} /> Final Quiz
              </button>
          </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4rem 6rem', backgroundColor: T.bg }}>
          {selectedUnit ? (
              <div style={{ maxWidth: 850, margin: '0 auto', animation: 'contentFade 0.6s ease-out' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: T.primary, textTransform: 'uppercase', letterSpacing: 2 }}>{chapter.title}</span>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: T.border }} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: T.textSub, textTransform: 'uppercase', letterSpacing: 1 }}>{selectedUnit.title}</span>
                  </div>
                  
                  <h1 style={{ fontSize: 42, fontWeight: 800, color: T.text, marginBottom: '3.5rem', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                      {selectedUnit.title}
                  </h1>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                      {selectedUnit.content_blocks?.map((block) => (
                          <div key={block.id} style={{ animation: 'blockSlide 0.8s ease-out forwards' }}>
                              {block.type === 'header' && (
                                  <h2 style={{ fontSize: 28, fontWeight: 800, color: T.text, marginBottom: 12, lineHeight: 1.3, letterSpacing: '-0.5px' }}>{block.content_data.text}</h2>
                              )}
                              {block.type === 'text' && (
                                  <p style={{ fontSize: 17, lineHeight: 1.85, color: T.textSub, marginBottom: 0, fontWeight: 450 }}>{block.content_data.text}</p>
                              )}
                              {block.type === 'image' && (
                                  <div style={{ margin: '10px 0', border: `1px solid ${T.border}`, borderRadius: 24, overflow: 'hidden', backgroundColor: T.card, boxShadow: T.shadow }}>
                                      <img src={block.content_data.url} alt={block.content_data.caption} style={{ width: '100%', display: 'block' }} />
                                      {block.content_data.caption && (
                                          <div style={{ padding: '12px 20px', borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.textSub, backgroundColor: `${T.bg}50`, fontStyle: 'italic' }}>
                                              {block.content_data.caption}
                                          </div>
                                      )}
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
                  
                  <div style={{ marginTop: 80, padding: 40, borderRadius: 24, border: `1px dashed ${T.border}`, textAlign: 'center' }}>
                      <p style={{ color: T.textSub, fontSize: 14, marginBottom: 20 }}>You have reached the end of this unit. Great progress!</p>
                      <button 
                        onClick={() => navigate(`/student/quiz/${chapter.id}`)}
                        style={{ padding: '14px 28px', borderRadius: 16, backgroundColor: T.primary, color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 25px ${T.primary}30` }}
                      >
                          Test Your Knowledge
                      </button>
                  </div>
              </div>
          ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: T.textSub, textAlign: 'center' }}>
                  <div style={{ maxWidth: 300 }}>
                      <BookOpen size={48} style={{ marginBottom: 20, opacity: 0.2 }} />
                      <h3>Ready to start?</h3>
                      <p style={{ fontSize: 13, marginTop: 8 }}>Select a lesson from the sidebar to begin your training session.</p>
                  </div>
              </div>
          )}
      </div>

      <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes contentFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes blockSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
