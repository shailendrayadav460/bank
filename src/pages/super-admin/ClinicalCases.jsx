import React, { useState, memo, useMemo, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  HeartPulse, LayoutGrid, Users, BookOpen, CheckSquare, 
  BarChart2, FileText, Settings, LogOut, Search, 
  Bell, Plus, Pencil, Eye, Trash2, X, 
  ChevronDown, UploadCloud, Info, ArrowUpRight,
  TrendingDown, Activity, MoreVertical, Tag, 
  Thermometer, Ruler, Zap
} from 'lucide-react';



const INITIAL_CASES = [
  {
    id: 1,
    figure: 'Figure 1',
    title: 'Normal QRS/T Angle',
    category: 'Normal',
    status: 'Active',
    description: 'Patient presents with normal baseline. ECG demonstrates changes consistent with normal repolarization.',
    findings: 'Lead I-III show normal R wave progression.',
    interpretation: 'Normal vector interpretation where QRS and T vectors are closely aligned (within 45°).',
    axis: { qrs: 45, t: 30 },
    data: [
      { lead: 'I', qrs: '+8', t: '+2', st: '0' },
      { lead: 'II', qrs: '+12', t: '+4', st: '0' },
      { lead: 'III', qrs: '+4', t: '+2', st: '0' },
      { lead: 'aVR', qrs: '-10', t: '-3', st: '0' },
      { lead: 'aVL', qrs: '+2', t: '+1', st: '0' },
      { lead: 'aVF', qrs: '+8', t: '+3', st: '0' },
    ]
  },
  {
    id: 2,
    figure: 'Figure 2',
    title: 'Inferior Wall Ischemia',
    category: 'Ischemia',
    status: 'Active',
    description: 'Patient presents with chest pain. ECG demonstrates changes consistent with inferior wall ischemia.',
    findings: 'Inverted T waves in leads II, III, and aVF.',
    interpretation: 'The T vector shifts superiorly (-60°) away from the ischemic wall.',
    axis: { qrs: 60, t: -60 },
    data: [
      { lead: 'I', qrs: '+8', t: '+2', st: '0' },
      { lead: 'II', qrs: '+12', t: '-4', st: '0' },
      { lead: 'III', qrs: '+4', t: '-6', st: '0' },
      { lead: 'aVR', qrs: '-10', t: '+1', st: '0' },
      { lead: 'aVL', qrs: '+2', t: '+4', st: '0' },
      { lead: 'aVF', qrs: '+8', t: '-5', st: '0' },
    ]
  },
  {
    id: 3,
    figure: 'Figure 3',
    title: 'Inferior Wall MI — ST Elevation',
    category: 'MI',
    status: 'Draft',
    description: 'Classic presentation of MI with ST-segment elevation in inferior leads.',
    findings: 'Convex ST elevation in II, III, aVF.',
    interpretation: 'Significant shift in both QRS and T vectors due to myocardial injury.',
    axis: { qrs: -30, t: 120 },
    data: [
      { lead: 'I', qrs: '+4', t: '+2', st: '0' },
      { lead: 'II', qrs: '+2', t: '-4', st: '+2.5' },
      { lead: 'III', qrs: '-3', t: '-6', st: '+3.0' },
      { lead: 'aVR', qrs: '-4', t: '+3', st: '0' },
      { lead: 'aVL', qrs: '+5', t: '+1', st: '0' },
      { lead: 'aVF', qrs: '+1', t: '-5', st: '+2.8' },
    ]
  },
  {
    id: 4,
    figure: 'Figure 4',
    title: 'Anterior Wall Ischemia',
    category: 'Ischemia',
    status: 'Active',
    description: 'Acute chest pain, T-wave inversions in precordial and limb leads.',
    findings: 'T-wave inversion in Lead I and aVL.',
    interpretation: 'T vector shifts rightward (away from anterior/lateral wall).',
    axis: { qrs: 60, t: 150 },
    data: [
      { lead: 'I', qrs: '+8', t: '-3', st: '0' },
      { lead: 'II', qrs: '+10', t: '+2', st: '0' },
      { lead: 'III', qrs: '+2', t: '+5', st: '0' },
      { lead: 'aVR', qrs: '-9', t: '+1', st: '0' },
      { lead: 'aVL', qrs: '+3', t: '-4', st: '0' },
      { lead: 'aVF', qrs: '+6', t: '+3', st: '0' },
    ]
  },
  {
    id: 5,
    figure: 'Figure 5',
    title: 'Left Axis Deviation (LAD)',
    category: 'Conduction',
    status: 'Active',
    description: 'QRS axis shifted between -30° and -90°.',
    findings: 'Leads II, III and aVF are predominantly negative.',
    interpretation: 'May indicate LVH or Left Anterior Fascicular Block.',
    axis: { qrs: -45, t: 30 },
    data: [
      { lead: 'I', qrs: '+12', t: '+2', st: '0' },
      { lead: 'II', qrs: '-2', t: '+3', st: '0' },
      { lead: 'III', qrs: '-10', t: '+1', st: '0' },
      { lead: 'aVR', qrs: '-4', t: '-3', st: '0' },
      { lead: 'aVL', qrs: '+10', t: '+2', st: '0' },
      { lead: 'aVF', qrs: '-6', t: '+2', st: '0' },
    ]
  },
  {
    id: 6,
    figure: 'Figure 6',
    title: 'Right Axis Deviation (RAD)',
    category: 'Conduction',
    status: 'Active',
    description: 'QRS axis shifted between +90° and +180°.',
    findings: 'Lead I is predominantly negative, II/III positive.',
    interpretation: 'Common in RVH or pulmonary embolism.',
    axis: { qrs: 120, t: 60 },
    data: [
      { lead: 'I', qrs: '-5', t: '+1', st: '0' },
      { lead: 'II', qrs: '+8', t: '+3', st: '0' },
      { lead: 'III', qrs: '+12', t: '+4', st: '0' },
      { lead: 'aVR', qrs: '+2', t: '-2', st: '0' },
      { lead: 'aVL', qrs: '-10', t: '+1', st: '0' },
      { lead: 'aVF', qrs: '+10', t: '+3', st: '0' },
    ]
  },
  {
    id: 7,
    figure: 'Figure 7',
    title: 'Left Bundle Branch Block',
    category: 'Conduction',
    status: 'Active',
    description: 'Delayed activation of the left ventricle.',
    findings: 'Wide QRS (>120ms), discordant T-waves.',
    interpretation: 'QRS axis usually deviates left; T vector is opposite to QRS.',
    axis: { qrs: -60, t: 110 },
    data: [
      { lead: 'I', qrs: '+15', t: '-4', st: '0' },
      { lead: 'II', qrs: '+2', t: '-2', st: '0' },
      { lead: 'III', qrs: '-12', t: '+5', st: '0' },
      { lead: 'aVR', qrs: '-8', t: '+3', st: '0' },
      { lead: 'aVL', qrs: '+12', t: '-4', st: '0' },
      { lead: 'aVF', qrs: '-5', t: '+2', st: '0' },
    ]
  },
  {
    id: 8,
    figure: 'Figure 8',
    title: 'Right Bundle Branch Block',
    category: 'Conduction',
    status: 'Active',
    description: 'Delayed activation of the right ventricle.',
    findings: 'Wide QRS, RSR\' pattern in V1.',
    interpretation: 'Late forces directed rightward and anterior.',
    axis: { qrs: 90, t: -90 },
    data: [
      { lead: 'I', qrs: '+5', t: '+2', st: '0' },
      { lead: 'II', qrs: '+10', t: '-3', st: '0' },
      { lead: 'III', qrs: '+8', t: '-5', st: '0' },
      { lead: 'aVR', qrs: '-6', t: '+2', st: '0' },
      { lead: 'aVL', qrs: '-2', t: '+1', st: '0' },
      { lead: 'aVF', qrs: '+9', t: '-4', st: '0' },
    ]
  },
  {
    id: 9,
    figure: 'Figure 9',
    title: 'WPW Syndrome',
    category: 'Arrhythmia',
    status: 'Active',
    description: 'Pre-excitation via accessory pathway (Bundle of Kent).',
    findings: 'Short PR interval, Delta wave, Wide QRS.',
    interpretation: 'Direction of Delta wave depends on pathway location.',
    axis: { qrs: 30, t: -30 },
    data: [
      { lead: 'I', qrs: '+10', t: '-2', st: '0' },
      { lead: 'II', qrs: '+8', t: '-1', st: '0' },
      { lead: 'III', qrs: '-2', t: '+3', st: '0' },
      { lead: 'aVR', qrs: '-9', t: '+3', st: '0' },
      { lead: 'aVL', qrs: '+6', t: '-2', st: '0' },
      { lead: 'aVF', qrs: '+4', t: '+1', st: '0' },
    ]
  }
];

const VectorDiagram = memo(({ qrsAngle, tAngle, theme: T, compact = false }) => {
  const cx = 50, cy = 50;
  const leads = useMemo(() => [
    { name: 'I', ang: 0 },
    { name: 'II', ang: 60 },
    { name: 'III', ang: 120 },
    { name: 'aVR', ang: -150 },
    { name: 'aVL', ang: -30 },
    { name: 'aVF', ang: 90 }
  ], []);

  const getPos = useCallback((ang, len) => {
    const angle = Number(ang) || 0;
    const length = Number(len) || 0;
    return {
      x: cx + Math.cos((angle * Math.PI) / 180) * length,
      y: cy + Math.sin((angle * Math.PI) / 180) * length
    };
  }, [cx, cy]);

  const qrs = useMemo(() => getPos(qrsAngle || 0, 35), [getPos, qrsAngle]);
  const t = useMemo(() => getPos(tAngle || 0, 25), [getPos, tAngle]);

  return (
    <div style={{ 
      padding: compact ? 8 : 16, 
      backgroundColor: T.bg, 
      borderRadius: 16, 
      border: `1px solid ${T.border}`, 
      width: '100%', 
      height: compact ? 130 : 'auto',
      aspectRatio: compact ? 'unset' : '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      contain: 'content'
    }}>
      <svg width="100%" height={compact ? "105" : "100%"} viewBox="0 0 100 100" style={{ pointerEvents: 'none' }}>
        <circle cx={cx} cy={cy} r="42" fill="none" stroke={T.border} strokeWidth="1" />
        <circle cx={cx} cy={cy} r="40" fill="none" stroke={T.border} strokeWidth="0.5" strokeDasharray="2 2" />
        
        {leads.map(l => {
          const p = getPos(l.ang, 40);
          const labelPos = getPos(l.ang, 48);
          return (
             <g key={l.name}>
                <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={T.textSub} strokeWidth="0.5" opacity="0.12" />
                <text x={labelPos.x} y={labelPos.y} fontSize="5" fill={T.text} textAnchor="middle" dominantBaseline="middle" fontWeight="900" opacity="0.8">{l.name}</text>
             </g>
          );
        })}

        {!isNaN(qrs.x) && !isNaN(qrs.y) && (
          <>
            <line x1={cx} y1={cy} x2={qrs.x} y2={qrs.y} stroke={T.primary} strokeWidth="4.5" strokeLinecap="round" />
            <circle cx={qrs.x} cy={qrs.y} r="4.5" fill={T.primary} stroke={T.bg} strokeWidth="1.5" />
          </>
        )}
        
        {!isNaN(t.x) && !isNaN(t.y) && (
          <>
            <line x1={cx} y1={cy} x2={t.x} y2={t.y} stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx={t.x} cy={t.y} r="3.5" fill="#EF4444" stroke={T.bg} strokeWidth="1.5" />
          </>
        )}
        <circle cx={cx} cy={cy} r="3" fill={T.text} stroke={T.bg} strokeWidth="1" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: T.primary }} />
          <span style={{ fontSize: 9, fontWeight: 900, color: T.textSub }}>{qrsAngle}°</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <span style={{ fontSize: 9, fontWeight: 900, color: T.textSub }}>{tAngle}°</span>
        </div>
      </div>
    </div>
  );
});

const CaseCard = memo(({ c, T, onEdit, onView, onDelete }) => {
  return (
    <div style={{
      backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', gap: 8, transition: 'all 0.3s ease', cursor: 'default', boxShadow: T.shadow, height: 'max-content', position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
           <div style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: T.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900 }}>{c.id.toString().slice(-1)}</div>
           <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', color: T.primary, backgroundColor: `${T.primary}12`, padding: '2px 6px', borderRadius: 4 }}>{c.figure}</div>
        </div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 4, padding: '2px 6px', borderRadius: 40, 
          backgroundColor: c.status === 'Active' ? '#10b98112' : `${T.textSub}12`,
          color: c.status === 'Active' ? '#10b981' : T.textSub,
          fontSize: 9, fontWeight: 900
        }}>
           <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: c.status === 'Active' ? '#10b981' : T.textSub }} />
           {c.status}
        </div>
      </div>

      <div>
         <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.3px' }}>{c.title}</h3>
         <div style={{ display: 'inline-flex', width: 'max-content', padding: '1px 6px', borderRadius: 4, backgroundColor: T.primary, color: '#fff', fontSize: 8, fontWeight: 900, marginTop: 2 }}>{c.category}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: `${T.textSub}05`, borderRadius: 10, border: `1px solid ${T.border}` }}>
         <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 8, color: T.textSub, fontWeight: 800 }}>QRS:</span>
            <span style={{ fontSize: 12, fontWeight: 950, color: T.primary }}>{c.axis.qrs}°</span>
         </div>
         <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 8, color: T.textSub, fontWeight: 800 }}>T:</span>
            <span style={{ fontSize: 12, fontWeight: 950, color: '#EF4444' }}>{c.axis.t}°</span>
         </div>
      </div>

      <VectorDiagram qrsAngle={c.axis.qrs} tAngle={c.axis.t} theme={T} compact={true} />

      <div style={{ display: 'flex', gap: 6 }}>
         <button 
          onClick={() => onEdit(c)}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '8px', borderRadius: 10, border: `1px solid ${T.primary}`, backgroundColor: 'transparent', color: T.primary, fontSize: 10, fontWeight: 950, cursor: 'pointer' }}
         >
            <Pencil size={12} strokeWidth={3} /> EDIT
         </button>
         <button 
          onClick={() => onView(c)}
          style={{ padding: '8px', borderRadius: 10, border: `1px solid ${T.border}`, backgroundColor: `${T.textSub}05`, color: T.textSub, cursor: 'pointer' }}
         >
            <Eye size={13} strokeWidth={3} />
         </button>
         <button 
          onClick={() => onDelete(c.id)}
          style={{ padding: '8px', borderRadius: 10, border: `1px solid ${T.danger}20`, backgroundColor: `${T.danger}10`, color: T.danger, cursor: 'pointer' }}
         >
            <Trash2 size={13} strokeWidth={3} />
         </button>
      </div>
    </div>
  );
});

const ClinicalCases = () => {
  const { theme: T } = useTheme();
  
  /* ─── State ─────────────────────────────────────────────── */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [cases, setCases] = useState(INITIAL_CASES);

  /* ─── Memoized Data ─────────────────────────────────────── */
  const filteredCases = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return cases.filter(c => 
      c.title.toLowerCase().includes(query) || 
      c.category.toLowerCase().includes(query)
    );
  }, [cases, searchQuery]);

  /* ─── Actions ───────────────────────────────────────────── */
  const openEditCase = useCallback((c) => {
    setEditingCase({...c});
    setViewOnly(false);
    setIsModalOpen(true);
  }, []);

  const openViewCase = useCallback((c) => {
    setEditingCase({...c});
    setViewOnly(true);
    setIsModalOpen(true);
  }, []);

  const openNewCase = useCallback(() => {
    setEditingCase({
      id: Date.now(),
      figure: `Figure ${cases.length + 1}`,
      title: '',
      category: 'Normal',
      status: 'Draft',
      description: '',
      findings: '',
      interpretation: '',
      axis: { qrs: 0, t: 0 },
      data: [
        { lead: 'I', qrs: '0', t: '0', st: '0' },
        { lead: 'II', qrs: '0', t: '0', st: '0' },
        { lead: 'III', qrs: '0', t: '0', st: '0' },
        { lead: 'aVR', qrs: '0', t: '0', st: '0' },
        { lead: 'aVL', qrs: '0', t: '0', st: '0' },
        { lead: 'aVF', qrs: '0', t: '0', st: '0' },
      ]
    });
    setViewOnly(false);
    setIsModalOpen(true);
  }, [cases.length]);
  
  const deleteCase = useCallback((id) => {
    if (window.confirm('Delete this clinical case?')) {
      setCases(prev => prev.filter(c => c.id !== id));
    }
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', padding: 0, backgroundColor: T.bg, color: T.text, overflow: 'hidden', margin: '-32px', width: 'calc(100% + 64px)'
    }}>
      {/* Scrollable Content */}
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
         {/* Section Header */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 2, letterSpacing: '-0.3px', color: T.text }}>Clinical Cases</h1>
               <p style={{ color: T.textSub, fontSize: 12 }}>Manage pre-loaded patient cases for diagnostic training.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
               <div style={{ padding: '5px 10px', borderRadius: 40, border: `1px solid ${T.border}`, backgroundColor: `${T.textSub}08`, fontSize: 11, fontWeight: 700 }}>
                  {cases.length} Cases
               </div>
               <button 
                onClick={openNewCase}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', backgroundColor: T.primary, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer', boxShadow: `0 4px 10px ${T.primary}25` }}
               >
                  <Plus size={14} strokeWidth={3} />
                  Add New
               </button>
            </div>
         </div>

         {/* Grid */}
         <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
            gap: 16,
            willChange: 'transform'
         }}>
            {filteredCases.map(c => (
              <CaseCard 
                key={c.id} 
                c={c} 
                T={T} 
                onEdit={openEditCase} 
                onView={openViewCase} 
                onDelete={deleteCase} 
              />
            ))}
         </div>
      </div>

      {/* ── Modal Overlay ── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn 0.2s'
        }}>
           <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)' }} onClick={() => setIsModalOpen(false)} />
           
           <div style={{
             width: '100%', maxWidth: 900, maxHeight: '94vh', backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 20px 40px -8px rgba(0,0,0,0.4)', zIndex: 10, animation: 'modalSlideUp 0.3s ease-out'
           }}>
              {/* Modal Header */}
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: `${T.bg}30` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                     <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: T.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, boxShadow: `0 4px 10px ${T.primary}30` }}>
                        {editingCase?.id?.toString().slice(-1)}
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: T.primary, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{editingCase?.figure}</div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: T.text }}>
                           {viewOnly ? 'View Clinical Case' : (editingCase?.title ? 'Edit Clinical Case' : 'Add New Case')}
                        </div>
                     </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', backgroundColor: T.bg, color: T.textSub, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}><X size={18} /></button>
               </div>

              {/* Modal Body */}
              <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
                 {/* Left: Form Fields */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                       <label style={{ fontSize: 10, fontWeight: 800, color: T.textSub, letterSpacing: '0.6px' }}>CASE TITLE</label>
                       <input 
                         type="text" 
                         disabled={viewOnly}
                         value={editingCase?.title} 
                         onChange={(e) => setEditingCase({...editingCase, title: e.target.value})}
                         placeholder="Enter descriptive case title..."
                         style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 15, fontWeight: 700, outline: 'none', transition: '0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                       />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <label style={{ fontSize: 10, fontWeight: 800, color: T.textSub, letterSpacing: '0.6px' }}>CATEGORY</label>
                          <div style={{ position: 'relative' }}>
                             <select 
                               disabled={viewOnly}
                               value={editingCase?.category}
                               onChange={(e) => setEditingCase({...editingCase, category: e.target.value})}
                               style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 14, fontWeight: 600, outline: 'none', appearance: 'none', cursor: viewOnly ? 'default' : 'pointer' }}
                             >
                                <option>Normal</option>
                                <option>Ischemia</option>
                                <option>MI</option>
                                <option>Conduction</option>
                                <option>Arrhythmia</option>
                             </select>
                             {!viewOnly && <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: T.textSub, pointerEvents: 'none' }} />}
                          </div>
                       </div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <label style={{ fontSize: 10, fontWeight: 800, color: T.textSub, letterSpacing: '0.6px' }}>STATUS</label>
                          <div style={{ position: 'relative' }}>
                             <select 
                               disabled={viewOnly}
                               value={editingCase?.status}
                               onChange={(e) => setEditingCase({...editingCase, status: e.target.value})}
                               style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 14, fontWeight: 600, outline: 'none', appearance: 'none', cursor: viewOnly ? 'default' : 'pointer' }}
                             >
                                <option>Active</option>
                                <option>Draft</option>
                             </select>
                             {!viewOnly && <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: T.textSub, pointerEvents: 'none' }} />}
                          </div>
                       </div>
                    </div>

                    {[
                      { label: 'Clinical Description', key: 'description' },
                      { label: 'ECG Findings', key: 'findings' },
                      { label: 'Vector Interpretation', key: 'interpretation' }
                    ].map(field => (
                      <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                         <label style={{ fontSize: 10, fontWeight: 800, color: T.textSub, letterSpacing: '0.6px' }}>{field.label.toUpperCase()}</label>
                         <textarea 
                           disabled={viewOnly}
                           rows={3}
                           value={editingCase?.[field.key] || ''}
                           onChange={(e) => setEditingCase({...editingCase, [field.key]: e.target.value})}
                           style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 14, fontWeight: 500, outline: 'none', resize: 'none', lineHeight: 1.6, transition: '0.2s' }}
                         />
                      </div>
                    ))}

                    <div style={{ padding: 16, borderRadius: 16, backgroundColor: `${T.primary}08`, border: `1px solid ${T.primary}15`, display: 'flex', gap: 12 }}>
                       <Info size={20} color={T.primary} style={{ flexShrink: 0, marginTop: 2 }} />
                       <p style={{ fontSize: 12, color: T.textSub, lineHeight: 1.5, margin: 0 }}>
                          These clinical details provide context for the ECG findings. The vector interpretation explains the electrical axis shifts calculated from the lead data.
                       </p>
                    </div>
                 </div>

                 {/* Right: Visualization & Data */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                       <label style={{ fontSize: 10, fontWeight: 800, color: T.textSub, letterSpacing: '0.6px', marginBottom: 12, display: 'block' }}>ELECTRICAL AXIS PREVIEW</label>
                       <VectorDiagram qrsAngle={editingCase?.axis.qrs} tAngle={editingCase?.axis.t} theme={T} />
                    </div>

                    <div style={{ backgroundColor: T.bg, border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                       <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 10, backgroundColor: `${T.primary}08` }}>
                          <Zap size={16} color={T.primary} />
                          <span style={{ fontSize: 13, fontWeight: 900, color: T.text, letterSpacing: '0.4px' }}>Lead Voltage Matrix</span>
                       </div>
                       
                       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                             <tr style={{ backgroundColor: `${T.textSub}05` }}>
                                <th style={{ padding: '10px 18px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: T.textSub, borderBottom: `1px solid ${T.border}` }}>LEAD</th>
                                <th style={{ padding: '10px', textAlign: 'center', fontSize: 11, fontWeight: 800, color: T.textSub, borderBottom: `1px solid ${T.border}` }}>QRS</th>
                                <th style={{ padding: '10px', textAlign: 'center', fontSize: 11, fontWeight: 800, color: T.textSub, borderBottom: `1px solid ${T.border}` }}>T</th>
                                <th style={{ padding: '10px', textAlign: 'center', fontSize: 11, fontWeight: 800, color: T.textSub, borderBottom: `1px solid ${T.border}` }}>ST</th>
                             </tr>
                          </thead>
                          <tbody>
                             {editingCase?.data.map((row, rowIdx) => (
                               <tr key={row.lead} style={{ transition: '0.2s', borderBottom: `1px solid ${T.border}` }}>
                                  <td style={{ padding: '12px 18px', fontWeight: 900, fontSize: 13, color: T.text }}>{row.lead}</td>
                                  {['qrs', 't', 'st'].map(field => (
                                    <td key={field} style={{ padding: '8px', textAlign: 'center' }}>
                                       <input 
                                        disabled={viewOnly}
                                        value={row[field]} 
                                        onChange={(e) => {
                                          const newData = [...editingCase.data];
                                          newData[rowIdx][field] = e.target.value;
                                          setEditingCase({...editingCase, data: newData});
                                        }}
                                        style={{ width: 50, padding: '8px', borderRadius: 10, border: `1px solid ${T.border}`, backgroundColor: T.card, color: T.text, textAlign: 'center', fontSize: 12, fontWeight: 700, outline: 'none', transition: '0.2s' }} 
                                       />
                                    </td>
                                  ))}
                               </tr>
                             ))}
                          </tbody>
                       </table>

                       <div style={{ padding: 20, backgroundColor: `${T.primary}05`, display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                             <ArrowUpRight size={14} color={T.primary} />
                             <span style={{ fontSize: 12, fontWeight: 900, color: T.text, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Axis Configuration</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <span style={{ fontSize: 9, fontWeight: 800, color: T.textSub }}>QRS VECTOR (°)</span>
                                <input 
                                  disabled={viewOnly}
                                  type="number"
                                  value={editingCase?.axis.qrs} 
                                  onChange={(e) => setEditingCase({...editingCase, axis: {...editingCase.axis, qrs: Number(e.target.value)}})}
                                  style={{ width: '100%', padding: '10px', borderRadius: 12, backgroundColor: T.card, border: `1px solid ${T.border}`, fontSize: 14, fontWeight: 900, color: T.primary, textAlign: 'center', outline: 'none' }} 
                                />
                             </div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <span style={{ fontSize: 9, fontWeight: 800, color: T.textSub }}>T VECTOR (°)</span>
                                <input 
                                  disabled={viewOnly}
                                  type="number"
                                  value={editingCase?.axis.t} 
                                  onChange={(e) => setEditingCase({...editingCase, axis: {...editingCase.axis, t: Number(e.target.value)}})}
                                  style={{ width: '100%', padding: '10px', borderRadius: 12, backgroundColor: T.card, border: `1px solid ${T.border}`, fontSize: 14, fontWeight: 900, color: '#EF4444', textAlign: 'center', outline: 'none' }} 
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '20px 24px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: `${T.bg}30` }}>
                  <button 
                   onClick={() => setIsModalOpen(false)}
                   style={{ backgroundColor: 'transparent', border: 'none', color: T.textSub, fontSize: 14, fontWeight: 700, cursor: 'pointer', padding: '10px 20px', borderRadius: 12, transition: '0.2s' }}
                  >
                     {viewOnly ? 'Close' : 'Cancel'}
                  </button>
                  {!viewOnly && (
                    <button 
                      onClick={() => {
                        if (editingCase.title) {
                          setCases(prev => {
                            const exists = prev.find(p => p.id === editingCase.id);
                            if (exists) return prev.map(p => p.id === editingCase.id ? editingCase : p);
                            return [...prev, editingCase];
                          });
                          setIsModalOpen(false);
                        }
                      }}
                      style={{ padding: '12px 28px', borderRadius: 14, backgroundColor: T.primary, color: '#fff', border: 'none', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 15px ${T.primary}40`, transition: '0.2s' }}
                    >
                      {cases.find(p => p.id === editingCase?.id) ? 'Update Case' : 'Create Case'}
                    </button>
                  )}
              </div>
           </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
};

export default ClinicalCases;
