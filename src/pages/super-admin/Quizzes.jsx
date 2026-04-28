import { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import lmsService from '../../services/lmsService';
import { toast } from 'react-toastify';
import {
  Plus, Pencil, Trash2, X, List, BarChart2, CheckCircle, Activity,
  ChevronDown, Search, AlertTriangle, Loader2
} from 'lucide-react';
import { Skeleton } from '@mui/material';

/* ─── Blank question template ───────────────────────────────── */
const BLANK_QUESTION = {
  id: null, chapter_id: null,
  question_text: '', question_type: 'mcq', difficulty: 'Easy', is_active: true, points: 10,
  options_data: { options: ['', '', '', ''], correct: 0 },
  explanation: '', correctAnswer: '',
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*                    QUIZ MANAGEMENT PAGE                       */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Quizzes = () => {
  const { theme: T } = useTheme();

  /* ── State ── */
  const [chapters, setChapters] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // null = add, object = edit
  const [formData, setFormData] = useState({ ...BLANK_QUESTION });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null); // question id

  // Dropdown states
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [showDiffDropdown, setShowDiffDropdown] = useState(false);

  /* ── Data Fetching ── */
  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const data = await lmsService.getChapters();
      setChapters(data);
      if (data.length > 0) {
        setActiveChapterId(data[0].id);
      } else {
        setLoadingQuestions(false);
      }
    } catch (err) {
      toast.error('Failed to load chapters.');
      setLoadingQuestions(false);
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    if (activeChapterId) {
      fetchQuestions(activeChapterId);
    }
  }, [activeChapterId]);

  const fetchQuestions = async (chapterId) => {
    try {
      setLoadingQuestions(true);
      const data = await lmsService.getAdminQuizzes(chapterId);
      setQuestions(data || []);
    } catch (err) {
      toast.error('Failed to fetch questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  /* ── Computed ── */
  const filteredQuestions = useMemo(() => {
    return questions
      .filter(q => searchTerm === '' || q.question_text.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [questions, searchTerm]);

  const stats = useMemo(() => ({
    total: questions.length,
    active: questions.filter(q => q.is_active).length,
    mcq: questions.filter(q => q.question_type.toLowerCase() === 'mcq').length,
    avgPoints: questions.length ? Math.round(questions.reduce((s, q) => s + q.points, 0) / questions.length) : 0,
  }), [questions]);

  /* ── Helpers ── */
  const card = (extra = {}) => ({
    backgroundColor: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    boxShadow: T.shadow,
    ...extra,
  });

  const diffColor = (d) => {
    if (d === 'Easy') return T.success;
    if (d === 'Medium') return T.warning;
    return T.danger;
  };
  const diffBg = (d) => {
    if (d === 'Easy') return T.name === 'dark' ? 'rgba(41,195,106,0.12)' : 'rgba(22,163,74,0.1)';
    if (d === 'Medium') return T.name === 'dark' ? 'rgba(242,192,70,0.12)' : 'rgba(217,119,6,0.1)';
    return T.name === 'dark' ? 'rgba(231,76,60,0.12)' : 'rgba(220,38,38,0.1)';
  };
  const typeBadge = (type) => {
    if (type === 'MCQ') return { bg: T.name === 'dark' ? 'rgba(27,111,222,0.15)' : 'rgba(27,111,222,0.1)', color: T.primary };
    if (type === 'Voltage Entry') return { bg: T.name === 'dark' ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)', color: '#8b5cf6' };
    return { bg: T.name === 'dark' ? 'rgba(41,195,106,0.15)' : 'rgba(22,163,74,0.1)', color: T.success };
  };

  /* ── CRUD handlers ── */
  const openAddModal = () => {
    setEditingQuestion(null);
    setFormData({ 
      ...BLANK_QUESTION, 
      chapter_id: activeChapterId,
      options: [{text:'', correct:false},{text:'', correct:false},{text:'', correct:false},{text:'', correct:false}]
    });
    setModalOpen(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    
    // Map backend array back to local editable format
    const localOptions = (q.options_data?.options?.length > 0) 
      ? q.options_data.options.map((text, i) => ({ text, correct: q.options_data.correct === i }))
      : [
          { text: '', correct: false }, { text: '', correct: false },
          { text: '', correct: false }, { text: '', correct: false }
        ];

    setFormData({
      ...q,
      options: localOptions,
      correctAnswer: q.options_data?.correct || ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingQuestion(null);
    setFormData({ ...BLANK_QUESTION });
    setShowModuleDropdown(false);
    setShowDiffDropdown(false);
  };

  const saveQuestion = async () => {
    try {
      setIsSaving(true);
      const isMcq = formData.question_type.toLowerCase() === 'mcq';
      const points = parseInt(formData.points) || 10;
      
      const payload = {
        chapter_id: formData.chapter_id,
        question_text: formData.question_text,
        question_type: formData.question_type.toLowerCase().replace(' ', '_'),
        difficulty: formData.difficulty.toLowerCase(),
        points: points,
        explanation: formData.explanation || '',
        is_active: formData.is_active,
        options_data: isMcq ? {
          options: formData.options.map(o => o.text),
          correct: formData.options.findIndex(o => o.correct) !== -1 ? formData.options.findIndex(o => o.correct) : 0
        } : { options: [], correct: formData.correctAnswer || '' }
      };

      if (editingQuestion) {
        await lmsService.updateQuizQuestion(editingQuestion.id, payload);
      } else {
        await lmsService.saveQuizQuestion(payload);
      }
      
      closeModal();
      if (activeChapterId) fetchQuestions(activeChapterId);
    } catch (err) {
      toast.error(err.message || 'Error saving question');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteQuestion = async (id) => {
    try {
       await lmsService.deleteQuizQuestion(id);
       toast.success('Question deleted');
       if (activeChapterId) fetchQuestions(activeChapterId);
    } catch (err) {
       toast.error('Failed to delete');
    }
    setDeleteConfirm(null);
  };

  const toggleActive = async (id, currentQuestion) => {
    try {
      await lmsService.updateQuizQuestion(id, { is_active: !currentQuestion.is_active });
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, is_active: !q.is_active } : q));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };


  /* ── Form field updaters ── */
  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const updateOption = (idx, text) => {
    setFormData(prev => {
      const opts = [...prev.options];
      opts[idx] = { ...opts[idx], text };
      return { ...prev, options: opts };
    });
  };

  const selectCorrect = (idx) => {
    setFormData(prev => {
      const opts = prev.options.map((o, i) => ({ ...o, correct: i === idx }));
      return { ...prev, options: opts };
    });
  };

  const removeOption = (idx) => {
    if (formData.options.length <= 2) return;
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx),
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { text: '', correct: false }],
    }));
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /*                         RENDER                              */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', gap: 16, minHeight: '100%' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, margin: 0 }}>Quiz Management</h2>
          <p style={{ fontSize: 14, color: T.textSub, marginTop: 6, marginBottom: 0 }}>
            Manage quiz questions for all 10 modules
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Search */}
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.textSub }} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%', backgroundColor: T.inputBg, border: `1px solid ${T.border}`,
                borderRadius: 8, padding: '9px 12px 9px 34px', fontSize: 13, color: T.text,
                outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
          <button
            onClick={openAddModal}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              backgroundColor: T.primary, color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Plus size={16} /> Add Question
          </button>
        </div>
      </div>

      {/* ── Module Pills ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 2,
      }}>
        {loadingConfig ? (
          <>
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} variant="rounded" width={90} height={32} sx={{ borderRadius: 100, bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
            ))}
          </>
        ) : chapters.map(m => {
          const isActive = m.id === activeChapterId;
          return (
            <button
              key={m.id}
              onClick={() => setActiveChapterId(m.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 100, cursor: 'pointer',
                fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', fontFamily: 'inherit',
                border: `1px solid ${isActive ? T.primary : T.border}`,
                backgroundColor: isActive ? T.primary : T.card,
                color: isActive ? '#fff' : T.textSub,
                transition: 'all 0.2s',
              }}
            >
              {m.title}
            </button>
          );
        })}
      </div>

      {/* ── Questions Table ── */}
      <div style={card({ overflow: 'hidden' })}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['#', 'Question Text', 'Type', 'Correct Answer', 'Difficulty', 'Status', 'Actions'].map((h, i) => (
                <th key={h} style={{
                  textAlign: i === 6 ? 'right' : 'left',
                  fontSize: 11, fontWeight: 600, color: T.textSub,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  padding: '10px 16px', borderBottom: `1px solid ${T.border}`,
                  backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loadingQuestions ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}><Skeleton variant="rounded" width={28} height={28} sx={{ borderRadius: 1, bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} /></td>
                  <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}><Skeleton variant="text" width="80%" height={20} sx={{ bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} /></td>
                  <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}><Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 100, bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} /></td>
                  <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}><Skeleton variant="text" width={100} height={20} sx={{ bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} /></td>
                  <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}><Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 100, bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} /></td>
                  <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}><Skeleton variant="rounded" width={40} height={22} sx={{ borderRadius: 100, bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} /></td>
                  <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <Skeleton variant="rounded" width={24} height={24} sx={{ borderRadius: 1, bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                      <Skeleton variant="rounded" width={24} height={24} sx={{ borderRadius: 1, bgcolor: T.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: T.textSub, fontSize: 14 }}>
                  No questions found for this module.
                </td>
              </tr>
            ) : (
              filteredQuestions.map((q, idx) => {
                const tb = typeBadge(q.question_type === 'mcq' ? 'MCQ' : q.question_type);
                return (
                  <tr
                    key={q.id}
                    style={{ transition: 'background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.cardHover; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {/* # */}
                    <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        backgroundColor: T.primaryBg, color: T.primary,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13,
                      }}>
                        {idx + 1}
                      </div>
                    </td>
                    {/* Question Text */}
                    <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}`, maxWidth: 280 }}>
                      <div style={{
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        fontSize: 14, color: T.text,
                      }} title={q.question_text}>
                        {q.question_text}
                      </div>
                    </td>
                    {/* Type */}
                    <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
                      <span style={{
                        fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 100,
                        backgroundColor: tb.bg, color: tb.color, whiteSpace: 'nowrap',
                      }}>
                        {q.question_type.toUpperCase()}
                      </span>
                    </td>
                    {/* Correct Answer */}
                    <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}`, maxWidth: 160 }}>
                      <div style={{
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        color: T.textSub, fontSize: 14,
                      }} title="Stored internally">
                        {q.question_type === 'mcq' && q.options_data?.options ? q.options_data.options[q.options_data.correct] : q.options_data?.correct || 'Stored Value'}
                      </div>
                    </td>
                    {/* Difficulty */}
                    <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
                      <span style={{
                        fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 100,
                        backgroundColor: diffBg(q.difficulty), color: diffColor(q.difficulty),
                        whiteSpace: 'nowrap', textTransform: 'capitalize'
                      }}>
                        {q.difficulty}
                      </span>
                    </td>
                    {/* Status Toggle */}
                    <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
                      <button
                        onClick={() => toggleActive(q.id, q)}
                        style={{
                          width: 40, height: 22, borderRadius: 100, border: 'none', cursor: 'pointer',
                          backgroundColor: q.is_active ? T.success : T.border,
                          position: 'relative', padding: 0, transition: 'background 0.2s',
                        }}
                      >
                        <span style={{
                          position: 'absolute', top: 2,
                          left: q.is_active ? 'auto' : 3,
                          right: q.is_active ? 3 : 'auto',
                          width: 18, height: 18, borderRadius: '50%',
                          backgroundColor: q.is_active ? '#fff' : T.textSub,
                          transition: 'all 0.2s',
                        }} />
                      </button>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                        <button
                          onClick={() => openEditModal(q)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                            color: T.primary, padding: 4, borderRadius: 4, transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = T.primaryBg)}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(q.id)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                            color: T.danger, padding: 4, borderRadius: 4, transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = T.name === 'dark' ? 'rgba(231,76,60,0.12)' : 'rgba(220,38,38,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Stats Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Questions', icon: <List size={16} />, value: stats.total },
          { label: 'Active Questions', icon: <CheckCircle size={16} />, value: stats.active },
          { label: 'MCQ Questions', icon: <BarChart2 size={16} />, value: stats.mcq },
          { label: 'Avg Points', icon: <Activity size={16} />, value: stats.avgPoints },
        ].map(s => (
          <div
            key={s.label}
            style={card({
              padding: 16, display: 'flex', flexDirection: 'column', gap: 8,
              transition: 'box-shadow 0.2s',
            })}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 24px ${T.name === 'dark' ? 'rgba(27,111,222,0.1)' : 'rgba(27,111,222,0.06)'}`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = T.shadow)}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              color: T.textSub, fontWeight: 500, fontSize: 13,
            }}>
              {s.label}
              <div style={{
                width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: T.primaryBg, color: T.primary,
              }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: T.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*           ADD / EDIT QUESTION MODAL                   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {modalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(6,11,24,0.82)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, overflowY: 'auto',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
              width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column',
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.5)',
              animation: 'modalIn 0.22s ease-out',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 20px', borderBottom: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>
                  {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </h3>
                <p style={{ fontSize: 12, color: T.textSub, margin: '2px 0 0' }}>
                  {chapters.find(m => m.id === formData.chapter_id)?.title || ''}
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  color: T.textSub, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = T.name === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = T.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{
              padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14,
              maxHeight: '65vh', overflowY: 'auto',
            }}>

              {/* Module + Difficulty selectors */}
              <div style={{ display: 'flex', gap: 12 }}>
                {/* Module Dropdown */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.textSub }}>Module</label>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => { setShowModuleDropdown(!showModuleDropdown); setShowDiffDropdown(false); }}
                      style={{
                        width: '100%', backgroundColor: T.inputBg, border: `1px solid ${T.border}`,
                        borderRadius: 6, padding: '8px 10px', fontSize: 13, color: T.text,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {chapters.find(m => m.id === formData.chapter_id)?.title}
                      </span>
                      <ChevronDown size={16} style={{ color: T.textSub, flexShrink: 0 }} />
                    </button>
                    {showModuleDropdown && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                        backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 8,
                        marginTop: 4, maxHeight: 200, overflowY: 'auto',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      }}>
                        {chapters.map(m => (
                          <button
                            key={m.id}
                            onClick={() => { updateField('chapter_id', m.id); setShowModuleDropdown(false); }}
                            style={{
                              width: '100%', padding: '8px 12px', border: 'none', cursor: 'pointer',
                              fontSize: 13, color: m.id === formData.chapter_id ? T.primary : T.text,
                              backgroundColor: m.id === formData.chapter_id ? T.primaryBg : 'transparent',
                              textAlign: 'left', fontFamily: 'inherit',
                              borderBottom: `1px solid ${T.border}`,
                            }}
                            onMouseEnter={e => { if (m.id !== formData.chapter_id) e.currentTarget.style.backgroundColor = T.cardHover; }}
                            onMouseLeave={e => { if (m.id !== formData.chapter_id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            {m.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Difficulty Dropdown */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.textSub }}>Difficulty</label>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => { setShowDiffDropdown(!showDiffDropdown); setShowModuleDropdown(false); }}
                      style={{
                        width: '100%', backgroundColor: T.inputBg, border: `1px solid ${T.border}`,
                        borderRadius: 6, padding: '8px 10px', fontSize: 13, color: T.text,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: diffColor(formData.difficulty) }} />
                        {formData.difficulty}
                      </div>
                      <ChevronDown size={16} style={{ color: T.textSub }} />
                    </button>
                    {showDiffDropdown && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                        backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 8,
                        marginTop: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      }}>
                        {['Easy', 'Medium', 'Hard'].map(d => (
                          <button
                            key={d}
                            onClick={() => { updateField('difficulty', d); setShowDiffDropdown(false); }}
                            style={{
                              width: '100%', padding: '8px 12px', border: 'none', cursor: 'pointer',
                              fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
                              color: d === formData.difficulty ? diffColor(d) : T.text,
                              backgroundColor: d === formData.difficulty ? diffBg(d) : 'transparent',
                              textAlign: 'left', fontFamily: 'inherit',
                              borderBottom: `1px solid ${T.border}`,
                            }}
                            onMouseEnter={e => { if (d !== formData.difficulty) e.currentTarget.style.backgroundColor = T.cardHover; }}
                            onMouseLeave={e => { if (d !== formData.difficulty) e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: diffColor(d) }} />
                            {d}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Type Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.textSub }}>Question Type</label>
                <div style={{
                  display: 'flex', backgroundColor: T.inputBg,
                  border: `1px solid ${T.border}`, borderRadius: 6, padding: 3,
                }}>
                  {/* ['mcq', 'voltage_entry', 'match_diagnosis'] modified to just mcq per request */}
                  {['mcq'].map(t => {
                    const sel = formData.question_type === t;
                    const labels = {
                      mcq: 'Multiple Choice',
                      voltage_entry: 'Voltage Entry',
                      match_diagnosis: 'Match Diagnosis'
                    };
                    return (
                      <button
                        key={t}
                        onClick={() => updateField('question_type', t)}
                        style={{
                          flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 4,
                          fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
                          fontFamily: 'inherit',
                          backgroundColor: sel ? T.primary : 'transparent',
                          color: sel ? '#fff' : T.textSub,
                          transition: 'all 0.2s',
                        }}
                      >
                        {labels[t]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.textSub }}>Question Text</label>
                <textarea
                  value={formData.question_text}
                  onChange={e => updateField('question_text', e.target.value)}
                  placeholder="Enter your question here..."
                  rows={2}
                  style={{
                    backgroundColor: T.inputBg, border: `1px solid ${T.border}`,
                    borderRadius: 6, padding: '8px 10px', fontSize: 13, color: T.text,
                    resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.4,
                  }}
                />
              </div>

              {/* MCQ Options */}
              {formData.question_type === 'mcq' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: T.textSub }}>Options</label>
                    <span style={{ fontSize: 11, color: T.textSub }}>Mark the correct answer</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {formData.options.map((opt, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* Radio */}
                        <button
                          onClick={() => selectCorrect(i)}
                          style={{
                            width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                            border: `2px solid ${opt.correct ? T.primary : T.border}`,
                            backgroundColor: 'transparent', cursor: 'pointer', padding: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'border-color 0.15s',
                          }}
                        >
                          {opt.correct && (
                            <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: T.primary }} />
                          )}
                        </button>
                        {/* Input */}
                        <input
                          value={opt.text}
                          onChange={e => updateOption(i, e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          style={{
                            flex: 1, backgroundColor: T.inputBg,
                            border: `1px solid ${opt.correct ? T.primary : T.border}`,
                            borderRadius: 6, padding: '7px 10px', fontSize: 13, color: T.text,
                            outline: 'none', fontFamily: 'inherit',
                          }}
                        />
                        {/* Remove */}
                        <button
                          onClick={() => removeOption(i)}
                          style={{
                            width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: T.textSub, borderRadius: 4, transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = T.danger)}
                          onMouseLeave={e => (e.currentTarget.style.color = T.textSub)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addOption}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: T.primary, fontSize: 13, fontWeight: 500, padding: '4px 0',
                      fontFamily: 'inherit',
                    }}
                  >
                    <Plus size={14} /> Add Option
                  </button>
                </div>
              )}

              {/* Correct Answer for non-MCQ */}
              {formData.question_type !== 'mcq' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.textSub }}>
                    {formData.question_type === 'voltage_entry' ? 'Correct Value / Range' : 'Number of Pairs'}
                  </label>
                  <input
                    value={formData.correctAnswer}
                    onChange={e => updateField('correctAnswer', e.target.value)}
                    placeholder={formData.question_type === 'voltage_entry' ? 'e.g. +60° (Range: 55-65)' : 'e.g. 3 Pairs'}
                    style={{
                      backgroundColor: T.inputBg, border: `1px solid ${T.border}`,
                      borderRadius: 6, padding: '8px 10px', fontSize: 13, color: T.text,
                      outline: 'none', fontFamily: 'inherit',
                    }}
                  />
                </div>
              )}

              {/* Explanation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.textSub }}>
                  Explanation / Rationale
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={e => updateField('explanation', e.target.value)}
                  placeholder="Explain the correct answer..."
                  rows={2}
                  style={{
                    backgroundColor: T.inputBg, border: `1px solid ${T.border}`,
                    borderRadius: 6, padding: '8px 10px', fontSize: 13, color: T.text,
                    resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.4,
                  }}
                />
              </div>

              {/* Points + Active */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ width: 100, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.textSub }}>Points</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={e => updateField('points', parseInt(e.target.value) || 0)}
                    style={{
                      backgroundColor: T.inputBg, border: `1px solid ${T.border}`,
                      borderRadius: 6, padding: '8px 10px', fontSize: 13, color: T.text,
                      outline: 'none', fontFamily: 'inherit', width: '100%',
                    }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 2 }}>
                  <button
                    onClick={() => updateField('is_active', !formData.is_active)}
                    style={{
                      width: 36, height: 20, borderRadius: 100, border: 'none', cursor: 'pointer',
                      backgroundColor: formData.is_active ? T.success : T.border,
                      position: 'relative', padding: 0, transition: 'background 0.2s',
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: 2,
                      left: formData.is_active ? 'auto' : 2,
                      right: formData.is_active ? 2 : 'auto',
                      width: 16, height: 16, borderRadius: '50%',
                      backgroundColor: formData.is_active ? '#fff' : T.textSub,
                      transition: 'all 0.2s',
                    }} />
                  </button>
                  <span style={{ fontSize: 13, color: T.text }}>Active</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 20px', borderTop: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16,
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '8px 14px', fontSize: 13, fontWeight: 500,
                  color: T.textSub, backgroundColor: 'transparent', border: 'none',
                  cursor: 'pointer', borderRadius: 8, fontFamily: 'inherit',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = T.text)}
                onMouseLeave={e => (e.currentTarget.style.color = T.textSub)}
              >
                Cancel
              </button>
              <button
                onClick={saveQuestion}
                disabled={!formData.question_text.trim() || isSaving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                  backgroundColor: formData.question_text.trim() && !isSaving ? T.primary : T.border,
                  color: '#fff', border: 'none', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: formData.question_text.trim() && !isSaving ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit', transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => { if (formData.question_text.trim() && !isSaving) e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                {isSaving ? <><Loader2 size={14} className="animate-spin" /> {editingQuestion ? 'Updating...' : 'Saving...'}</> : (editingQuestion ? 'Update Question' : 'Save Question')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*            DELETE CONFIRMATION MODAL                   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {deleteConfirm !== null && (
        <div
          onClick={() => setDeleteConfirm(null)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(6,11,24,0.82)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 16,
              width: 420, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.5)',
              animation: 'modalIn 0.22s ease-out',
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              backgroundColor: T.name === 'dark' ? 'rgba(231,76,60,0.15)' : 'rgba(220,38,38,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertTriangle size={28} style={{ color: T.danger }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, margin: '0 0 8px' }}>Delete Question</h3>
              <p style={{ fontSize: 14, color: T.textSub, margin: 0, lineHeight: 1.5 }}>
                Are you sure you want to delete this question? This action cannot be undone.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, padding: '10px 0', fontSize: 14, fontWeight: 500, borderRadius: 8,
                  border: `1px solid ${T.border}`, backgroundColor: 'transparent',
                  color: T.textSub, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteQuestion(deleteConfirm)}
                style={{
                  flex: 1, padding: '10px 0', fontSize: 14, fontWeight: 600, borderRadius: 8,
                  border: 'none', backgroundColor: T.danger, color: '#fff',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal animation keyframes */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Quizzes;
