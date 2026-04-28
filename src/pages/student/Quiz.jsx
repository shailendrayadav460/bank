import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lmsService from '../../services/lmsService';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle, AlertCircle, RefreshCw, Award, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'react-toastify';

import { Skeleton } from '@mui/material';

export default function Quiz() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState(null);
  const { theme: T } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      const data = await lmsService.getQuiz(id);
      setQuestions(data.questions || []);
    } catch (err) {
      toast.error('Failed to load quiz questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option) => {
    if (showResult) return;
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const submitQuiz = async () => {
      try {
          const payload = questions.map((q, i) => ({
              question_id: q.id,
              answer: answers[i]
          })).filter(a => a.answer !== undefined);

          const result = await lmsService.submitQuiz(id, payload);
          setQuizResult(result);
          setShowResult(true);
      } catch (err) {
          toast.error(err.message || 'Failed to submit quiz.');
      }
  };

  if (loading) return (
    <div style={{ padding: '3rem 2rem', maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: T.bg }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Skeleton variant="circular" width={36} height={36} sx={{ bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
            <Skeleton variant="text" width={200} height={36} sx={{ bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
        </div>
      </div>
      <div style={{
          backgroundColor: T.card, borderRadius: 28, padding: '2.5rem', border: `1px solid ${T.border}`, boxShadow: T.shadow
      }}>
          <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', mb: 1 }} />
          <Skeleton variant="rectangular" width="80%" height={40} sx={{ borderRadius: 2, bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', mb: 4 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} variant="rectangular" width="100%" height={54} sx={{ borderRadius: 4, bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
              ))}
          </div>
      </div>
    </div>
  );
  if (!questions.length) return (
    <div style={{ padding: 60, textAlign: 'center', color: T.textSub, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <AlertCircle size={48} style={{ marginBottom: 20 }} />
      <h3>No questions available for this module yet.</h3>
      <button onClick={() => navigate(-1)} style={{ marginTop: 20, padding: '10px 20px', borderRadius: 12, backgroundColor: T.primary, color: '#fff', border: 'none', cursor: 'pointer' }}>Go Back</button>
    </div>
  );

  const currentQ = questions[currentIndex];
  const total = questions.length;

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: T.bg }}>
      
      {!showResult ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: `${T.primary}10`, border: 'none', color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text }}>Module Assessment</h2>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.textSub }}>
                Question {currentIndex + 1} of {total}
            </div>
          </div>

          <div style={{
              backgroundColor: T.card, borderRadius: 28, padding: '2.5rem', border: `1px solid ${T.border}`,
              boxShadow: T.shadow, animation: 'fadeIn 0.3s ease-out'
          }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.primary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>{currentQ.difficulty.toUpperCase()} LEVEL</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: T.text, marginBottom: '2.5rem', lineHeight: 1.4 }}>{currentQ.question_text}</h1>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {currentQ.options_data.options.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => handleSelect(opt)}
                        style={{
                            padding: '16px 20px', borderRadius: 16, border: `2px solid ${answers[currentIndex] === opt ? T.primary : T.border}`,
                            backgroundColor: answers[currentIndex] === opt ? `${T.primary}05` : 'transparent',
                            color: answers[currentIndex] === opt ? T.text : T.textSub,
                            fontSize: 15, fontWeight: answers[currentIndex] === opt ? 700 : 500,
                            cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}
                        className="quiz-option"
                      >
                          {opt}
                          {answers[currentIndex] === opt && <CheckCircle size={18} color={T.primary} />}
                      </div>
                  ))}
              </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
              <button 
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                style={{ height: 52, padding: '0 24px', borderRadius: 16, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: currentIndex === 0 ? 0.3 : 1 }}
              >
                  Previous
              </button>
              
              {currentIndex === total - 1 ? (
                <button 
                    onClick={submitQuiz}
                    style={{ height: 52, padding: '0 32px', borderRadius: 16, border: 'none', backgroundColor: T.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 20px ${T.primary}20` }}
                >
                    Submit Quiz
                </button>
              ) : (
                <button 
                    onClick={() => setCurrentIndex(prev => Math.min(total - 1, prev + 1))}
                    style={{ height: 52, padding: '0 32px', borderRadius: 16, border: 'none', backgroundColor: T.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                    Next <ChevronRight size={18} />
                </button>
              )}
          </div>
        </>
      ) : (
        <div style={{
            backgroundColor: T.card, borderRadius: 32, padding: '4rem 2rem', border: `1px solid ${T.border}`,
            boxShadow: T.shadow, textAlign: 'center', animation: 'scaleUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: quizResult?.is_passed ? `${T.success}10` : `${T.danger}10`, border: `2px solid ${quizResult?.is_passed ? T.success : T.danger}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: quizResult?.is_passed ? T.success : T.danger, margin: '0 auto 24px' }}>
                <Award size={48} />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 8 }}>{quizResult?.is_passed ? 'Assessment Passed!' : 'Assessment Failed'}</h1>
            <p style={{ color: T.textSub, fontSize: 16, marginBottom: 40 }}>{quizResult?.message || 'You have completed the module quiz.'}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, backgroundColor: T.bg, padding: 24, borderRadius: 24, marginBottom: 40, border: `1px solid ${T.border}` }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: T.textSub, textTransform: 'uppercase', marginBottom: 4 }}>SCORE</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: quizResult?.is_passed ? T.success : T.danger}}>{quizResult?.percentage || 0}%</div>
                </div>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: T.textSub, textTransform: 'uppercase', marginBottom: 4 }}>POINTS</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: T.primary }}>{quizResult?.score || 0}/{quizResult?.total_points || 0}</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button 
                   onClick={() => { setShowResult(false); setCurrentIndex(0); setAnswers({}); setQuizResult(null); }}
                   style={{ height: 52, padding: '0 24px', borderRadius: 16, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                    <RefreshCw size={18} /> Retake
                </button>
                <button 
                   onClick={() => navigate('/student/courses')}
                   style={{ height: 52, padding: '0 32px', borderRadius: 16, border: 'none', backgroundColor: T.primary, color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                    Back to Courses
                </button>
            </div>
        </div>
      )}

      <style>{`
        .quiz-option:hover { border-color: ${T.primary}; background-color: ${T.primary}05; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
