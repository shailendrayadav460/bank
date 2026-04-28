import React, { useState, useMemo, memo } from 'react';
import { LayoutGrid } from 'lucide-react';

/*
  PrecordialTrainingRenderer
  ─────────────────────────────────────────────────
  Phone-mockup preview for Super Admin Module 7.
  Props:
    leads     — array of lead objects (V1–V6)
    waveAmps  — { rS:{p,q,r,s,t}, RS:{…}, qR:{…} }

  Rules:
  • Inline styles only  (no Tailwind)
  • ECG canvas is ALWAYS dark (#0A1A1A)  regardless of admin theme
  • Tab switching is handled locally (useState)
*/

// ── Gaussian Waveform ───────────────────────────────────────────────────────
const WaveformSVG = memo(({ lead, waveAmps }) => {
  const W = 160, H = 80, mid = 45;

  const config = (waveAmps && lead.complex && waveAmps[lead.complex])
    ? waveAmps[lead.complex]
    : { p: 4, q: -2, r: 10, s: -22, t: -4 };

  const pts = useMemo(() => {
    const res = [];
    for (let x = 0; x <= W; x++) {
      const t = x / W;
      const p  = (config.p  ?? 0) * Math.exp(-Math.pow((t - 0.18) / 0.025, 2));
      const q  = (config.q  ?? 0) * Math.exp(-Math.pow((t - 0.34) / 0.010, 2));
      const r  = (config.r  ?? 0) * Math.exp(-Math.pow((t - 0.39) / 0.008, 2));
      const s  = (config.s  ?? 0) * Math.exp(-Math.pow((t - 0.44) / 0.012, 2));
      const tw = (config.t  ?? 0) * Math.exp(-Math.pow((t - 0.65) / 0.055, 2));
      res.push(`${x},${mid - (p + q + r + s + tw)}`);
    }
    return res.join(' ');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.complex, config.p, config.q, config.r, config.s, config.t]);

  return (
    <div style={{
      backgroundColor: '#0A1A1A',
      borderRadius: 16,
      border: '1px solid rgba(0,255,136,0.12)',
      overflow: 'hidden',
      padding: 4,
    }}>
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <filter id="precGlow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Minor grid lines */}
        {Array.from({ length: 17 }, (_, i) => (
          <line key={`v${i}`} x1={i * 10} y1={0} x2={i * 10} y2={H}
            stroke={i % 5 === 0 ? 'rgba(0,255,136,0.15)' : 'rgba(0,255,136,0.05)'}
            strokeWidth={0.5} />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 10} x2={W} y2={i * 10}
            stroke={i % 5 === 0 ? 'rgba(0,255,136,0.15)' : 'rgba(0,255,136,0.05)'}
            strokeWidth={0.5} />
        ))}

        {/* Waveform */}
        <polyline
          fill="none"
          stroke="#00FF88"
          strokeWidth="1.5"
          strokeLinecap="round"
          points={pts}
          filter="url(#precGlow)"
        />

        {/* Label */}
        <text x="6" y={H - 6} fontSize="7" fontWeight="bold"
          fill="rgba(0,255,136,0.55)" fontFamily="monospace">
          {lead.label} · {lead.angle}° · {lead.complex}
        </text>
      </svg>
    </div>
  );
});

// ── Anatomy badge colours ───────────────────────────────────────────────────
const ANATOMY_BG   = { Septal: 'rgba(239,68,68,0.15)',   Anterior: 'rgba(245,158,11,0.15)', Lateral: 'rgba(59,130,246,0.15)' };
const ANATOMY_COL  = { Septal: '#EF4444',                Anterior: '#F59E0B',               Lateral: '#3B82F6'               };

// ── Main renderer ───────────────────────────────────────────────────────────
const PrecordialTrainingRenderer = ({ leads = [], waveAmps = {} }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  // Guard: if leads array shrinks and activeIdx is out of range, clamp it
  const safeIdx = Math.min(activeIdx, Math.max(0, leads.length - 1));
  const lead    = leads[safeIdx] || {};

  const projection = useMemo(() => {
    const rad = ((lead.angle ?? 0) * Math.PI) / 180;
    return Math.cos(rad).toFixed(3);
  }, [lead.angle]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          backgroundColor: 'rgba(59,130,246,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#3B82F6',
        }}>
          <LayoutGrid size={16} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
            Precordial Leads
          </div>
          <div style={{ fontSize: 8, fontWeight: 600, color: '#64748B' }}>
            R-Wave Progression V1–V6
          </div>
        </div>
      </div>

      {/* ── Tab bar ────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 3, padding: 3,
        backgroundColor: '#111827',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {leads.map((l, i) => (
          <button
            key={l.id}
            onClick={() => setActiveIdx(i)}
            style={{
              flex: 1, textAlign: 'center',
              padding: '4px 2px',
              borderRadius: 7,
              fontSize: 8, fontWeight: 900,
              border: 'none', cursor: 'pointer',
              transition: 'all 0.15s',
              backgroundColor: safeIdx === i ? l.color : 'transparent',
              color: safeIdx === i ? '#fff' : '#64748B',
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* ── Waveform card ──────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#0D1117',
        borderRadius: 16,
        padding: 10,
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          fontSize: 7, fontWeight: 900, color: '#475569',
          textTransform: 'uppercase', letterSpacing: '0.06em',
          marginBottom: 6,
        }}>
          Electrode Wave Genesis — {lead.label}
        </div>
        <WaveformSVG lead={lead} waveAmps={waveAmps} />
      </div>

      {/* ── Lead details card ──────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#0D1117',
        borderRadius: 16,
        padding: 10,
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {/* Lead name + badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: lead.color }}>
            {lead.label}
          </span>
          <span style={{
            fontSize: 7, fontWeight: 900,
            backgroundColor: ANATOMY_BG[lead.anatomy]  || 'rgba(100,116,139,0.15)',
            color:           ANATOMY_COL[lead.anatomy] || '#94A3B8',
            padding: '2px 6px', borderRadius: 4,
          }}>
            {lead.anatomy}
          </span>
          <span style={{
            marginLeft: 'auto', fontSize: 7, fontWeight: 700,
            color: '#64748B', fontFamily: 'monospace',
          }}>
            {lead.complex} · {lead.angle}°
          </span>
        </div>

        {/* Position */}
        <div style={{
          backgroundColor: 'rgba(59,130,246,0.08)',
          borderRadius: 8, padding: '6px 8px',
          border: '1px solid rgba(59,130,246,0.15)',
        }}>
          <div style={{ fontSize: 6, fontWeight: 900, color: '#3B82F6', marginBottom: 2, textTransform: 'uppercase' }}>
            Position
          </div>
          <div style={{ fontSize: 8, color: '#CBD5E1', fontWeight: 600, lineHeight: 1.4 }}>
            {lead.position}
          </div>
        </div>

        {/* Description */}
        {lead.desc && (
          <div style={{ fontSize: 8, color: '#94A3B8', lineHeight: 1.5, fontWeight: 500 }}>
            {lead.desc}
          </div>
        )}

        {/* Vector projection */}
        <div style={{
          backgroundColor: '#070C14',
          borderRadius: 10, padding: '7px 10px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: 6, fontWeight: 900, color: '#475569', textTransform: 'uppercase' }}>
              Vector Projection
            </span>
            <span style={{ fontSize: 6, color: '#10B981', fontWeight: 900,
              backgroundColor: 'rgba(16,185,129,0.1)', padding: '1px 5px', borderRadius: 4 }}>
              ACTIVE
            </span>
          </div>
          <div style={{ color: '#fff', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>
            cos({lead.angle}°) ={' '}
            <span style={{ color: '#3B82F6' }}>{projection}</span>
          </div>
          <div style={{ fontSize: 7, color: '#475569', marginTop: 2, fontStyle: 'italic' }}>
            Projection of frontal vector onto electrode axis
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecordialTrainingRenderer);
