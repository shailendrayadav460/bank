import React, { useEffect, useRef, memo } from 'react';
import { FlipHorizontal } from 'lucide-react';

/* 
  LeadReversalRenderer
  - Replicates student app ECG-APP logic for phone simulator preview
  - Accepts: vars { leadProfiles, reversalInfo, state }
*/

const LeadReversalRenderer = ({ vars, previewTheme }) => {
  const isDark = previewTheme === 'dark';
  const theme = {
    bg: isDark ? '#0A0F1A' : '#EEF2F7',
    card: isDark ? '#161F30' : '#ffffff',
    text: isDark ? '#ffffff' : '#0F172A',
    subText: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0',
  };

  const REVERSALS = [
    { id: "RA_LA", label: "RA↔LA" },
    { id: "RA_LL", label: "RA↔LL" },
    { id: "LA_LL", label: "LA↔LL" },
    { id: "LA_RL", label: "LA↔RL" },
    { id: "RA_RL", label: "RA↔RL" },
    { id: "LL_RL", label: "LL↔RL" },
  ];

  const selectedIdx = vars.state || 0;
  const selectedReversal = REVERSALS[selectedIdx]?.id || "RA_LA";
  const selLabel = REVERSALS[selectedIdx]?.label || "";

  const leadProfiles = vars.leadProfiles || {};
  const reversalInfo = vars.reversalInfo || {};
  const info = reversalInfo[selectedReversal] || {};

  // Canvas Drawing Utils
  const drawECGGrid = (ctx, W, H) => {
    ctx.fillStyle = "#0a1a0f";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(0,255,136,0.08)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 5) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 5) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.strokeStyle = "rgba(0,255,136,0.18)";
    ctx.lineWidth = 0.8;
    for (let x = 0; x < W; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  };

  const getECGPoints = (profile, W, baseY, scaleY, cycles) => {
    const pts = [];
    const cycleWidth = W / cycles;
    for (let c = 0; c < cycles; c++) {
      const ox = c * cycleWidth;
      const p = profile;
      pts.push([ox, baseY]);
      pts.push([ox + cycleWidth * 0.06, baseY]);
      pts.push([ox + cycleWidth * 0.08, baseY - p.pAmp * scaleY]);
      pts.push([ox + cycleWidth * 0.12, baseY - p.pAmp * scaleY]);
      pts.push([ox + cycleWidth * 0.16, baseY]);
      pts.push([ox + cycleWidth * 0.22, baseY]);
      pts.push([ox + cycleWidth * 0.24, baseY + Math.abs(p.sAmp * 0.3) * scaleY]);
      pts.push([ox + cycleWidth * 0.28, baseY - p.rAmp * scaleY]);
      pts.push([ox + cycleWidth * 0.33, baseY + Math.abs(p.sAmp) * 0.3 * scaleY]);
      pts.push([ox + cycleWidth * 0.37, baseY]);
      pts.push([ox + cycleWidth * 0.43, baseY]);
      pts.push([ox + cycleWidth * 0.48, baseY - p.tAmp * scaleY]);
      pts.push([ox + cycleWidth * 0.54, baseY - p.tAmp * scaleY]);
      pts.push([ox + cycleWidth * 0.60, baseY]);
      pts.push([ox + cycleWidth * 0.95, baseY]);
    }
    return pts;
  };

  const drawECGLine = (ctx, pts, color, lineWidth = 1.2, glow = false) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 4; }
    pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const drawLeadCompare = (canvas, reversed, info) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    drawECGGrid(ctx, W, H);

    const leads = ["I", "II", "III", "aVR", "aVL", "aVF"];
    const rowH = H / leads.length;

    leads.forEach((lead, i) => {
      const baseY = rowH * (i + 0.5);
      const isInverted = reversed && info.inverted?.includes(lead);
      const isFlat = reversed && info.flat?.includes(lead);
      const targetLead = (reversed && info.swaps?.[lead]) || lead;
      let profile = { ...leadProfiles[targetLead] };

      if (isFlat) {
        drawECGLine(ctx, [[0, baseY], [W, baseY]], "#EF4444", 1.2);
      } else {
        if (isInverted) {
          profile = { pAmp: -profile.pAmp, tAmp: -profile.tAmp, rAmp: -profile.rAmp, sAmp: -profile.sAmp };
        }
        const pts = getECGPoints(profile, W, baseY, rowH * 0.35, 2);
        drawECGLine(ctx, pts, (isInverted || isFlat) ? "#EF4444" : "#00ff88", 1.2, isInverted);
      }
      ctx.fillStyle = (isInverted || isFlat) ? "rgba(239,68,68,0.7)" : "rgba(0,255,136,0.5)";
      ctx.font = "bold 7px monospace";
      ctx.fillText(lead, 2, baseY - rowH * 0.28);
    });
  };

  const CanvasFrame = ({ label, reversed }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
      drawLeadCompare(canvasRef.current, reversed, info);
    }, [vars, reversed]);

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ padding: '6px', backgroundColor: reversed ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', borderRadius: '8px 8px 0 0', textAlign: 'center', fontSize: 8, fontWeight: 900, color: reversed ? '#EF4444' : '#10B981', border: `1px solid ${reversed ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ backgroundColor: '#0a1a0f', borderRadius: '0 0 8px 8px', overflow: 'hidden', border: '1px solid rgba(0,255,136,0.1)' }}>
          <canvas ref={canvasRef} width={150} height={216} style={{ width: '100%', display: 'block' }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', backgroundColor: theme.bg }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: theme.card, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B6FDE', border: `1px solid ${theme.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <FlipHorizontal size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 800, color: theme.text, margin: 0 }}>Lead Reversal</h2>
          <p style={{ fontSize: 8, fontWeight: 600, color: theme.subText, margin: 0 }}>Pattern simulation preview</p>
        </div>
      </div>

      {/* Comparisons */}
      <div style={{ backgroundColor: theme.card, borderRadius: 20, padding: 12, border: `1px solid ${theme.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ fontSize: 7, fontWeight: 900, color: theme.subText, uppercase: true, marginBottom: 8, letterSpacing: '0.05em' }}>ECG COMPARISON</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <CanvasFrame label="Normal" reversed={false} />
          <CanvasFrame label={selLabel} reversed={true} />
        </div>
        
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 2, backgroundColor: '#00ff88', borderRadius: 1 }} /><span style={{ fontSize: 7, fontWeight: 700, color: theme.subText }}>Normal</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 2, backgroundColor: '#EF4444', borderRadius: 1 }} /><span style={{ fontSize: 7, fontWeight: 700, color: theme.subText }}>Affected</span></div>
        </div>
      </div>

      {/* Info Card */}
      <div style={{ backgroundColor: theme.card, borderRadius: 20, padding: 12, border: `1px solid ${theme.border}` }}>
        <div style={{ fontSize: 7, fontWeight: 900, color: theme.subText, uppercase: true, marginBottom: 8 }}>REVERSAL SELECTED: {selLabel}</div>
        <div style={{ padding: 8, backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2', borderRadius: 10, border: `1px solid ${isDark ? 'rgba(239,68,68,0.2)' : '#FEE2E2'}`, fontSize: 8, fontWeight: 700, color: '#EF4444', fontStyle: 'italic' }}>
          * Lead properties and rules are controlled via Admin Editor.
        </div>
      </div>
    </div>
  );
};

export default memo(LeadReversalRenderer);
