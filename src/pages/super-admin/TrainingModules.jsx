import React, { useState, useMemo, memo } from 'react';
import {
  Compass, Activity, Stethoscope, Zap, Layers, LayoutGrid, FlipHorizontal,
  ChevronRight, Save, Trash2, Plus, Play, Monitor, Smartphone,
  Search, Bell, User, Edit3, CheckCircle2, ChevronLeft, ArrowLeft, Battery,
  Info, AlertTriangle, Settings
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_MODULES } from '../../data/trainingData';
import LeadReversalRenderer from './LeadReversalRenderer';
import PrecordialTrainingRenderer from './PrecordialTrainingRenderer';

// ── Default Data for Chest Leads ──────────────────────────────────────────────
const DEFAULT_STANDARD_LEADS = [
  { name: "V1", pos: "4th ICS, RSB", line: "Right Sternal Border", angle: 120, view: "Septal View", color: "#FFD600", top: "45%", left: "53%" },
  { name: "V2", pos: "4th ICS, LSB", line: "Left Sternal Border", angle: 90, view: "Septal View", color: "#FF9800", top: "45%", left: "47%" },
  { name: "V3", pos: "Midway V2-V4", line: "Left Parasternal", angle: 75, view: "Transition View", color: "#FF5722", top: "52%", left: "43%" },
  { name: "V4", pos: "5th ICS, MCL", line: "Mid-Clavicular Line", angle: 60, view: "Anterior View", color: "#E91E63", top: "57%", left: "40%" },
  { name: "V5", pos: "5th ICS, AAL", line: "Anterior Axillary Line", angle: 30, view: "Lateral View", color: "#9C27B0", top: "60%", left: "34%" },
  { name: "V6", pos: "5th ICS, MAL", line: "Mid-Axillary Line", angle: 0, view: "Lateral View", color: "#3F51B5", top: "62%", left: "28%" },
];

const DEFAULT_RIGHT_LEADS = [
  { name: "V1R", pos: "Mirror V2 (LSB)", line: "Left Sternal Border", angle: 90, view: "Right Sided", color: "#FF6B6B", top: "45%", left: "47%" },
  { name: "V2R", pos: "Mirror V1 (RSB)", line: "Right Sternal Border", angle: 120, view: "Right Sided", color: "#f59e0b", top: "45%", left: "53%" },
  { name: "V3R", pos: "Midway V1R-V4R", line: "Right Parasternal", angle: 105, view: "Right Sided", color: "#4ade80", top: "52%", left: "57%" },
  { name: "V4R", pos: "5th ICS, MCLR", line: "Right Mid-Clavicular", angle: 120, view: "RV View", color: "#00d4ff", top: "57%", left: "60%" },
  { name: "V5R", pos: "5th ICS, AALR", line: "Right Ant-Axillary", angle: 150, view: "RV View", color: "#a78bfa", top: "60%", left: "66%" },
  { name: "V6R", pos: "5th ICS, MALR", line: "Right Mid-Axillary", angle: 180, view: "RV View", color: "#f472b6", top: "62%", left: "72%" },
];

const DEFAULT_POSTERIOR_LEADS = [
  { name: "V7", pos: "Left Post-Axillary", line: "Posterior Axillary", angle: -30, view: "Posterior Wall", color: "#FF6B6B", top: "62%", left: "28%" },
  { name: "V8", pos: "Tip of left scapula", line: "Posterior Scapular", angle: -60, view: "Posterior Wall", color: "#FFD600", top: "54%", left: "38%" },
  { name: "V9", pos: "Left paraspinal", line: "Paravertebral Line", angle: -90, view: "Posterior Wall", color: "#4ade80", top: "52%", left: "48%" },
];

const DEFAULT_CLINICAL_NOTES = {
  standard: [
    "V1/V2 too high → Inverted P waves, RBBB morphology.",
    "V4-V6 too high → False poor R-wave progression.",
    "One ICS deviation can significantly alter ECG."
  ],
  right: [
    "V4R most sensitive for Right Ventricular MI.",
    "ST elevation ≥1mm in V4R is diagnostic.",
    "Always obtain Right-sided in inferior STEMI."
  ],
  posterior: [
    "Posterior MI shows reciprocal ST depression V1-V3.",
    "Direct ST elevation V7-V9 = posterior wall MI.",
    "Keep V7-V9 on same level as V4-V6 (5th ICS)."
  ],
};

const DEFAULT_WARNING_TEXT =
  "Correct electrode level for V4, V5, V6, V7, V8, V9 " +
  "is strictly in the horizontal plane at the 5th ICS.";

// ── Math Helpers ─────────────────────────────────────────────────────────────
const safeEval = (formula, variables) => {
  try {
    const keys = Object.keys(variables);
    const vals = Object.values(variables);
    return new Function(...keys, `return ${formula}`)(...vals);
  } catch (e) {
    console.warn("Eval Error:", e);
    return 0;
  }
};

// ── Renderer Components ──────────────────────────────────────────────────────

const ChestLeadsRenderer = ({ stdLeads, rgtLeads, pstLeads, notes, warningText, previewTheme }) => {
  const [activeTab, setActiveTab] = useState(0); // 0: Standard, 1: Right, 2: Posterior
  const [activeLeadIdx, setActiveLeadIdx] = useState(0);

  const leads = activeTab === 0 ? stdLeads : activeTab === 1 ? rgtLeads : pstLeads;
  const activeLead = leads[activeLeadIdx] || leads[0];
  const sectionKey = activeTab === 0 ? 'standard' : activeTab === 1 ? 'right' : 'posterior';
  const sectionNotes = notes[sectionKey] || [];
  const viewBadge = activeTab === 0 ? "STANDARD VIEW" : activeTab === 1 ? "RIGHT VIEW" : "POSTERIOR VIEW";

  const isDark = previewTheme === 'dark';
  const theme = {
    pageBg: isDark ? '#0A0F1A' : '#F8FAFC',
    cardBg: isDark ? '#1E293B' : '#FFFFFF',
    cardBorder: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0',
    text: isDark ? '#F1F5F9' : '#0F172A',
    mutedText: isDark ? '#94A3B8' : '#64748B',
    innerBg: isDark ? 'rgba(255,255,255,0.03)' : '#EEF2F7',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: theme.pageBg, color: theme.text, paddingBottom: '20px' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#1B6FDE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stethoscope color="#fff" size={20} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '900' }}>Chest Lead Placement</div>
          <div style={{ fontSize: '9px', color: theme.mutedText }}>Anatomical landmass identification</div>
        </div>
      </div>

      {/* 2. Section tab bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', backgroundColor: theme.innerBg, padding: '4px', borderRadius: '12px' }}>
        {['STANDARD', 'RIGHT', 'POST.'].map((label, idx) => (
          <button
            key={idx}
            onClick={() => { setActiveTab(idx); setActiveLeadIdx(0); }}
            style={{
              padding: '8px 2px', border: 'none', borderRadius: '8px', fontSize: '9px', fontWeight: '900', cursor: 'pointer',
              backgroundColor: activeTab === idx ? '#1B6FDE' : 'transparent',
              color: activeTab === idx ? '#fff' : theme.mutedText,
              transition: '0.2s'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 3. Anatomical Area */}
      <div style={{ padding: '12px', backgroundColor: '#071609', borderRadius: '24px', position: 'relative', overflow: 'hidden', aspectRatio: '1/1', border: `1px solid ${theme.cardBorder}` }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        <div style={{ position: 'absolute', top: '16px', left: '16px', padding: '4px 10px', backgroundColor: 'rgba(27,111,222,0.15)', color: '#1B6FDE', fontSize: '8px', fontWeight: '900', borderRadius: '20px', border: '1px solid rgba(27,111,222,0.3)', zIndex: 5 }}>
          {viewBadge}
        </div>

        <img src="/skeleton white.jpg" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.6 }} alt="Skeleton" />

        {leads.map((l, i) => (
          <button
            key={l.name}
            onClick={() => setActiveLeadIdx(i)}
            style={{
              position: 'absolute', top: l.top, left: l.left, transform: 'translate(-50%, -50%)',
              width: activeLeadIdx === i ? '28px' : '20px', height: activeLeadIdx === i ? '28px' : '20px',
              borderRadius: '50%', backgroundColor: l.color, border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '900', color: '#fff',
              cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 10
            }}
          >
            {l.name}
          </button>
        ))}
      </div>

      {/* 4. Lead Specifications card */}
      <div style={{ padding: '16px', backgroundColor: theme.cardBg, borderRadius: '20px', border: `1px solid ${theme.cardBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: activeLead.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: '900' }}>{activeLead.name}</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '900' }}>{activeLead.name} Lead</div>
            <div style={{ fontSize: '9px', color: theme.mutedText }}>{activeLead.view}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '10px', backgroundColor: theme.innerBg, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '8px', fontWeight: '900', color: theme.mutedText }}>PLACEMENT LOCATION</div>
            <div style={{ fontSize: '9px', fontWeight: '900', textAlign: 'right' }}>{activeLead.pos} <span style={{ color: theme.mutedText }}>|</span> {activeLead.line}</div>
          </div>
          <div style={{ padding: '10px', backgroundColor: theme.innerBg, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '8px', fontWeight: '900', color: theme.mutedText }}>VECTOR ANGLE</div>
            <div style={{ fontSize: '9px', fontWeight: '900', color: '#1B6FDE' }}>{activeLead.angle}°</div>
          </div>
        </div>
      </div>

      {/* 5. Clinical Significance card */}
      <div style={{ padding: '16px', backgroundColor: theme.cardBg, borderRadius: '20px', border: `1px solid ${theme.cardBorder}` }}>
        <div style={{ fontSize: '9px', fontWeight: '900', color: theme.mutedText, marginBottom: '12px', textTransform: 'uppercase' }}>Clinical Significance</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sectionNotes.map((note, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', padding: '10px', backgroundColor: theme.innerBg, borderRadius: '12px', alignItems: 'flex-start' }}>
              <Info size={12} color="#1B6FDE" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '9px', lineHeight: '1.4', fontWeight: '500' }}>{note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Warning card */}
      <div style={{ padding: '16px', backgroundColor: '#FFFBEB', borderRadius: '20px', border: '1px solid #FEF3C7', display: 'flex', gap: '12px' }}>
        <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '9px', fontWeight: '900', color: '#92400E', textTransform: 'uppercase' }}>STANDARDIZED LEVELING</div>
          <div style={{ fontSize: '9px', color: '#B45309', fontStyle: 'italic', marginTop: '4px', lineHeight: '1.4' }}>{warningText}</div>
        </div>
      </div>
    </div>
  );
};

const VectorDiagram = memo(({ mag, angle, leadAngles }) => {
  const cx = 50, cy = 50;
  const rad = (angle * Math.PI) / 180;
  const vx = cx + Math.cos(rad) * (mag * 6);
  const vy = cy + Math.sin(rad) * (mag * 6);

  return (
    <div style={{ padding: 12, backgroundColor: '#070C14', borderRadius: 24, border: '1px solid #1E293B', width: '100%', aspectRatio: '1/1' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <defs>
          <filter id="vectorGlow"><feGaussianBlur stdDeviation="1" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {Object.entries(leadAngles).map(([name, angDeg]) => {
          const lr = (angDeg * Math.PI) / 180;
          return (
            <g key={name} opacity="0.15">
              <line x1={cx - Math.cos(lr) * 40} y1={cy - Math.sin(lr) * 40} x2={cx + Math.cos(lr) * 40} y2={cy + Math.sin(lr) * 40} stroke="#00D4FF" strokeWidth="0.3" strokeDasharray="1 1" />
              <text x={cx + Math.cos(lr) * 44} y={cy + Math.sin(lr) * 44} fontSize="3" fill="#00D4FF" textAnchor="middle" dominantBaseline="middle" fontWeight="900">{name}</text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="40" fill="none" stroke="rgba(0, 212, 255, 0.05)" strokeWidth="0.5" />
        <line x1={cx} y1={cy} x2={vx} y2={vy} stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" filter="url(#vectorGlow)" />
        <circle cx={vx} cy={vy} r="1.5" fill="#00D4FF" filter="url(#vectorGlow)" />
        <circle cx={cx} cy={cy} r="1.2" fill="#fff" />
      </svg>
    </div>
  );
});

const VoltageRow = ({ name, voltage, maxMag }) => {
  const { theme: T } = useTheme();
  const percent = Math.min(100, Math.abs((voltage / maxMag) * 100));
  const isNeg = voltage < 0;
  const color = isNeg ? '#FF6B6B' : '#4ADE80';
  return (
    <div style={{ marginBottom: 8, fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', marginBottom: 4 }}>
        <span>Lead {name}</span>
        <span style={{ color }}>{voltage >= 0 ? '+' : ''}{voltage.toFixed(2)} mV</span>
      </div>
      <div style={{ height: 4, backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', backgroundColor: color, borderRadius: 10, transition: '0.3s ease' }} />
      </div>
    </div>
  );
};

const ECGGridRenderer = ({ speed, gain }) => (
  <div style={{ width: '100%', height: 120, backgroundColor: '#071609', borderRadius: 16, border: '1px solid #14532D', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      width: '100%', height: '100%',
      backgroundImage: `linear-gradient(rgba(0,255,136,0.1) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(0,255,136,0.1) 0.5px, transparent 0.5px)`,
      backgroundSize: `${25 / (speed / 25)}px ${25 / (gain / 10)}px`
    }} />
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
      <path d="M 0 60 Q 15 20 30 60 L 35 60 L 40 10 L 45 110 L 50 60 L 70 60 Q 85 90 100 60 L 120 60" fill="none" stroke="#00FF88" strokeWidth="1.5" transform={`scale(${25 / speed}, ${gain / 10}) translate(0, ${60 * (1 - gain / 10) / (gain / 10)})`} />
    </svg>
    <div style={{ position: 'absolute', bottom: 4, right: 8, fontSize: 8, fontWeight: 900, color: '#00FF88', opacity: 0.6 }}>{speed} mm/s | {gain} mm/mV</div>
  </div>
);

const VectorCircleRenderer = ({ vars, onUpdate }) => {
  const { theme: T } = useTheme();
  const caseIdx = Number(vars.caseIdx) || 0;
  const cases = vars.cases || [];
  const currentCase = cases[caseIdx] || { label: "Empty", qrsL1: 0, qrsAVF: 0, qrsAx: 0, note: "" };

  const settings = vars.displaySettings || { scale: 9, cx: 150, cy: 120, normalAngleThreshold: 60, showTriangleDefault: true, showDiameterDefault: false };
  const leadAxes = vars.leadAxes || [{ name: "I", deg: 0 }, { name: "aVL", deg: -30 }, { name: "II", deg: 60 }, { name: "aVF", deg: 90 }, { name: "III", deg: 120 }, { name: "aVR", deg: -150 }];

  const [showTriangle, setShowTriangle] = React.useState(settings.showTriangleDefault);
  const [showDiameter, setShowDiameter] = React.useState(settings.showDiameterDefault);

  // Dynamic Physics Evaluation
  const calcCircle = (l1, avf, type) => {
    if (l1 === undefined || l1 === null || avf === undefined || avf === null) return null;

    try {
      const posLogic = vars.physics?.pos || "cx + (l1 / 2) * scale";
      const radLogic = vars.physics?.rad || "Math.sqrt(l1*l1 + (1.154*avf)**2) / 2 * scale";

      const evalContext = {
        l1: Number(l1) || 0,
        avf: Number(avf) || 0,
        scale: Number(settings.scale) || 1,
        cx: Number(settings.cx) || 0,
        cy: Number(settings.cy) || 0,
        Math
      };

      const execute = (formula) => {
        try {
          const fn = new Function(...Object.keys(evalContext), `return ${formula}`);
          const res = fn(...Object.values(evalContext));
          return isNaN(res) ? 0 : res;
        } catch (e) {
          return 0;
        }
      };

      const r = execute(radLogic);
      const x = execute(posLogic);
      const y = execute(posLogic.replace(/l1/g, 'avf').replace(/cx/g, 'cy').replace(/\(l1 \/ 2\)/g, '(1.154 * avf / 2)'));

      return { x: x || 0, y: y || 0, r: Math.max(r || 0, 0) };
    } catch (e) {
      return null;
    }
  };

  const qrs = calcCircle(currentCase.qrsL1, currentCase.qrsAVF, 'qrs');
  const t = calcCircle(currentCase.tL1, currentCase.tAVF, 't');
  const st = calcCircle(currentCase.stL1, currentCase.stAVF, 'st');

  const angleDiff = (currentCase.tAx !== undefined && currentCase.tAx !== null) ? Math.abs((currentCase.qrsAx || 0) - (currentCase.tAx || 0)) : (currentCase.stAx !== undefined && currentCase.stAx !== null ? Math.abs((currentCase.qrsAx || 0) - (currentCase.stAx || 0)) : 0);
  const isAbnormal = angleDiff > (settings.normalAngleThreshold || 60);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Case Selector Tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '4px 0', scrollbarWidth: 'none' }} className="no-scrollbar">
        {cases.map((c, idx) => (
          <button
            key={`case-${idx}-${c.label}`}
            onClick={() => onUpdate(0, 'testValue', idx)}
            style={{
              padding: '6px 12px', borderRadius: 12, border: 'none', whiteSpace: 'nowrap', fontSize: 10, fontWeight: 800, cursor: 'pointer', transition: '0.2s',
              backgroundColor: (caseIdx === idx) ? '#1B6FDE' : (T.name === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff'),
              color: (caseIdx === idx) ? '#fff' : (T.name === 'dark' ? '#94A3B8' : '#64748B'),
              border: `1px solid ${(caseIdx === idx) ? '#1B6FDE' : T.border}`
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr ', gap: 14 }}>
        {/* CARD 1: Cardiac Vector Diagram */}
        <div style={{ padding: 16, backgroundColor: T.name === 'dark' ? '#1E293B' : '#fff', borderRadius: 24, border: `1px solid ${T.border}`, boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Compass size={12} color="#3B82F6" /> Vector Diagram
            </div>
            <button onClick={() => setShowTriangle(!showTriangle)} style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${T.border}`, backgroundColor: showTriangle ? '#3B82F620' : 'transparent', color: '#3B82F6', fontSize: 8, fontWeight: 900, cursor: 'pointer' }}>Triangle</button>
          </div>

          <div style={{ width: '100%', aspectRatio: '1', backgroundColor: '#0F172A', borderRadius: 16, border: '1px solid #334155', position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 300 300">
              <defs>
                <marker id="head-qrs-main" orient="auto" markerWidth="3" markerHeight="4" refX="0.1" refY="2">
                  <path d="M0,0 V4 L3,2 Z" fill="#3B82F6" />
                </marker>
                <marker id="head-t-main" orient="auto" markerWidth="3" markerHeight="4" refX="0.1" refY="2">
                  <path d="M0,0 V4 L3,2 Z" fill="#EF4444" />
                </marker>
                <marker id="head-st-main" orient="auto" markerWidth="3" markerHeight="4" refX="0.1" refY="2">
                  <path d="M0,0 V4 L3,2 Z" fill="#F59E0B" />
                </marker>
              </defs>
              {/* Hexaxial Background */}
              {leadAxes.map((l, i) => {
                const rad = (l.deg * Math.PI) / 180;
                const cx = 150, cy = 150;
                return (
                  <g key={`diag-${l.name}-${i}`} opacity="0.1">
                    <line x1={cx} y1={cy} x2={cx + Math.cos(rad) * 110} y2={cy + Math.sin(rad) * 110} stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
                    <text x={cx + Math.cos(rad) * 125} y={cy + Math.sin(rad) * 125} fontSize="10" fill="#94A3B8" textAnchor="middle" dominantBaseline="middle" fontWeight="900">{l.name}</text>
                  </g>
                );
              })}

              {/* Triangle */}
              {showTriangle && qrs && (
                <path d={`M 150 150 L ${150 + (qrs.x - 150) * 2} ${150 + (qrs.y - 150) * 2} L 150 150 Z`} fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.4" />
              )}

              {/* Vector Lines */}
              {qrs && <line x1="150" y1="150" x2={150 + (qrs.x - 150) * 2} y2={150 + (qrs.y - 150) * 2} stroke="#3B82F6" strokeWidth="3.5" markerEnd="url(#head-qrs-main)" strokeLinecap="round" />}
              {t && <line x1="150" y1="150" x2={150 + (t.x - 150) * 2} y2={150 + (t.y - 150) * 2} stroke="#EF4444" strokeWidth="3.5" markerEnd="url(#head-t-main)" strokeLinecap="round" />}
              {st && <line x1="150" y1="150" x2={150 + (st.x - 150) * 2} y2={150 + (st.y - 150) * 2} stroke="#F59E0B" strokeWidth="3.5" markerEnd="url(#head-st-main)" strokeLinecap="round" />}

              <circle cx="150" cy="150" r="4" fill="white" stroke="#0F172A" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* CARD 2: Cardiac Vector Circles */}
        <div style={{ padding: 16, backgroundColor: T.name === 'dark' ? '#1E293B' : '#fff', borderRadius: 24, border: `1px solid ${T.border}`, boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={12} color="#F59E0B" /> Vector Circles
            </div>
            <button onClick={() => setShowDiameter(!showDiameter)} style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${T.border}`, backgroundColor: showDiameter ? '#F59E0B20' : 'transparent', color: '#F59E0B', fontSize: 8, fontWeight: 900, cursor: 'pointer' }}>Diameter</button>
          </div>

          <div style={{ width: '100%', aspectRatio: '1', backgroundColor: '#0F172A', borderRadius: 16, border: '1px solid #334155', position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 300 300">
              <defs>
                <filter id="vectorGlowCirc"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>

              {/* Grid Lines */}
              <g opacity="0.05">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300].map(v => (
                  <React.Fragment key={`grid-${v}`}>
                    <line x1={v} y1="0" x2={v} y2="300" stroke="#00D4FF" strokeWidth="0.5" />
                    <line x1="0" y1={v} x2="300" y2={v} stroke="#00D4FF" strokeWidth="0.5" />
                  </React.Fragment>
                ))}
              </g>

              <line x1="0" y1="150" x2="300" y2="150" stroke="#1E293B" strokeWidth="1" />
              <line x1="150" y1="0" x2="150" y2="300" stroke="#1E293B" strokeWidth="1" />

              {/* Circles */}
              <g filter="url(#vectorGlowCirc)">
                {qrs && <circle cx={qrs.x} cy={qrs.y} r={qrs.r} fill="none" stroke="#3B82F6" strokeWidth="2.5" />}
                {t && <circle cx={t.x} cy={t.y} r={t.r} fill="none" stroke="#EF4444" strokeWidth="2.5" />}
                {st && <circle cx={st.x} cy={st.y} r={st.r} fill="none" stroke="#F59E0B" strokeWidth="2.5" />}
              </g>

              {/* Diameters */}
              {showDiameter && (
                <>
                  {qrs && <line x1="150" y1="150" x2={qrs.x + (qrs.x - 150)} y2={qrs.y + (qrs.y - 150)} stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />}
                  {t && <line x1="150" y1="150" x2={t.x + (t.x - 150)} y2={t.y + (t.y - 150)} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />}
                </>
              )}

              <circle cx="150" cy="150" r="4" fill="white" stroke="#0F172A" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats and Note */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ padding: 12, backgroundColor: T.name === 'dark' ? '#1E293B' : '#fff', borderRadius: 20, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 8, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', marginBottom: 4 }}>QRS Axis</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#3B82F6' }}>{(currentCase.qrsAx || 0).toFixed(2)}°</div>
          <div style={{ fontSize: 7, fontWeight: 900, color: '#3B82F640', textTransform: 'uppercase' }}>Depolarization</div>
        </div>
        <div style={{ padding: 12, backgroundColor: T.name === 'dark' ? '#1E293B' : '#fff', borderRadius: 20, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 8, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', marginBottom: 4 }}>{currentCase.stAx !== undefined && currentCase.stAx !== null ? 'ST Axis' : 'T Axis'}</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: currentCase.stAx !== undefined && currentCase.stAx !== null ? '#F59E0B' : '#EF4444' }}>
            {(currentCase.stAx || currentCase.tAx || 0).toFixed(2)}°
          </div>
          <div style={{ fontSize: 7, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
            <span>Repolarization</span>
            <span style={{ color: isAbnormal ? '#EF4444' : '#10B981' }}>{isAbnormal ? 'Abnormal' : 'Normal'}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: 16, backgroundColor: T.name === 'dark' ? '#1E293B' : '#fff', borderRadius: 20, border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 9, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', marginBottom: 8 }}>Case Interpretation</div>
        <div style={{ fontSize: 11, color: T.text, lineHeight: 1.5, fontWeight: 500 }}>{currentCase.note}</div>
      </div>
    </div>
  );
};

const ECGStandardizationRenderer = ({ vars, onUpdate }) => {
  const { theme: theme } = useTheme();
  const speedVal = vars.mmS || 25;
  const gainVal = vars.mm || 10;

  const SPEEDS = vars.speeds || [
    { label: "Standard", mmS: 25 },
    { label: "Double", mmS: 50 },
    { label: "Half", mmS: 12.5 },
  ];
  const SENS = vars.sens || [
    { label: "Standard", mm: 10 },
    { label: "Half (0.5X)", mm: 5 },
    { label: "Double (2X)", mm: 20 },
  ];

  const currentSens = SENS.find(s => s.mm === gainVal) || SENS[0];
  const currentSpeed = SPEEDS.find(s => s.mmS === speedVal) || SPEEDS[0];

  const handleUpdate = (variable, value) => {
    const idx = variable === 'mmS' ? 0 : 1;
    onUpdate(idx, 'testValue', value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Interactive Grid Monitor */}
      <div style={{ padding: 14, backgroundColor: theme.card, borderRadius: 24, border: `1px solid ${theme.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <p style={{ fontSize: 7, fontWeight: 900, color: theme.textSub, textTransform: 'uppercase', marginBottom: 10, textAlign: 'center', letterSpacing: '0.05em' }}>Interactive Grid Monitor</p>
        <div style={{ width: '100%', height: 120, backgroundColor: theme.name === 'dark' ? '#070C14' : '#E2E8F0', borderRadius: 20, position: 'relative', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
          <div style={{
            width: '100%', height: '100%', opacity: theme.name === 'dark' ? 1 : 0.4,
            backgroundImage: `linear-gradient(${theme.name === 'dark' ? 'rgba(0,255,136,0.1)' : 'rgba(0,0,0,0.08)'} 1px, transparent 1px), linear-gradient(90deg, ${theme.name === 'dark' ? 'rgba(0,255,136,0.1)' : 'rgba(0,0,0,0.08)'} 1px, transparent 1px)`,
            backgroundSize: `${8 * (speedVal / 25)}px 8px`
          }} />
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            <path d={`M 20 100 L 20 ${100 - gainVal * 6} L 40 ${100 - gainVal * 6} L 40 100`} fill="none" stroke="#00FF88" strokeWidth="2.5" strokeLinejoin="round" transform={`translate(0, -15)`} />
            <text x="48" y={92 - gainVal * 6} fontSize="8" fill="#00FF88" fontWeight="900" style={{ fontFamily: 'monospace' }}>{gainVal}mm Pulse</text>
          </svg>
          <div style={{ position: 'absolute', bottom: 6, right: 10, fontSize: 8, fontWeight: 900, color: '#00FF88', opacity: 0.8, fontFamily: 'monospace' }}>{speedVal}mm/s</div>
        </div>
      </div>

      {/* Gain Control (Deflection) */}
      <div style={{ padding: 16, backgroundColor: theme.card, borderRadius: 24, border: `1px solid ${theme.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <p style={{ fontSize: 8, fontWeight: 900, color: theme.textSub, textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gain Control (Deflection)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, backgroundColor: theme.name === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9', padding: 4, borderRadius: 16 }}>
          {SENS.map((s) => (
            <button
              key={s.label}
              onClick={() => handleUpdate('mm', s.mm)}
              style={{
                padding: '10px 0', borderRadius: 12, border: 'none', fontSize: 9, fontWeight: 900, cursor: 'pointer', transition: '0.2s',
                backgroundColor: gainVal === s.mm ? (theme.name === 'dark' ? '#1E293B' : '#fff') : 'transparent',
                color: gainVal === s.mm ? '#1B6FDE' : theme.textSub,
                boxShadow: gainVal === s.mm ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {s.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Sweep Control (Time Speed) */}
      <div style={{ padding: 16, backgroundColor: theme.card, borderRadius: 24, border: `1px solid ${theme.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <p style={{ fontSize: 8, fontWeight: 900, color: theme.textSub, textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sweep Control (Time Speed)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, backgroundColor: theme.name === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9', padding: 4, borderRadius: 16 }}>
          {SPEEDS.map((s) => (
            <button
              key={s.label}
              onClick={() => handleUpdate('mmS', s.mmS)}
              style={{
                padding: '10px 0', borderRadius: 12, border: 'none', fontSize: 9, fontWeight: 900, cursor: 'pointer', transition: '0.2s',
                backgroundColor: speedVal === s.mmS ? (theme.name === 'dark' ? '#1E293B' : '#fff') : 'transparent',
                color: speedVal === s.mmS ? '#1B6FDE' : theme.textSub,
                boxShadow: speedVal === s.mmS ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {s.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Scaling Standards Table */}
      <div style={{ padding: 18, backgroundColor: theme.card, borderRadius: 28, border: `1px solid ${theme.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <p style={{ fontSize: 9, fontWeight: 900, color: theme.textSub, textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.05em' }}>Scaling Standards Table</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'monospace' }}>
          {[
            { label: 'PAPER SPEED (SWEEP)', val: `${speedVal} mm/s` },
            { label: 'LARGE SQ TIME', val: `${(5 / speedVal * 1000).toFixed(0)} ms (${(5 / speedVal).toFixed(1)}s)` },
            { label: 'SMALL SQ TIME', val: `${(1 / speedVal * 1000).toFixed(0)} ms (${(1 / speedVal).toFixed(2)}s)` },
            { label: 'VOLTAGE (DEFLECTION)', val: `${gainVal} mm/mV` },
            { label: 'LARGE SQ VOLT', val: `${(5 / gainVal).toFixed(2)} mV` },
            { label: 'SMALL SQ VOLT', val: `${(1 / gainVal).toFixed(2)} mV` },
          ].map((row, i) => (
            <React.Fragment key={row.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, alignItems: 'center' }}>
                <span style={{ color: theme.textSub, fontWeight: 800 }}>{row.label}</span>
                <span style={{ color: theme.text, fontWeight: 900, fontSize: 9 }}>{row.val}</span>
              </div>
              {i < 5 && <div style={{ height: 1, backgroundColor: theme.border, opacity: 0.3 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Technical Standards Card */}
      <div style={{ padding: 20, backgroundColor: '#1B6FDE', borderRadius: 28, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1, transform: 'translate(20%, -20%)' }}><Activity size={120} /></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 12 }}>Technical Standards (PDF Page 4-6)</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#00FF88', marginBottom: 16, lineHeight: 1.5 }}>
            Isoelectric segments: TP segment, P-R segment, and ST segment are intervals where the line is at baseline.
          </div>
          <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 16 }} />
          <div style={{ fontSize: 10, fontWeight: 600, fontStyle: 'italic', color: '#fff', opacity: 0.9, lineHeight: 1.5 }}>
            "Deflection represents voltage magnitude, Sweep represents time duration."
          </div>
        </div>
      </div>
    </div>
  );
};

const VectorSimulatorRenderer = ({ vars }) => {
  const { theme: T } = useTheme();
  const mag = vars.magnitude || 0;
  const angle = vars.angle || 0;

  const leads = Object.entries(vars.leadAngles || { 'I': 0, 'II': 60, 'III': 120, 'aVR': -150, 'aVL': -30, 'aVF': 90 }).map(([name, a]) => ({ name, angle: a }));

  const getProjection = (leadAngle) => {
    const rad = (angle - leadAngle) * Math.PI / 180;
    return mag * Math.cos(rad);
  };

  const theme = {
    name: T.name,
    card: T.card,
    bg: T.bg,
    border: T.border,
    text: T.text,
    textSub: T.textSub,
    primary: T.primary
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Hex-Axial Reference */}
      <div style={{ padding: 12, backgroundColor: theme.card, borderRadius: 24, border: `1px solid ${theme.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: 7, fontWeight: 900, color: theme.textSub, textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: theme.primary }} /> 360° HEX-AXIAL REFERENCE
        </div>
        <div style={{ width: '100%', aspectRatio: '1.4', backgroundColor: theme.name === 'dark' ? '#070C14' : '#f1f5f9', borderRadius: 20, position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="glow"><feGaussianBlur stdDeviation="1" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <circle cx="50" cy="50" r="38" fill="none" stroke={theme.name === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} strokeWidth="0.5" strokeDasharray="1 1" />

            {leads.map(l => {
              const r = (l.angle * Math.PI) / 180;
              const vRad = (angle * Math.PI) / 180;
              const vLen = 32;
              const diff = vRad - r;
              const projLen = vLen * Math.cos(diff);
              const px = 50 + Math.cos(r) * projLen;
              const py = 50 + Math.sin(r) * projLen;

              if (isNaN(px) || isNaN(py)) return null;

              return (
                <g key={l.name}>
                  <line x1="50" y1="50" x2={50 + Math.cos(r) * 38} y2={50 + Math.sin(r) * 38} stroke={theme.name === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} strokeWidth="0.2" strokeDasharray="1 1" />
                  <line x1={50 + Math.cos(vRad) * vLen} y1={50 + Math.sin(vRad) * vLen} x2={px} y2={py} stroke={theme.name === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.2" strokeDasharray="0.5 0.5" />
                  <circle cx={px} cy={py} r="1" fill={projLen >= 0 ? '#4ADE80' : '#FF6B6B'} filter="url(#glow)" />
                  <text x={50 + Math.cos(r) * 44} y={50 + Math.sin(r) * 44} fontSize="2.5" fill={theme.textSub} textAnchor="middle" dominantBaseline="middle" fontWeight="900" style={{ fontFamily: 'monospace' }}>{l.name}</text>
                </g>
              );
            })}

            <g filter="url(#glow)">
              <line x1="50" y1="50" x2={50 + Math.cos(angle * Math.PI / 180) * 32} y2={50 + Math.sin(angle * Math.PI / 180) * 32} stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" />
              <circle cx={50 + Math.cos(angle * Math.PI / 180) * 32} cy={50 + Math.sin(angle * Math.PI / 180) * 32} r="2" fill="#00D4FF" />
            </g>
            <circle cx="50" cy="50" r="1.5" fill="#fff" />
            <text x="5" y="94" fontSize="4" fill="#00D4FF" fontWeight="900" style={{ fontFamily: 'monospace' }}>{angle}° | {mag}mV</text>
          </svg>
        </div>
      </div>

      {/* Lead Projections Map */}
      <div style={{ padding: 14, backgroundColor: theme.card, borderRadius: 24, border: `1px solid ${theme.border}` }}>
        <div style={{ fontSize: 7, fontWeight: 900, color: theme.textSub, textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#10B981' }} /> LEAD PROJECTIONS MAP
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {leads.map((l, i) => {
            const proj = getProjection(l.angle);
            const percent = Math.min(Math.abs(proj) / (mag || 1), 1) * 100;
            const color = proj >= 0 ? '#4ADE80' : '#FF6B6B';
            return (
              <div key={l.name} style={{ display: 'grid', gridTemplateColumns: '35px 15px 1fr 45px', alignItems: 'center', gap: 6, padding: '2px 0', borderBottom: `1px solid ${theme.border}40`, fontFamily: 'monospace', fontSize: 9 }}>
                <div style={{ fontWeight: 900, color: theme.textSub }}>{l.name}</div>
                <div style={{ color, fontWeight: 900 }}>{proj >= 0 ? '↑' : '↓'}</div>
                <div style={{ height: 3, backgroundColor: theme.bg, borderRadius: 10 }}>
                  <div style={{ height: '100%', width: `${percent}%`, backgroundColor: color, borderRadius: 10 }} />
                </div>
                <div style={{ textAlign: 'right', fontWeight: 900, color }}>{proj >= 0 ? '+' : ''}{proj.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
const HeartRateAxisRenderer = ({ vars, previewTheme, onUpdate }) => {
  const rrSmall = vars.rr_small || 20;
  const rrLarge = vars.rr_large || 4;
  const peaks = vars.peaks || 12;
  const l1 = vars.lead1 || 4;
  const avf = vars.avf || 9;

  const isDark = previewTheme === 'dark';
  const theme = {
    bg: isDark ? '#0A0F1A' : '#ffffff',
    card: isDark ? '#161F30' : '#ffffff',
    text: isDark ? '#ffffff' : '#0F172A',
    subText: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
    input: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
    inputBorder: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
  };

  const C = vars.constants || { small_const: 1500, large_const: 300, strip_mult: 6, axis_correction: 1.154, axis_min: -30, axis_max: 90 };

  const hrSmall = Math.round(C.small_const / Math.max(rrSmall, 1));
  const hrLarge = Math.round(C.large_const / Math.max(rrLarge, 1));
  const hrStrip = peaks * C.strip_mult;

  const tanAlpha = l1 !== 0 ? (C.axis_correction * avf) / l1 : 0;
  const alphaRad = Math.atan2(C.axis_correction * avf, l1);
  const alphaDeg = Math.round(alphaRad * 180 / Math.PI);

  const getAxisStatus = (deg) => {
    if (deg >= C.axis_min && deg <= C.axis_max) return { label: 'NORMAL AXIS', color: '#10B981', bg: isDark ? 'rgba(16,185,129,0.15)' : '#DEF7EC' };
    if (deg < C.axis_min && deg >= -90) return { label: 'LEFT AXIS', color: '#F59E0B', bg: isDark ? 'rgba(245,158,11,0.15)' : '#FEF3C7' };
    if (deg > C.axis_max && deg <= 180) return { label: 'RIGHT AXIS', color: '#EF4444', bg: isDark ? 'rgba(239,68,68,0.15)' : '#FEE2E2' };
    return { label: 'EXTREME', color: '#8B5CF6', bg: isDark ? 'rgba(139,92,246,0.15)' : '#EDE9FE' };
  };

  const status = getAxisStatus(alphaDeg);

  const handleLocalUpdate = (variable, value) => {
    let idx = -1;
    if (variable === 'rr_small') idx = 0;
    else if (variable === 'rr_large') idx = 1;
    else if (variable === 'peaks') idx = 2;
    else if (variable === 'lead1' || variable === 'avf') idx = 3;
    if (idx !== -1) onUpdate(idx, variable === 'avf' ? 'subVal' : 'testValue', Number(value));
  };

  const InputBox = ({ label, value, onChange, step = 1 }) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 7, fontWeight: 900, color: theme.subText, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <input type="number" step={step} value={value} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', padding: '8px 4px', backgroundColor: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, fontSize: 13, fontWeight: 900, color: theme.text, textAlign: 'center', outline: 'none' }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 4 }}>
      {/* Heart Rate Display */}
      <div style={{ padding: '16px 12px', backgroundColor: theme.card, borderRadius: 24, border: `1px solid ${theme.border}`, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: 44, fontWeight: 900, color: '#E91E63', lineHeight: 1, letterSpacing: '-0.04em' }}>{hrSmall}</div>
        <div style={{ fontSize: 8, fontWeight: 900, color: theme.subText, marginTop: 4, letterSpacing: '0.04em' }}>BEATS PER MINUTE</div>
        <div style={{ marginTop: 10, display: 'inline-block', backgroundColor: status.bg, color: status.color, fontSize: 8, fontWeight: 900, padding: '4px 12px', borderRadius: 20 }}>
          {hrSmall < 60 ? 'Bradycardia' : hrSmall > 100 ? 'Tachycardia' : 'Normal Sinus'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ padding: '10px', backgroundColor: theme.card, borderRadius: 20, border: `1px solid ${theme.border}` }}>
          <InputBox label="Small Squares" value={rrSmall} onChange={(val) => handleLocalUpdate('rr_small', val)} />
          <div style={{ fontSize: 7, fontWeight: 800, color: status.color, marginTop: 6, textAlign: 'center' }}>{C.small_const} ÷ {rrSmall} = {hrSmall}</div>
        </div>
        <div style={{ padding: '10px', backgroundColor: theme.card, borderRadius: 20, border: `1px solid ${theme.border}` }}>
          <InputBox label="Large Squares" value={rrLarge} onChange={(val) => handleLocalUpdate('rr_large', val)} />
          <div style={{ fontSize: 7, fontWeight: 800, color: status.color, marginTop: 6, textAlign: 'center' }}>{C.large_const} ÷ {rrLarge} = {hrLarge}</div>
        </div>
      </div>

      <div style={{ padding: 14, backgroundColor: theme.card, borderRadius: 20, border: `1px solid ${theme.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <InputBox label="Rhythm Strip (10s)" value={peaks} onChange={(val) => handleLocalUpdate('peaks', val)} />
          <div style={{ flex: 1, padding: '8px 10px', backgroundColor: isDark ? 'rgba(27,111,222,0.1)' : '#EFF6FF', borderRadius: 10, fontSize: 9, fontWeight: 800, color: '#1B6FDE', textAlign: 'center' }}>
            {peaks} × {C.strip_mult} = {hrStrip} bpm
          </div>
        </div>
      </div>

      {/* Axis Section */}
      <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 14 }}>
        <div style={{ padding: 12, backgroundColor: theme.card, borderRadius: 24, border: `1px solid ${theme.border}`, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <InputBox label="Lead I (mV)" value={l1} onChange={(val) => handleLocalUpdate('lead1', val)} step="0.1" />
            <InputBox label="aVF (mV)" value={avf} onChange={(val) => handleLocalUpdate('avf', val)} step="0.1" />
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>{alphaDeg}°</div>
              <div style={{ fontSize: 7, fontWeight: 900, color: status.color, marginTop: 2 }}>{status.label}</div>
            </div>
          </div>

          <div style={{ aspectRatio: '1', backgroundColor: '#070C14', borderRadius: 20, position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="1 2" />
              {['I', 'II', 'III', 'aVR', 'aVL', 'aVF'].map((name, i) => {
                const angle = [0, 60, 120, -150, -30, 90][i];
                const r = (angle * Math.PI) / 180;
                return (
                  <g key={name}>
                    <line x1="50" y1="50" x2={50 + Math.cos(r) * 38} y2={50 + Math.sin(r) * 38} stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
                    <text x={50 + Math.cos(r) * 44} y={50 + Math.sin(r) * 44} fontSize="3" fill="rgba(255,255,255,0.4)" textAnchor="middle" dominantBaseline="middle" fontWeight="900">{name}</text>
                  </g>
                );
              })}
              {!isNaN(alphaRad) && (
                <>
                  <line x1="50" y1="50" x2={50 + Math.cos(alphaRad) * 35} y2={50 + Math.sin(alphaRad) * 35} stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" />
                  <circle cx={50 + Math.cos(alphaRad) * 35} cy={50 + Math.sin(alphaRad) * 35} r="2" fill="#00D4FF" />
                </>
              )}
              <circle cx="50" cy="50" r="1.5" fill="#fff" />
            </svg>
          </div>
        </div>

        <div style={{ padding: '10px 14px', backgroundColor: '#070C14', borderRadius: 16, marginTop: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, lineHeight: 1.6, color: '#94A3B8' }}>
            <span style={{ color: '#00D4FF' }}>tanα</span> = ({C.axis_correction} × <span style={{ color: '#FBBF24' }}>{avf}</span>) / {l1} = <span style={{ color: '#fff', fontWeight: 900 }}>{tanAlpha.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};





const TrainingModules = () => {
  const { theme: T } = useTheme();
  const [activeTM, setActiveTM] = useState(
    Number(Object.keys(INITIAL_MODULES)[0])
  );
  const [modulesData, setModulesData] = useState(INITIAL_MODULES);

  // Chest Lead State
  const [stdLeads, setStdLeads] = useState(DEFAULT_STANDARD_LEADS);
  const [rgtLeads, setRgtLeads] = useState(DEFAULT_RIGHT_LEADS);
  const [pstLeads, setPstLeads] = useState(DEFAULT_POSTERIOR_LEADS);
  const [notes, setNotes] = useState(DEFAULT_CLINICAL_NOTES);
  const [warningText, setWarningText] = useState(DEFAULT_WARNING_TEXT);
  const [activeLeadTab, setActiveLeadTab] = useState(0); // 0:V1-V6, 1:V1R-V6R, 2:V7-V9
  const [activeNoteTab, setActiveNoteTab] = useState('standard');

  const previewTheme = T.name === 'light' ? 'light' : 'dark';

  const activeModule = modulesData[activeTM] || {};
  const formulas = activeModule.formulas || [];

  const varsPool = useMemo(() => {
    const p = {};
    formulas.forEach(f => {
      p[f.variable] = f.testValue;
      if (f.subVar) p[f.subVar] = f.subVal;
    });
    if (activeModule.speeds) p.speeds = activeModule.speeds;
    if (activeModule.sens) p.sens = activeModule.sens;
    if (activeModule.constants) p.constants = activeModule.constants;
    if (activeModule.leadProfiles) p.leadProfiles = activeModule.leadProfiles;
    if (activeModule.reversalInfo) p.reversalInfo = activeModule.reversalInfo;
    if (activeModule.leadAngles) p.leadAngles = activeModule.leadAngles;
    if (activeModule.leadAxes) p.leadAxes = activeModule.leadAxes;
    if (activeModule.displaySettings) p.displaySettings = activeModule.displaySettings;
    if (activeModule.cases) p.cases = activeModule.cases;
    if (activeModule.diagramConstants) p.diagramConstants = activeModule.diagramConstants;
    if (activeModule.physics) p.physics = activeModule.physics;
    return p;
  }, [formulas, activeModule.speeds, activeModule.sens, activeModule.constants, activeModule.leadProfiles, activeModule.reversalInfo, activeModule.leadAngles, activeModule.leadAxes, activeModule.displaySettings, activeModule.cases, activeModule.diagramConstants, activeModule.physics]);

  const handleUpdateFormula = (idx, field, value) => {
    setModulesData(prev => ({
      ...prev,
      [activeTM]: {
        ...prev[activeTM],
        formulas: prev[activeTM].formulas.map((f, i) =>
          i === idx ? { ...f, [field]: value } : f
        )
      }
    }));
  };

  const handleUpdateTable = (type, rowIdx, field, value) => {
    setModulesData(prev => ({
      ...prev,
      [activeTM]: {
        ...prev[activeTM],
        [type]: prev[activeTM][type].map((row, i) =>
          i === rowIdx ? { ...row, [field]: value } : row
        )
      }
    }));
  };

  const handleUpdateNested = (type, subKey, field, value) => {
    setModulesData(prev => {
      const parent = prev[activeTM][type] || {};
      let updatedValue;
      if (field) {
        updatedValue = { ...parent[subKey], [field]: value };
      } else {
        updatedValue = value;
      }

      return {
        ...prev,
        [activeTM]: {
          ...prev[activeTM],
          [type]: {
            ...parent,
            [subKey]: updatedValue
          }
        }
      };
    });
  };

  // Chest Lead Handlers
  const updateLead = (setter, idx, field, val) =>
    setter(prev => prev.map((l, i) => i === idx ? { ...l, [field]: val } : l));

  const updateNote = (section, idx, val) =>
    setNotes(prev => ({
      ...prev,
      [section]: prev[section].map((n, i) => i === idx ? val : n)
    }));

  const handleResetWaveAmp = (type) => {
    const defaults = {
      rS: { p: 4, q: -2, r: 10, s: -22, t: -4 },
      RS: { p: 5, q: -3, r: 20, s: -18, t: 5 },
      qR: { p: 5, q: -4, r: 28, s: -5, t: 8 }
    };
    if (!defaults[type]) return;
    setModulesData(prev => ({
      ...prev,
      [activeTM]: {
        ...prev[activeTM],
        waveAmps: {
          ...prev[activeTM].waveAmps,
          [type]: { ...defaults[type] }
        }
      }
    }));
  };

  const toggleReversalRule = (reversalId, lead, ruleType) => {
    setModulesData(prev => {
      const currentRules = { ...prev[activeTM].reversalInfo[reversalId] };
      if (!currentRules[ruleType]) currentRules[ruleType] = [];

      const exists = currentRules[ruleType].includes(lead);
      const updatedList = exists
        ? currentRules[ruleType].filter(l => l !== lead)
        : [...currentRules[ruleType], lead];

      return {
        ...prev,
        [activeTM]: {
          ...prev[activeTM],
          reversalInfo: {
            ...prev[activeTM].reversalInfo,
            [reversalId]: {
              ...currentRules,
              [ruleType]: updatedList
            }
          }
        }
      };
    });
  };

  const handleUpdateSwap = (reversalId, leadFrom, leadTo) => {
    setModulesData(prev => {
      const currentRules = { ...prev[activeTM].reversalInfo[reversalId] };
      const swaps = { ...currentRules.swaps };
      if (!leadTo) delete swaps[leadFrom];
      else swaps[leadFrom] = leadTo;

      return {
        ...prev,
        [activeTM]: {
          ...prev[activeTM],
          reversalInfo: {
            ...prev[activeTM].reversalInfo,
            [reversalId]: {
              ...currentRules,
              swaps
            }
          }
        }
      };
    });
  };

  const handleUpdateConstants = (field, value) => {
    setModulesData(prev => ({
      ...prev,
      [activeTM]: {
        ...prev[activeTM],
        constants: {
          ...prev[activeTM].constants,
          [field]: value
        }
      }
    }));
  };

  const handleResetConstants = (field) => {
    const defaults = {
      small_const: 1500,
      large_const: 300,
      strip_mult: 6,
      axis_correction: 1.154,
      axis_min: -30,
      axis_max: 90
    };
    handleUpdateConstants(field, defaults[field]);
  };

  const renderPreviewPanel = () => {
    if (activeTM === 1) return <VectorSimulatorRenderer vars={varsPool} onUpdate={handleUpdateFormula} />;
    if (activeTM === 2) return <ECGStandardizationRenderer vars={varsPool} onUpdate={handleUpdateFormula} />;
    if (activeTM === 3) return <ChestLeadsRenderer stdLeads={stdLeads} rgtLeads={rgtLeads} pstLeads={pstLeads} notes={notes} warningText={warningText} previewTheme={previewTheme} />;
    if (activeTM === 4) return <VectorCircleRenderer vars={varsPool} onUpdate={handleUpdateFormula} />;
    if (activeTM === 9) return <VectorCircleRenderer vars={varsPool} onUpdate={handleUpdateFormula} />;
    if (activeTM === 5) return <LeadReversalRenderer vars={varsPool} previewTheme={previewTheme} />;
    if (activeTM === 6) {
      return <HeartRateAxisRenderer vars={varsPool} previewTheme={previewTheme} onUpdate={handleUpdateFormula} />;
    }
    if (activeTM === 7) return <PrecordialTrainingRenderer leads={activeModule.leads || []} waveAmps={activeModule.waveAmps || {}} />;
    return null;
  };

  const renderVectorSimulatorEditor = () => {
    const mag = formulas[0].testValue;
    const angle = formulas[1].testValue;

    const getProjection = (leadAngle) => {
      const rad = (angle - leadAngle) * Math.PI / 180;
      return mag * Math.cos(rad);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ backgroundColor: T.card, borderRadius: 24, border: `1px solid ${T.border}`, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: T.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.primary }}><Compass size={18} /></div>
            <h3 style={{ fontSize: 13, fontWeight: 800 }}>Vector Parameter Editor</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 9, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Magnitude (mV)</label>
              <input type="number" step="0.1" value={mag} onChange={(e) => handleUpdateFormula(0, 'testValue', Number(e.target.value))} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, backgroundColor: T.bg, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, fontWeight: 700, outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: 9, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Angle (°)</label>
              <input type="number" value={angle} onChange={(e) => handleUpdateFormula(1, 'testValue', Number(e.target.value))} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, backgroundColor: T.bg, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, fontWeight: 700, outline: 'none' }} />
            </div>
          </div>

          <input type="range" min="-180" max="180" value={angle} onChange={(e) => handleUpdateFormula(1, 'testValue', Number(e.target.value))} style={{ width: '100%', accentColor: T.primary, height: 6, borderRadius: 3, cursor: 'pointer' }} />
        </div>

        {/* LEAD ANGLES EDITOR */}
        <div style={{ backgroundColor: T.card, borderRadius: 24, border: `1px solid ${T.border}`, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9' }}><Compass size={18} /></div>
            <h3 style={{ fontSize: 13, fontWeight: 800 }}>Lead Axis Orientation (Degrees)</h3>
          </div>
          <p style={{ fontSize: 11, color: T.textSub, marginBottom: 20, lineHeight: 1.5 }}>
            Adjust the standard frontal plane axis for each lead. These degrees determine the magnitude of the projection.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {Object.entries(activeModule.leadAngles || {}).map(([lead, ang]) => (
              <div key={lead} style={{ padding: '12px', backgroundColor: T.bg, borderRadius: 16, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: T.primary, fontFamily: 'monospace' }}>{lead}</span>
                <input
                  type="number"
                  value={ang}
                  onChange={(e) => setModulesData(prev => ({
                    ...prev,
                    [activeTM]: {
                      ...prev[activeTM],
                      leadAngles: { ...prev[activeTM].leadAngles, [lead]: Number(e.target.value) }
                    }
                  }))}
                  style={{ width: '50px', padding: '6px 6px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.card, color: T.text, fontSize: 11, fontWeight: 800, textAlign: 'center' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: T.card, borderRadius: 24, border: `1px solid ${T.border}`, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}><LayoutGrid size={18} /></div>
            <h3 style={{ fontSize: 13, fontWeight: 800 }}>Calculated Lead Projections</h3>
          </div>
          <div style={{ border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden', fontFamily: 'monospace' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.05)' : '#F8FAFC', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ padding: '8px', fontSize: 8, fontWeight: 900, color: T.textSub, borderRight: `1px solid ${T.border}`, textTransform: 'uppercase' }}>Angle</div>
              {['0°', '30°', '45°', '60°', '90°'].map(a => <div key={a} style={{ padding: '8px', fontSize: 9, fontWeight: 800, textAlign: 'center', borderRight: a !== '90°' ? `1px solid ${T.border}` : 'none', color: T.text }}>{a}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', backgroundColor: T.card }}>
              <div style={{ padding: '8px', fontSize: 8, fontWeight: 900, color: T.textSub, borderRight: `1px solid ${T.border}`, textTransform: 'uppercase' }}>COS</div>
              {['1.00', '0.87', '0.71', '0.50', '0.00'].map((c, i) => (
                <div key={i} style={{ padding: '8px', fontSize: 9, fontWeight: 900, textAlign: 'center', color: c === '0.50' ? T.primary : T.text, borderRight: i !== 4 ? `1px solid ${T.border}` : 'none' }}>{c}</div>
              ))}
            </div>
          </div>
        </div>

        {/* COSINE DECO FOR ADMIN SIDE */}
        <div style={{ padding: '16px', backgroundColor: T.bg, borderRadius: 20, border: `1px solid ${T.border}40`, fontStyle: 'italic', color: T.textSub, fontSize: 11, textAlign: 'center', fontWeight: 600 }}>
          "Voltage magnitude varies with the cosine of the angle between vector and lead."
        </div>
      </div>
    );
  };

  const renderChestLeadEditor = () => {
    const activeLeads = activeLeadTab === 0 ? stdLeads : activeLeadTab === 1 ? rgtLeads : pstLeads;
    const activeSetter = activeLeadTab === 0 ? setStdLeads : activeLeadTab === 1 ? setRgtLeads : setPstLeads;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* EDITOR SECTION 1 — Lead Configuration */}
        <div style={{ backgroundColor: T.card, borderRadius: 24, border: `1px solid ${T.border}`, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B6FDE' }}><LayoutGrid size={18} /></div>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lead Configuration</h3>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 20, backgroundColor: T.bg, padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
            {['V1-V6', 'V1R-V6R', 'V7-V9'].map((label, idx) => (
              <button
                key={label}
                onClick={() => setActiveLeadTab(idx)}
                style={{
                  padding: '8px 20px', border: 'none', borderRadius: '10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer',
                  backgroundColor: activeLeadTab === idx ? '#1B6FDE' : 'transparent',
                  color: activeLeadTab === idx ? '#fff' : T.textSub,
                  transition: '0.2s'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  {['Lead', 'Angle', 'Position', 'Line', 'View', 'Color', 'Top%', 'Left%'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 10px', color: T.textSub, fontWeight: 900, textTransform: 'uppercase', fontSize: 9 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeLeads.map((lead, idx) => (
                  <tr key={lead.name} style={{ borderBottom: idx === activeLeads.length - 1 ? 'none' : `1px solid ${T.border}50` }}>
                    <td style={{ padding: '10px', fontSize: 12, fontWeight: 900, color: '#1B6FDE' }}>{lead.name}</td>
                    <td style={{ padding: '6px' }}><input type="number" step="1" value={lead.angle} onChange={(e) => updateLead(activeSetter, idx, 'angle', Number(e.target.value))} style={{ width: 50, padding: 8, borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 700 }} /></td>
                    <td style={{ padding: '6px' }}><input type="text" value={lead.pos} onChange={(e) => updateLead(activeSetter, idx, 'pos', e.target.value)} style={{ width: 100, padding: 8, borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 600 }} /></td>
                    <td style={{ padding: '6px' }}><input type="text" value={lead.line} onChange={(e) => updateLead(activeSetter, idx, 'line', e.target.value)} style={{ width: 120, padding: 8, borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 600 }} /></td>
                    <td style={{ padding: '6px' }}><input type="text" value={lead.view} onChange={(e) => updateLead(activeSetter, idx, 'view', e.target.value)} style={{ width: 100, padding: 8, borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 600 }} /></td>
                    <td style={{ padding: '6px' }}><input type="color" value={lead.color} onChange={(e) => updateLead(activeSetter, idx, 'color', e.target.value)} style={{ width: 36, height: 36, padding: 2, borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, cursor: 'pointer' }} /></td>
                    <td style={{ padding: '6px' }}><input type="text" value={lead.top} onChange={(e) => updateLead(activeSetter, idx, 'top', e.target.value)} style={{ width: 60, padding: 8, borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 700 }} /></td>
                    <td style={{ padding: '6px' }}><input type="text" value={lead.left} onChange={(e) => updateLead(activeSetter, idx, 'left', e.target.value)} style={{ width: 60, padding: 8, borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 700 }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EDITOR SECTION 2 — Clinical Notes */}
        <div style={{ backgroundColor: T.card, borderRadius: 24, border: `1px solid ${T.border}`, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}><Info size={18} /></div>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clinical Significance Notes</h3>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 20, backgroundColor: T.bg, padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
            {['standard', 'right', 'posterior'].map((key) => (
              <button
                key={key}
                onClick={() => setActiveNoteTab(key)}
                style={{
                  padding: '8px 20px', border: 'none', borderRadius: '10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer',
                  backgroundColor: activeNoteTab === key ? '#1B6FDE' : 'transparent',
                  color: activeNoteTab === key ? '#fff' : T.textSub,
                  transition: '0.2s', textTransform: 'capitalize'
                }}
              >
                {key}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notes[activeNoteTab].map((note, idx) => (
              <div key={`note-${activeNoteTab}-${idx}`}>
                <label style={{ fontSize: 9, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Note {idx + 1}</label>
                <input
                  type="text"
                  value={note || ''}
                  onChange={(e) => updateNote(activeNoteTab, idx, e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 12, backgroundColor: T.bg, border: `1px solid ${T.border}`, color: T.text, fontSize: 12, fontWeight: 500 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* EDITOR SECTION 3 — Warning Text */}
        <div style={{ backgroundColor: T.card, borderRadius: 24, border: `1px solid ${T.border}`, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}><AlertTriangle size={18} /></div>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Standardized Leveling Warning</h3>
          </div>
          <textarea
            rows={3}
            value={warningText || ''}
            onChange={(e) => setWarningText(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 12, backgroundColor: T.bg, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, fontWeight: 500, lineHeight: 1.5, resize: 'none' }}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 52px)', margin: '-32px', width: 'calc(100% + 64px)', backgroundColor: T.bg, overflow: 'hidden' }}>
      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Header matching Learning Modules style */}
      <header style={{
        height: 52, padding: '0 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: T.card, zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: T.textSub }}>Admin &gt; {activeModule.title}</div>
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Training Module Editor</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#1B6FDE', fontWeight: 600 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1B6FDE' }}></div>
            Active Logic
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{ color: '#EF4444', background: 'none', border: 'none', fontWeight: 600, fontSize: 11, cursor: 'pointer' }}>Discard</button>
          <div style={{ width: 1, height: 20, backgroundColor: T.border }}></div>
          <button style={{ padding: '6px 20px', backgroundColor: '#1B6FDE', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 12px rgba(27,111,222,0.2)' }}>Publish</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '240px 1fr 300px', overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{ borderRight: `1px solid ${T.border}`, padding: '12px 6px', backgroundColor: T.sidebar, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          <div style={{ padding: '16px 12px', borderBottom: `1px solid ${T.border}`, backgroundColor: T.sidebar }}><h2 style={{ fontSize: 10, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Training Catalog</h2></div>
          <div style={{ padding: '12px 4px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.values(modulesData).map((m) => {
              const Icon = m.icon; const isActive = activeTM === m.id;
              return <button key={m.id} onClick={() => setActiveTM(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 8px', borderRadius: 10, backgroundColor: isActive ? (T.name === 'dark' ? 'rgba(27,111,222,0.15)' : '#F1F5F9') : 'transparent', color: isActive ? '#1B6FDE' : (T.name === 'dark' ? '#94A3B8' : '#64748B'), border: isActive ? `1px solid ${T.primary}40` : '1px solid transparent', textAlign: 'left', transition: '0.2s', cursor: 'pointer' }}><Icon size={16} strokeWidth={isActive ? 2.5 : 2} /><span style={{ fontSize: 12, fontWeight: isActive ? 800 : 500, whiteSpace: 'nowrap' }}>{m.title}</span></button>;
            })}
          </div>
        </aside>

        {/* Editor */}
        <main style={{ padding: '12px 32px', overflowY: 'auto', minWidth: 0, backgroundColor: T.bg, display: 'flex', flexDirection: 'column', gap: 12 }} className="no-scrollbar">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#94A3B8', fontSize: 10, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Admin <ChevronRight size={10} strokeWidth={3} /> {activeModule.title}</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.02em' }}>Module Logic Editor</h1>
                  <p style={{ color: '#64748B', fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>Adjust parameters and data for <span style={{ color: '#1B6FDE', fontWeight: 700 }}>{activeModule.title}</span>.</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginTop: 2 }}>
                  <button style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${T.border}`, backgroundColor: T.card, color: T.text, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Discard</button>
                  <button style={{ padding: '8px 16px', borderRadius: 10, backgroundColor: '#1B6FDE', color: '#fff', fontSize: 11, fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(27,111,222,0.3)' }}>Save</button>
                </div>
              </div>
            </div>

            {activeTM === 1 ? (
              renderVectorSimulatorEditor()
            ) : activeTM === 9 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ backgroundColor: T.card, borderRadius: 20, border: `1px solid ${T.border}`, padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}><Compass size={16} /></div>
                    <h3 style={{ fontSize: 13, fontWeight: 800 }}>Clinical Vector Cases (9 Patterns)</h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                          {['Preview', 'Case Label', 'QRS (∠/M)', 'T (∠/M)', 'Interpretation', 'Status'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '10px 8px', color: T.textSub, fontWeight: 900, textTransform: 'uppercase', fontSize: 9 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeModule.cases.map((c, i) => {
                          const isActive = (varsPool.caseIdx || 0) === i;
                          return (
                            <tr key={c.id} style={{
                              borderBottom: i === 8 ? 'none' : `1px solid ${T.border}40`,
                              backgroundColor: isActive ? `${T.primary}08` : 'transparent',
                              transition: '0.2s'
                            }}>
                              <td style={{ padding: '8px 4px' }}>
                                <button
                                  onClick={() => handleUpdateFormula(0, 'testValue', i)}
                                  style={{
                                    padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                    backgroundColor: isActive ? T.primary : T.bg,
                                    color: isActive ? '#fff' : T.textSub,
                                    fontSize: 8, fontWeight: 900, textTransform: 'uppercase',
                                    border: `1px solid ${isActive ? T.primary : T.border}`
                                  }}
                                >
                                  {isActive ? 'Active' : 'Show'}
                                </button>
                              </td>
                              <td style={{ padding: '8px 4px' }}><input value={c.label} onChange={(e) => handleUpdateTable('cases', i, 'label', e.target.value)} style={{ width: 100, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 800 }} /></td>
                              <td style={{ padding: '8px 4px' }}>
                                <div style={{ display: 'flex', gap: 4 }}>
                                  <input type="number" value={c.qrs} onChange={(e) => handleUpdateTable('cases', i, 'qrs', Number(e.target.value))} style={{ width: 45, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 10, fontWeight: 700 }} title="Angle" />
                                  <input type="number" value={c.qrsM} onChange={(e) => handleUpdateTable('cases', i, 'qrsM', Number(e.target.value))} style={{ width: 45, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 10, fontWeight: 700 }} title="Magnitude" />
                                </div>
                              </td>
                              <td style={{ padding: '8px 4px' }}>
                                <div style={{ display: 'flex', gap: 4 }}>
                                  <input type="number" value={c.t} onChange={(e) => handleUpdateTable('cases', i, 't', Number(e.target.value))} style={{ width: 45, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 10, fontWeight: 700 }} title="Angle" />
                                  <input type="number" value={c.tM} onChange={(e) => handleUpdateTable('cases', i, 'tM', Number(e.target.value))} style={{ width: 45, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 10, fontWeight: 700 }} title="Magnitude" />
                                </div>
                              </td>
                              <td style={{ padding: '8px 4px' }}><input value={c.interpretation} onChange={(e) => handleUpdateTable('cases', i, 'interpretation', e.target.value)} style={{ width: 180, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 10, fontWeight: 600 }} /></td>
                              <td style={{ padding: '8px 4px' }}>
                                <select value={c.status} onChange={(e) => handleUpdateTable('cases', i, 'status', e.target.value)} style={{ width: 80, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 10, fontWeight: 800 }}>
                                  <option value="normal">Normal</option>
                                  <option value="warning">Warning</option>
                                  <option value="danger">Danger</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* CASES EDITOR - IMPROVED VISIBILITY */}
                <div style={{ backgroundColor: '#1E293B', borderRadius: 24, border: '1px solid #334155', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#1B6FDE20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B6FDE' }}><Activity size={18} /></div>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#F8FAFC' }}>Clinical Pattern Library</h3>
                        <p style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Configure the 9 clinical cases and their vector amplitudes</p>
                      </div>
                    </div>
                    <button onClick={() => setModulesData(prev => ({ ...prev, [9]: { ...prev[9], cases: [...prev[9].cases, { label: "New Pattern", qrsL1: 0, qrsAVF: 0, qrsAx: 0, note: "" }] } }))} style={{ padding: '10px 20px', backgroundColor: '#1B6FDE', color: '#fff', border: 'none', borderRadius: 12, fontSize: 11, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(27,111,222,0.3)' }}>+ Add Pattern</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {activeModule.cases.map((c, i) => {
                      const isActive = (varsPool.caseIdx || 0) === i;
                      return (
                        <div key={i} style={{
                          backgroundColor: isActive ? '#1B6FDE10' : '#0F172A',
                          borderRadius: 20,
                          border: `1px solid ${isActive ? '#1B6FDE40' : '#334155'}`,
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12,
                          transition: '0.2s'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <button onClick={() => handleUpdateFormula(0, 'testValue', i)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', backgroundColor: isActive ? '#1B6FDE' : '#1E293B', color: isActive ? '#fff' : '#64748B', fontSize: 9, fontWeight: 900, cursor: 'pointer' }}>{isActive ? 'PREVIEWING' : 'SHOW'}</button>
                              <input value={c.label} onChange={(e) => handleUpdateTable('cases', i, 'label', e.target.value)} style={{ backgroundColor: 'transparent', border: 'none', color: '#F8FAFC', fontWeight: 900, fontSize: 14, outline: 'none', width: 200 }} />
                            </div>
                            <button onClick={() => setModulesData(prev => ({ ...prev, [9]: { ...prev[9], cases: prev[9].cases.filter((_, idx) => idx !== i) } }))} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 15 }}>
                            <div style={{ backgroundColor: '#1E293B', padding: '12px', borderRadius: 16, border: '1px solid #334155' }}>
                              <label style={{ fontSize: 9, fontWeight: 900, color: '#3B82F6', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>QRS Vector (L1 | AVF | AX)</label>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                                <input type="number" step="0.1" value={c.qrsL1} onChange={(e) => handleUpdateTable('cases', i, 'qrsL1', Number(e.target.value))} style={{ width: '100%', minWidth: 0, backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff', fontSize: 11, borderRadius: 8, padding: '8px', fontWeight: 700 }} />
                                <input type="number" step="0.1" value={c.qrsAVF} onChange={(e) => handleUpdateTable('cases', i, 'qrsAVF', Number(e.target.value))} style={{ width: '100%', minWidth: 0, backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff', fontSize: 11, borderRadius: 8, padding: '8px', fontWeight: 700 }} />
                                <input type="number" step="0.01" value={c.qrsAx} onChange={(e) => handleUpdateTable('cases', i, 'qrsAx', Number(e.target.value))} style={{ width: '100%', minWidth: 0, backgroundColor: '#0F172A', border: '1px solid #1B6FDE', color: '#3B82F6', fontSize: 11, borderRadius: 8, padding: '8px', fontWeight: 900 }} />
                              </div>
                            </div>
                            <div style={{ backgroundColor: '#1E293B', padding: '12px', borderRadius: 16, border: '1px solid #334155' }}>
                              <label style={{ fontSize: 9, fontWeight: 900, color: '#EF4444', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>T Vector (L1 | AVF | AX)</label>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                                <input type="number" step="0.1" value={c.tL1 || 0} onChange={(e) => handleUpdateTable('cases', i, 'tL1', Number(e.target.value))} style={{ width: '100%', minWidth: 0, backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff', fontSize: 11, borderRadius: 8, padding: '8px', fontWeight: 700 }} />
                                <input type="number" step="0.1" value={c.tAVF || 0} onChange={(e) => handleUpdateTable('cases', i, 'tAVF', Number(e.target.value))} style={{ width: '100%', minWidth: 0, backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff', fontSize: 11, borderRadius: 8, padding: '8px', fontWeight: 700 }} />
                                <input type="number" step="0.01" value={c.tAx || 0} onChange={(e) => handleUpdateTable('cases', i, 'tAx', Number(e.target.value))} style={{ width: '100%', minWidth: 0, backgroundColor: '#0F172A', border: '1px solid #EF444460', color: '#EF4444', fontSize: 11, borderRadius: 8, padding: '8px', fontWeight: 900 }} />
                              </div>
                            </div>
                            <div style={{ backgroundColor: '#1E293B', padding: '12px', borderRadius: 16, border: '1px solid #334155' }}>
                              <label style={{ fontSize: 9, fontWeight: 900, color: '#F59E0B', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>ST Vector (L1 | AVF | AX)</label>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                                <input type="number" step="0.1" value={c.stL1 || 0} onChange={(e) => handleUpdateTable('cases', i, 'stL1', Number(e.target.value))} style={{ width: '100%', minWidth: 0, backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff', fontSize: 11, borderRadius: 8, padding: '8px', fontWeight: 700 }} />
                                <input type="number" step="0.1" value={c.stAVF || 0} onChange={(e) => handleUpdateTable('cases', i, 'stAVF', Number(e.target.value))} style={{ width: '100%', minWidth: 0, backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff', fontSize: 11, borderRadius: 8, padding: '8px', fontWeight: 700 }} />
                                <input type="number" step="0.01" value={c.stAx || 0} onChange={(e) => handleUpdateTable('cases', i, 'stAx', Number(e.target.value))} style={{ width: '100%', minWidth: 0, backgroundColor: '#0F172A', border: '1px solid #F59E0B60', color: '#F59E0B', fontSize: 11, borderRadius: 8, padding: '8px', fontWeight: 900 }} />
                              </div>
                            </div>
                          </div>

                          <div style={{ backgroundColor: '#1E293B', padding: '12px', borderRadius: 16, border: '1px solid #334155' }}>
                            <label style={{ fontSize: 9, fontWeight: 900, color: '#64748B', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Clinical Note / Interpretation</label>
                            <textarea value={c.note} onChange={(e) => handleUpdateTable('cases', i, 'note', e.target.value)} style={{ width: '100%', height: 60, backgroundColor: '#0F172A', border: '1px solid #334155', color: '#94A3B8', fontSize: 12, borderRadius: 10, padding: '10px', resize: 'none', lineHeight: 1.5 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DYNAMIC PHYSICS & DISPLAY SETTINGS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                  <div style={{ backgroundColor: '#1E293B', borderRadius: 24, border: '1px solid #334155', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <Zap size={18} color="#FACC15" />
                      <h3 style={{ fontSize: 14, fontWeight: 900, color: '#F8FAFC' }}>Physics Engine Logic</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <label style={{ fontSize: 9, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>Circle Position Formula (X/Y)</label>
                          <button onClick={() => handleUpdateNested('physics', 'pos', null, "cx + (l1 / 2) * scale")} style={{ border: 'none', background: 'none', color: '#1B6FDE', fontSize: 8, fontWeight: 900, cursor: 'pointer' }}>Reset Default</button>
                        </div>
                        <input value={activeModule.physics?.pos || "cx + (l1 / 2) * scale"} onChange={(e) => handleUpdateNested('physics', 'pos', null, e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #334155', backgroundColor: '#0F172A', color: '#fff', fontSize: 12, fontFamily: 'monospace' }} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <label style={{ fontSize: 9, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>Radius Formula (R)</label>
                          <button onClick={() => handleUpdateNested('physics', 'rad', null, "Math.sqrt(l1*l1 + (1.154*avf)**2) / 2 * scale")} style={{ border: 'none', background: 'none', color: '#1B6FDE', fontSize: 8, fontWeight: 900, cursor: 'pointer' }}>Reset Default</button>
                        </div>
                        <input value={activeModule.physics?.rad || "Math.sqrt(l1*l1 + (1.154*avf)**2) / 2 * scale"} onChange={(e) => handleUpdateNested('physics', 'rad', null, e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #334155', backgroundColor: '#0F172A', color: '#fff', fontSize: 12, fontFamily: 'monospace' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#1E293B', borderRadius: 24, border: '1px solid #334155', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <Settings size={18} color="#94A3B8" />
                      <h3 style={{ fontSize: 14, fontWeight: 900, color: '#F8FAFC' }}>Global Scale & Thresholds</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                      <div>
                        <label style={{ fontSize: 9, fontWeight: 900, color: '#64748B', display: 'block', marginBottom: 6 }}>Circle Scale</label>
                        <input type="number" step="0.5" value={activeModule.displaySettings?.scale} onChange={(e) => handleUpdateNested('displaySettings', 'scale', null, Number(e.target.value))} style={{ width: '100%', backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 800 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 9, fontWeight: 900, color: '#64748B', display: 'block', marginBottom: 6 }}>Normal Range (°)</label>
                        <input type="number" value={activeModule.displaySettings?.normalAngleThreshold} onChange={(e) => handleUpdateNested('displaySettings', 'normalAngleThreshold', null, Number(e.target.value))} style={{ width: '100%', backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 800 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 9, fontWeight: 900, color: '#64748B', display: 'block', marginBottom: 6 }}>Center X</label>
                        <input type="number" value={activeModule.displaySettings?.cx} onChange={(e) => handleUpdateNested('displaySettings', 'cx', null, Number(e.target.value))} style={{ width: '100%', backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 800 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 9, fontWeight: 900, color: '#64748B', display: 'block', marginBottom: 6 }}>Center Y</label>
                        <input type="number" value={activeModule.displaySettings?.cy} onChange={(e) => handleUpdateNested('displaySettings', 'cy', null, Number(e.target.value))} style={{ width: '100%', backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 800 }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* LEAD AXIS CONFIG */}
                <div style={{ backgroundColor: '#1E293B', borderRadius: 24, border: '1px solid #334155', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <Compass size={18} color="#10B981" />
                    <h3 style={{ fontSize: 14, fontWeight: 900, color: '#F8FAFC' }}>Hexaxial Lead Orientation</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 12 }}>
                    {(activeModule.leadAxes || []).map((l, i) => (
                      <div key={l.name} style={{ backgroundColor: '#0F172A', padding: '12px', borderRadius: 16, border: '1px solid #334155', textAlign: 'center' }}>
                        <label style={{ fontSize: 10, fontWeight: 900, color: '#1B6FDE', display: 'block', marginBottom: 6 }}>{l.name}</label>
                        <input type="number" step="1" min="-180" max="180" value={l.deg} onChange={(e) => handleUpdateTable('leadAxes', i, 'deg', Number(e.target.value))} style={{ width: '100%', backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: 14, fontWeight: 800, textAlign: 'center' }} />
                        <div style={{ fontSize: 8, fontWeight: 900, color: '#64748B', marginTop: 4 }}>DEGREES</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legacy Formula Mappings */}
                <div style={{ padding: '8px 12px', backgroundColor: T.card, borderRadius: 12, border: `1px dashed ${T.border}`, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {formulas.map((f, idx) => (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 9, fontWeight: 900, color: '#64748B' }}>{f.variable}:</span>
                      <input type="number" value={f.testValue} onChange={(e) => handleUpdateFormula(idx, 'testValue', Number(e.target.value))} style={{ width: 40, padding: '3px', borderRadius: 4, border: `1px solid ${T.border}`, fontSize: 9, fontWeight: 700, backgroundColor: T.bg, color: T.text }} />
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTM === 2 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* SPEEDS TABLE EDITOR */}
                <div style={{ backgroundColor: T.card, borderRadius: 20, border: `1px solid ${T.border}`, padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: T.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.primary }}><Activity size={16} /></div>
                    <h3 style={{ fontSize: 13, fontWeight: 800 }}>Speeds Editor (mm/s)</h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                          {['Label', 'Val', 'sT', 'lT', 'sSec', 'lSec'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '10px 8px', color: T.textSub, fontWeight: 900, textTransform: 'uppercase', fontSize: 9 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeModule.speeds.map((row, i) => (
                          <tr key={`speed-${row.label}-${i}`} style={{ borderBottom: i === 2 ? 'none' : `1px solid ${T.border}50` }}>
                            <td style={{ padding: '8px 4px' }}><input value={row.label} onChange={(e) => handleUpdateTable('speeds', i, 'label', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 600 }} /></td>
                            <td style={{ padding: '8px 4px' }}><input type="number" value={row.val} onChange={(e) => handleUpdateTable('speeds', i, 'val', Number(e.target.value))} style={{ width: 60, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 700 }} /></td>
                            <td style={{ padding: '8px 4px' }}><input type="number" value={row.sT} onChange={(e) => handleUpdateTable('speeds', i, 'sT', Number(e.target.value))} style={{ width: 50, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 600 }} /></td>
                            <td style={{ padding: '8px 4px' }}><input type="number" value={row.lT} onChange={(e) => handleUpdateTable('speeds', i, 'lT', Number(e.target.value))} style={{ width: 50, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 600 }} /></td>
                            <td style={{ padding: '8px 4px' }}><input type="number" step="0.01" value={row.sSec} onChange={(e) => handleUpdateTable('speeds', i, 'sSec', Number(e.target.value))} style={{ width: 55, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 600 }} /></td>
                            <td style={{ padding: '8px 4px' }}><input type="number" step="0.01" value={row.lSec} onChange={(e) => handleUpdateTable('speeds', i, 'lSec', Number(e.target.value))} style={{ width: 55, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 600 }} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SENS TABLE EDITOR */}
                <div style={{ backgroundColor: T.card, borderRadius: 20, border: `1px solid ${T.border}`, padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}><Zap size={16} /></div>
                    <h3 style={{ fontSize: 13, fontWeight: 800 }}>Sensitivity Editor (mm/mV)</h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                          {['Label', 'mm', 'sV (Small Sq)', 'lV (Large Sq)'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '10px 8px', color: T.textSub, fontWeight: 900, textTransform: 'uppercase', fontSize: 9 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeModule.sens.map((row, i) => (
                          <tr key={`sens-${row.label}-${i}`} style={{ borderBottom: i === 2 ? 'none' : `1px solid ${T.border}50` }}>
                            <td style={{ padding: '8px 4px' }}><input value={row.label} onChange={(e) => handleUpdateTable('sens', i, 'label', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 600 }} /></td>
                            <td style={{ padding: '8px 4px' }}><input type="number" value={row.mm} onChange={(e) => handleUpdateTable('sens', i, 'mm', Number(e.target.value))} style={{ width: 60, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 700 }} /></td>
                            <td style={{ padding: '8px 4px' }}><input type="number" step="0.01" value={row.sV} onChange={(e) => handleUpdateTable('sens', i, 'sV', Number(e.target.value))} style={{ width: 80, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 600 }} /></td>
                            <td style={{ padding: '8px 4px' }}><input type="number" step="0.01" value={row.lV} onChange={(e) => handleUpdateTable('sens', i, 'lV', Number(e.target.value))} style={{ width: 80, padding: '8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 600 }} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Legacy Formula Mappings */}
                <div style={{ padding: '8px 12px', backgroundColor: T.card, borderRadius: 12, border: `1px dashed ${T.border}`, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {formulas.map((f, idx) => (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 9, fontWeight: 900, color: '#64748B' }}>{f.variable}:</span>
                      <input type="number" value={f.testValue} onChange={(e) => handleUpdateFormula(idx, 'testValue', Number(e.target.value))} style={{ width: 40, padding: '3px', borderRadius: 4, border: `1px solid ${T.border}`, fontSize: 9, fontWeight: 700, backgroundColor: T.bg, color: T.text }} />
                    </div>
                  ))}
                  <span style={{ fontSize: 8, color: '#94A3B8', fontStyle: 'italic', marginLeft: 'auto' }}>* Preview buttons update these mapped variables</span>
                </div>
              </div>
            ) : activeTM === 3 ? (
              renderChestLeadEditor()
            ) : activeTM === 5 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Lead Profiles Editor */}
                <div style={{ backgroundColor: T.card, borderRadius: 20, border: `1px solid ${T.border}`, padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B6FDE' }}><Activity size={16} /></div>
                    <h3 style={{ fontSize: 13, fontWeight: 800 }}>Lead Waveform Profiles</h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                          <th style={{ textAlign: 'left', padding: '8px', color: '#64748B', fontSize: 9, fontWeight: 900 }}>LEAD</th>
                          {['pAmp', 'tAmp', 'rAmp', 'sAmp'].map(f => <th key={f} style={{ textAlign: 'left', padding: '8px', color: '#64748B', fontSize: 9, fontWeight: 900 }}>{f.toUpperCase()}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(activeModule.leadProfiles).map(([lead, profile]) => (
                          <tr key={lead} style={{ borderBottom: `1px solid ${T.border}40` }}>
                            <td style={{ padding: '8px', fontSize: 11, fontWeight: 800, color: '#1B6FDE' }}>{lead}</td>
                            {Object.entries(profile).map(([field, val]) => (
                              <td key={field} style={{ padding: '4px 8px' }}>
                                <input type="number" step="0.01" value={val} onChange={(e) => handleUpdateNested('leadProfiles', lead, field, Number(e.target.value))} style={{ width: 60, padding: '6px 8px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 700 }} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Reversal Rules Editor */}
                <div style={{ backgroundColor: T.card, borderRadius: 20, border: `1px solid ${T.border}`, padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}><FlipHorizontal size={16} /></div>
                    <h3 style={{ fontSize: 13, fontWeight: 800 }}>Reversal Patterns & Rules</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Object.entries(activeModule.reversalInfo).map(([id, info]) => (
                      <div key={id} style={{ padding: '12px', backgroundColor: T.bg, borderRadius: 16, border: `1px solid ${T.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: T.textSub, textTransform: 'uppercase' }}>Pattern: {id.replace('_', ' ↔ ')}</span>
                          <button onClick={() => handleUpdateFormula(0, 'testValue', Object.keys(activeModule.reversalInfo).indexOf(id))} style={{ fontSize: 7, fontWeight: 900, backgroundColor: '#1B6FDE', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 6, cursor: 'pointer' }}>PREVIEW IN PHONE</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                          {/* Inverted */}
                          <div>
                            <div style={{ fontSize: 8, fontWeight: 900, color: '#64748B', marginBottom: 6 }}>INVERTED LEADS</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {["I", "II", "III", "aVR", "aVL", "aVF"].map(l => (
                                <button key={l} onClick={() => toggleReversalRule(id, l, 'inverted')} style={{ padding: '4px 6px', borderRadius: 6, fontSize: 8, fontWeight: 800, cursor: 'pointer', border: '1px solid currentColor', backgroundColor: info.inverted?.includes(l) ? '#EF4444' : 'transparent', color: info.inverted?.includes(l) ? '#fff' : '#64748B' }}>{l}</button>
                              ))}
                            </div>
                          </div>
                          {/* Flat */}
                          <div>
                            <div style={{ fontSize: 8, fontWeight: 900, color: '#64748B', marginBottom: 6 }}>FLAT LEADS</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {["I", "II", "III", "aVR", "aVL", "aVF"].map(l => (
                                <button key={l} onClick={() => toggleReversalRule(id, l, 'flat')} style={{ padding: '4px 6px', borderRadius: 6, fontSize: 8, fontWeight: 800, cursor: 'pointer', border: '1px solid currentColor', backgroundColor: info.flat?.includes(l) ? '#94A3B8' : 'transparent', color: info.flat?.includes(l) ? '#fff' : '#64748B' }}>{l}</button>
                              ))}
                            </div>
                          </div>
                          {/* Swaps */}
                          <div>
                            <div style={{ fontSize: 8, fontWeight: 900, color: '#64748B', marginBottom: 6 }}>SWAP MAPPINGS</div>
                            {["I", "II", "III", "aVR", "aVL", "aVF"].map(l => (
                              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                                <span style={{ fontSize: 8, color: '#94A3B8', width: 22 }}>{l} ↔</span>
                                <select value={info.swaps[l] || ''} onChange={(e) => handleUpdateSwap(id, l, e.target.value)} style={{ flex: 1, fontSize: 8, padding: '2px', backgroundColor: T.card, color: T.text, border: `1px solid ${T.border}`, borderRadius: 4 }}>
                                  <option value="">None</option>
                                  {["I", "II", "III", "aVR", "aVL", "aVF"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTM === 6 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* HR Constants Editor */}
                <div style={{ backgroundColor: T.card, borderRadius: 20, border: `1px solid ${T.border}`, padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E11D48' }}><Activity size={16} /></div>
                    <h3 style={{ fontSize: 13, fontWeight: 800 }}>HR Formula Constants</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { key: 'small_const', label: 'Small Sq', formula: '÷ R-R', standard: 1500, sign: '÷' },
                      { key: 'large_const', label: 'Large Sq', formula: '÷ R-R', standard: 300, sign: '÷' },
                      { key: 'strip_mult', label: 'Strip x', formula: 'peaks ×', standard: 6, sign: '×' },
                    ].map((item) => {
                      const isChanged = activeModule.constants[item.key] !== item.standard;
                      const val = activeModule.constants[item.key];
                      const exampleVal = item.key === 'small_const' ? 20 : (item.key === 'large_const' ? 4 : 12);
                      const result = item.sign === '÷' ? Math.round(val / exampleVal) : val * exampleVal;
                      return (
                        <div key={item.key} style={{ padding: '12px', backgroundColor: T.bg, borderRadius: 16, border: `1px solid ${T.border}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: T.textSub }}>{item.label}</div>
                            {isChanged && <div style={{ fontSize: 7, fontWeight: 900, color: '#F59E0B', backgroundColor: '#FFFBEB', padding: '2px 6px', borderRadius: 4, border: '1px solid #FEF3C7' }}>⚠ NON-STD</div>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <input type="number" value={val} onChange={(e) => handleUpdateConstants(item.key, Number(e.target.value))} style={{ width: 80, padding: '8px 10px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.card, color: T.text, fontSize: 12, fontWeight: 800 }} />
                            <div style={{ flex: 1, padding: '6px 10px', backgroundColor: '#0F172A', borderRadius: 8, fontFamily: 'monospace', fontSize: 10, color: '#2DD4BF' }}>
                              {val} {item.sign} {exampleVal} = <span style={{ color: '#fff', fontWeight: 900 }}>{result} bpm</span>
                            </div>
                            <button onClick={() => handleResetConstants(item.key)} style={{ padding: '6px', borderRadius: 6, border: `1px solid ${T.border}`, backgroundColor: T.card, color: T.textSub, cursor: 'pointer' }}><ChevronRight size={12} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Axis Constant Editor */}
                <div style={{ backgroundColor: T.card, borderRadius: 20, border: `1px solid ${T.border}`, padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}><Zap size={16} /></div>
                    <h3 style={{ fontSize: 13, fontWeight: 800 }}>Axis Constants</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    {[
                      { key: 'axis_correction', label: 'Correction', standard: 1.154, step: 0.001 },
                      { key: 'axis_min', label: 'Min Angle', standard: -30, step: 1 },
                      { key: 'axis_max', label: 'Max Angle', standard: 90, step: 1 },
                    ].map((item) => (
                      <div key={item.key}>
                        <label style={{ fontSize: 8, fontWeight: 900, color: '#64748B', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>{item.label}</label>
                        <input type="number" step={item.step} value={activeModule.constants[item.key]} onChange={(e) => handleUpdateConstants(item.key, Number(e.target.value))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 11, fontWeight: 800 }} />
                        {activeModule.constants[item.key] !== item.standard && <div style={{ fontSize: 7, color: '#F59E0B', fontWeight: 800, marginTop: 2 }}>{item.standard}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legacy Formula Mappings */}
                <div style={{ padding: '8px 12px', backgroundColor: T.card, borderRadius: 12, border: `1px dashed ${T.border}`, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {formulas.map((f, idx) => (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 9, fontWeight: 900, color: '#64748B' }}>{f.variable}:</span>
                      <input type="number" value={f.testValue} onChange={(e) => handleUpdateFormula(idx, 'testValue', Number(e.target.value))} style={{ width: 40, padding: '3px', borderRadius: 4, border: `1px solid ${T.border}`, fontSize: 9, fontWeight: 700, backgroundColor: T.bg, color: T.text }} />
                      {f.subVar && (
                        <>
                          <span style={{ fontSize: 9, fontWeight: 900, color: '#64748B', marginLeft: 4 }}>{f.subVar}:</span>
                          <input type="number" value={f.subVal} onChange={(e) => handleUpdateFormula(idx, 'subVal', Number(e.target.value))} style={{ width: 40, padding: '3px', borderRadius: 4, border: `1px solid ${T.border}`, fontSize: 9, fontWeight: 700, backgroundColor: T.bg, color: T.text }} />
                        </>
                      )}
                    </div>
                  ))}
                  <span style={{ fontSize: 8, color: '#94A3B8', fontStyle: 'italic', marginLeft: 'auto' }}>* Preview buttons update these mapped variables</span>
                </div>
              </div>
            ) : activeTM === 7 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Lead Configuration Table */}
                <div style={{ backgroundColor: T.card, borderRadius: 20, border: `1px solid ${T.border}`, padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: 12, fontWeight: 900, color: T.text, marginBottom: 12, textTransform: 'uppercase' }}>Lead Configuration Table</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, fontWeight: 700 }}>
                      <thead>
                        <tr style={{ backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.05)' : '#F8FAFC' }}>
                          <th style={{ padding: '8px', textAlign: 'left', border: `1px solid ${T.border}`, color: T.textSub }}>Lead</th>
                          <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${T.border}`, color: T.textSub }}>Angle</th>
                          <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${T.border}`, color: T.textSub }}>Complex</th>
                          <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${T.border}`, color: T.textSub }}>Color</th>
                          <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${T.border}`, color: T.textSub }}>Anatomy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(activeModule.leads || []).map((lead, idx) => (
                          <tr key={lead.id}>
                            <td style={{ padding: '8px', border: `1px solid ${T.border}`, fontWeight: 900, color: T.text }}>{lead.label}</td>
                            <td style={{ padding: '4px', border: `1px solid ${T.border}`, textAlign: 'center' }}>
                              <input
                                type="number"
                                value={lead.angle}
                                onChange={(e) => handleUpdateTable('leads', idx, 'angle', Number(e.target.value))}
                                style={{ width: '60px', padding: '4px', border: `1px solid ${T.border}`, borderRadius: 4, backgroundColor: T.bg, color: T.text, fontSize: 9, fontWeight: 700, textAlign: 'center' }}
                              />
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${T.border}`, textAlign: 'center' }}>
                              <select
                                value={lead.complex}
                                onChange={(e) => handleUpdateTable('leads', idx, 'complex', e.target.value)}
                                style={{ padding: '4px', border: `1px solid ${T.border}`, borderRadius: 4, backgroundColor: T.bg, color: T.text, fontSize: 8, fontWeight: 700 }}
                              >
                                <option value="rS">rS</option>
                                <option value="RS">RS</option>
                                <option value="qR">qR</option>
                              </select>
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${T.border}`, textAlign: 'center' }}>
                              <input
                                type="color"
                                value={lead.color}
                                onChange={(e) => handleUpdateTable('leads', idx, 'color', e.target.value)}
                                style={{ width: '40px', height: '24px', border: `1px solid ${T.border}`, borderRadius: 4, cursor: 'pointer' }}
                              />
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${T.border}`, textAlign: 'center' }}>
                              <select
                                value={lead.anatomy}
                                onChange={(e) => handleUpdateTable('leads', idx, 'anatomy', e.target.value)}
                                style={{ padding: '4px', border: `1px solid ${T.border}`, borderRadius: 4, backgroundColor: T.bg, color: T.text, fontSize: 8, fontWeight: 700 }}
                              >
                                <option value="Septal">Septal</option>
                                <option value="Anterior">Anterior</option>
                                <option value="Lateral">Lateral</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Expandable rows for position and description */}
                  <div style={{ marginTop: 12 }}>
                    {(activeModule.leads || []).map((lead, idx) => (
                      <div key={lead.id} style={{ marginBottom: 8, padding: '8px', backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.02)' : '#F8FAFC', borderRadius: 8, border: `1px solid ${T.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: T.text }}>{lead.label}</span>
                          <span style={{ fontSize: 8, color: T.textSub }}>Position & Description</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <div>
                            <label style={{ fontSize: 8, fontWeight: 700, color: T.textSub, display: 'block', marginBottom: 4 }}>Position</label>
                            <input
                              type="text"
                              value={lead.position || ''}
                              onChange={(e) => handleUpdateTable('leads', idx, 'position', e.target.value)}
                              style={{ width: '100%', padding: '6px', border: `1px solid ${T.border}`, borderRadius: 4, backgroundColor: T.bg, color: T.text, fontSize: 9 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 8, fontWeight: 700, color: T.textSub, display: 'block', marginBottom: 4 }}>Description</label>
                            <input
                              type="text"
                              value={lead.desc || ''}
                              onChange={(e) => handleUpdateTable('leads', idx, 'desc', e.target.value)}
                              style={{ width: '100%', padding: '6px', border: `1px solid ${T.border}`, borderRadius: 4, backgroundColor: T.bg, color: T.text, fontSize: 9 }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Waveform Amplitude Editor */}
                <div style={{ backgroundColor: T.card, borderRadius: 20, border: `1px solid ${T.border}`, padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: 12, fontWeight: 900, color: T.text, marginBottom: 12, textTransform: 'uppercase' }}>Waveform Amplitude Editor</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, fontWeight: 700 }}>
                      <thead>
                        <tr style={{ backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.05)' : '#F8FAFC' }}>
                          <th style={{ padding: '8px', textAlign: 'left', border: `1px solid ${T.border}`, color: T.textSub }}>Type</th>
                          <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${T.border}`, color: T.textSub }}>P</th>
                          <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${T.border}`, color: T.textSub }}>Q</th>
                          <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${T.border}`, color: T.textSub }}>R</th>
                          <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${T.border}`, color: T.textSub }}>S</th>
                          <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${T.border}`, color: T.textSub }}>T</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(activeModule.waveAmps || {}).map(([type, amps]) => (
                          <tr key={type}>
                            <td style={{ padding: '8px', border: `1px solid ${T.border}`, fontWeight: 900, color: T.text }}>{type}</td>
                            {['p', 'q', 'r', 's', 't'].map(wave => (
                              <td key={wave} style={{ padding: '4px', border: `1px solid ${T.border}`, textAlign: 'center' }}>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={amps[wave] || 0}
                                  onChange={(e) => handleUpdateNested('waveAmps', type, wave, Number(e.target.value))}
                                  style={{ width: '50px', padding: '4px', border: `1px solid ${T.border}`, borderRadius: 4, backgroundColor: T.bg, color: T.text, fontSize: 9, fontWeight: 700, textAlign: 'center' }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Reset buttons */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {Object.keys(activeModule.waveAmps || {}).map(type => (
                      <button
                        key={type}
                        onClick={() => handleResetWaveAmp(type)}
                        style={{ padding: '6px 12px', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: 6, fontSize: 8, fontWeight: 700, cursor: 'pointer' }}
                      >
                        Reset {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vector Projection Preview */}
                <div style={{ backgroundColor: T.card, borderRadius: 20, border: `1px solid ${T.border}`, padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: 12, fontWeight: 900, color: T.text, marginBottom: 12, textTransform: 'uppercase' }}>Vector Projection Preview</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, fontWeight: 700 }}>
                      <thead>
                        <tr style={{ backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.05)' : '#F8FAFC' }}>
                          <th style={{ padding: '8px', textAlign: 'left', border: `1px solid ${T.border}`, color: T.textSub }}>Lead</th>
                          <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${T.border}`, color: T.textSub }}>Angle</th>
                          <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${T.border}`, color: T.textSub }}>cos(angle)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(activeModule.leads || []).map(lead => {
                          const cosVal = Math.cos((lead.angle || 0) * Math.PI / 180).toFixed(3);
                          return (
                            <tr key={lead.id}>
                              <td style={{ padding: '8px', border: `1px solid ${T.border}`, fontWeight: 900, color: T.text }}>{lead.label}</td>
                              <td style={{ padding: '8px', border: `1px solid ${T.border}`, textAlign: 'center', color: T.text }}>{lead.angle}°</td>
                              <td style={{ padding: '8px', border: `1px solid ${T.border}`, textAlign: 'center', color: '#3B82F6', fontWeight: 900 }}>{cosVal}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : formulas.map((f, idx) => (
              <div key={f.id} style={{ backgroundColor: T.card, borderRadius: 24, border: `1px solid ${T.border}`, padding: '24px', marginBottom: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B6FDE' }}><Zap size={16} /></div>
                  <h3 style={{ fontSize: 14, fontWeight: 800 }}>{f.title}</h3>
                </div>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 9, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Logic Formula</label><input value={f.formula} onChange={(e) => handleUpdateFormula(idx, 'formula', e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, backgroundColor: T.bg, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, fontWeight: 600, outline: 'none' }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div><label style={{ fontSize: 9, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Variable</label><input value={f.variable} onChange={(e) => handleUpdateFormula(idx, 'variable', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, backgroundColor: T.bg, border: `1px solid ${T.border}`, color: T.text, fontSize: 12, fontWeight: 600 }} /></div>
                  <div><label style={{ fontSize: 9, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Test Value</label><input type="number" value={f.testValue} onChange={(e) => handleUpdateFormula(idx, 'testValue', Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, backgroundColor: T.bg, border: `1px solid ${T.border}`, color: T.text, fontSize: 12, fontWeight: 600 }} /></div>
                </div>
                {f.subVar && (<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}><div><label style={{ fontSize: 9, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Sub-Variable</label><input value={f.subVar} onChange={(e) => handleUpdateFormula(idx, 'subVar', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, backgroundColor: T.bg, border: `1px solid ${T.border}`, color: T.text, fontSize: 12, fontWeight: 600 }} /></div><div><label style={{ fontSize: 9, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Test Value</label><input type="number" value={f.subVal} onChange={(e) => handleUpdateFormula(idx, 'subVal', Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, backgroundColor: T.bg, border: `1px solid ${T.border}`, color: T.text, fontSize: 12, fontWeight: 600 }} /></div></div>)}
                <div style={{ padding: '10px 14px', backgroundColor: '#EDF2F7', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#1B6FDE' }}><Zap size={12} /> Output Result = {safeEval(f.formula, varsPool)}</div>
              </div>
            ))}
          </div>
        </main>

        {/* Preview */}
        <aside style={{ borderLeft: `1px solid ${T.border}`, backgroundColor: T.name === 'dark' ? '#0F172A' : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', overflow: 'hidden' }}>
          <div style={{ width: '100%', maxWidth: 240, height: '95%', maxHeight: 620, backgroundColor: previewTheme === 'dark' ? '#0A0F1A' : '#ffffff', borderRadius: 36, border: '6px solid #1E293B', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)' }}>
            <div style={{ height: 24, display: 'flex', justifyContent: 'space-between', padding: '0 20px', alignItems: 'center', fontSize: 10, fontWeight: 900, color: previewTheme === 'dark' ? '#94A3B8' : '#64748B' }}><span>9:41</span><div style={{ display: 'flex', gap: 6 }}><Activity size={10} /><Zap size={10} /><Battery size={10} /></div></div>
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="no-scrollbar">
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#1B6FDE', fontSize: 10, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' }}>
                  <ArrowLeft size={14} strokeWidth={3} /> Back
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: previewTheme === 'dark' ? '#fff' : '#0F172A', marginBottom: 2 }}>{activeModule.title}</h2>
                  <p style={{ fontSize: 10, color: '#64748B', fontWeight: 600, lineHeight: 1.4 }}>{activeModule.desc}</p>
                </div>

                {/* Rendering the dynamic preview */}
                <div style={{ marginBottom: 20 }}>
                  {renderPreviewPanel()}
                </div>

                {/* Content Block */}
                <div style={{ padding: '16px', backgroundColor: previewTheme === 'dark' ? '#1E293B' : '#F1F5F9', borderRadius: 20, border: `1px solid ${previewTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <div style={{ width: 3, height: 10, backgroundColor: '#1B6FDE', borderRadius: 2 }} />
                    <div style={{ fontSize: 8, fontWeight: 900, color: '#1B6FDE', textTransform: 'uppercase' }}>Documentation</div>
                  </div>
                  <div style={{ fontSize: 10, color: previewTheme === 'dark' ? '#CBD5E1' : '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontWeight: 500 }}>
                    {activeModule.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default memo(TrainingModules);
