import { Compass, Activity, Stethoscope, Zap, Layers, LayoutGrid } from 'lucide-react';

export const INITIAL_MODULES = {
  1: {
    id: 1,
    title: 'Vector Simulator',
    desc: 'Cardiac vector projection on lead axes',
    icon: Compass,
    category: "vectors",
    leadAngles: { 'I': 0, 'II': 60, 'III': 120, 'aVR': -150, 'aVL': -30, 'aVF': 90 },
    formulas: [
      { id: 101, title: 'Main Vector Magnitude', formula: 'magnitude', variable: 'magnitude', testValue: 1.5 },
      { id: 102, title: 'Main Vector Angle', formula: 'angle', variable: 'angle', testValue: 60 }
    ],
    content: "The magnitude and angle of the cardiac vector determine the ECG lead morphology."
  },
  2: {
    id: 2,
    title: 'ECG Standardization',
    desc: 'Paper speed and gain calibration',
    icon: Activity,
    category: "leads",
    speeds: [
      { label: 'Standard', mmS: 25, sSec: 0.04, lSec: 0.20 },
      { label: 'Double', mmS: 50, sSec: 0.02, lSec: 0.10 },
      { label: 'Half', mmS: 12.5, sSec: 0.08, lSec: 0.40 }
    ],
    sens: [
      { label: 'Standard', mm: 10, sV: 0.1, lV: 0.5 },
      { label: 'Double', mm: 20, sV: 0.05, lV: 0.25 },
      { label: 'Half', mm: 5, sV: 0.2, lV: 1.0 }
    ],
    formulas: [
      { id: 201, title: 'Horizontal Calibration (Time)', formula: '1 / mmS', variable: 'mmS', testValue: 25 },
      { id: 202, title: 'Vertical Calibration (Ampli)', formula: '1 / mm', variable: 'mm', testValue: 10 }
    ],
    content: "Standard ECG requires 25mm/sec speed and 10mm/mV sensitivity."
  },
  3: {
    id: 3,
    title: 'Chest Lead Placement',
    desc: 'Anatomical landmass identification',
    icon: Stethoscope,
    category: "leads",
    formulas: [
      { id: 301, title: 'V1-V6 Projections', formula: 'view_type', variable: 'view_type', testValue: 0 },
      { id: 302, title: 'Selected Electrode', formula: 'selected_lead', variable: 'selected_lead', testValue: 0 }
    ],
    content: "Accurate placement of V1-V6 is critical for transition zone assessment."
  },
  4: {
    id: 4,
    title: 'Hexaxial Reference System',
    desc: 'Frontal plane vector orientation',
    icon: Compass,
    category: "leads",
    formulas: [
      { id: 401, title: 'QRS Axis Calculation', formula: 'qrs_angle', variable: 'qrs_angle', testValue: 60, subVar: 'qrs_mag', subVal: 6 },
      { id: 402, title: 'T-Wave Axis Calculation', formula: 't_angle', variable: 't_angle', testValue: 30, subVar: 't_mag', subVal: 2.5 }
    ],
    content: "The hexaxial system maps frontal leads I, II, III, aVR, aVL, and aVF."
  },
  5: {
    id: 5,
    title: 'Lead Reversal Sim',
    desc: 'Electrode swap pattern detection',
    icon: Zap,
    category: "leads",
    leadProfiles: {
      I: { pAmp: 0.15, tAmp: 0.30, rAmp: 0.80, sAmp: -0.05 },
      II: { pAmp: 0.20, tAmp: 0.40, rAmp: 1.00, sAmp: -0.10 },
      III: { pAmp: 0.10, tAmp: 0.15, rAmp: 0.30, sAmp: -0.10 },
      aVR: { pAmp: -0.15, tAmp: -0.30, rAmp: -0.70, sAmp: 0.05 },
      aVL: { pAmp: 0.05, tAmp: 0.10, rAmp: 0.20, sAmp: -0.05 },
      aVF: { pAmp: 0.18, tAmp: 0.35, rAmp: 0.80, sAmp: -0.08 },
    },
    reversalInfo: {
      RA_LA: { inverted: ["I", "aVR"], swaps: { "II": "III", "aVR": "aVL" } },
      RA_LL: { inverted: ["I", "II", "aVF", "aVR"], swaps: { "aVR": "aVF" } },
      LA_LL: { inverted: ["III"], swaps: { "I": "II", "aVL": "aVF" } },
      LA_RL: { flat: ["III"], swaps: { "I": "II", "aVL": "aVF" } },
      RA_RL: { flat: ["II"], inverted: ["I"], swaps: { "aVR": "aVF" } },
      LL_RL: { inverted: [], swaps: {} }
    },
    formulas: [
      { id: 501, title: 'Reversal State (0=RA-LA, 1=RA-LL, etc)', formula: 'state', variable: 'state', testValue: 0 }
    ],
    content: "Recognizing lead reversal patterns avoids costly misdiagnoses like Dextrocardia."
  },
  6: {
    id: 6,
    title: 'Heart Rate & Axis',
    desc: 'Automatic calculation formulas',
    icon: LayoutGrid,
    formulas: [
      { id: 601, title: 'Small Squares Method', formula: '1500 / rr_small', variable: 'rr_small', testValue: 20 },
      { id: 602, title: 'Large Squares Method', formula: '300 / rr_large', variable: 'rr_large', testValue: 4 },
      { id: 603, title: 'Rhythm Strip Method', formula: 'peaks * 6', variable: 'peaks', testValue: 12 },
      { id: 604, title: 'Axis Determination', formula: 'Math.atan2(1.154 * avf, lead1) * 180 / Math.PI', variable: 'lead1', testValue: 4, subVar: 'avf', subVal: 9 }
    ],
    constants: {
      small_const: 1500,
      large_const: 300,
      strip_mult: 6,
      axis_correction: 1.154,
      axis_min: -30,
      axis_max: 90
    },
    content: "Standard methods for HR and Axis determination using clinical constants."
  },
  7: {
    id: 7,
    title: 'Precordial Training',
    desc: 'R-Wave Progression (V1–V6)',
    icon: LayoutGrid,
    category: "leads",
    leads: [
      { id: "V1", label: "V1", angle: 120, color: "#EF4444", anatomy: "Septal", complex: "rS", position: "4th intercostal space, right sternal border", desc: "Small r wave, deep S wave. Mostly negative. Right septal depolarization." },
      { id: "V2", label: "V2", angle: 90, color: "#F97316", anatomy: "Septal", complex: "rS", position: "4th intercostal space, left sternal border", desc: "Larger r, deep S. Transition begins. Septal-anterior forces." },
      { id: "V3", label: "V3", angle: 75, color: "#EAB308", anatomy: "Anterior", complex: "RS", position: "Between V2 and V4", desc: "Transition zone: R ≈ S. Anterior LV forces begin to dominate." },
      { id: "V4", label: "V4", angle: 60, color: "#22C55E", anatomy: "Anterior", complex: "qR", position: "5th intercostal space, midclavicular line", desc: "Positive: tall R, small Q. Apical LV forces." },
      { id: "V5", label: "V5", angle: 30, color: "#3B82F6", anatomy: "Lateral", complex: "qR", position: "Anterior axillary line", desc: "Tall R, shallow S. Lateral LV free wall." },
      { id: "V6", label: "V6", angle: 0, color: "#8B5CF6", anatomy: "Lateral", complex: "qR", position: "Midaxillary line", desc: "Tall R, small or absent S. Pure lateral view." }
    ],
    waveAmps: {
      rS: { p: 4, q: -2, r: 10, s: -22, t: -4 },
      RS: { p: 5, q: -3, r: 20, s: -18, t: 5 },
      qR: { p: 5, q: -4, r: 28, s: -5, t: 8 }
    },
    formulas: [
      { id: 701, title: 'Active Lead Index', formula: 'idx', variable: 'activeIdx', testValue: 0 }
    ],
    content: "Precordial leads V1 through V6 show a progressive increase in R-wave amplitude (R-wave progression)."
  },
  9: {
    id: 9,
    title: 'Vector Circle Builder',
    desc: 'Cardiodynamic Spatial Mapping',
    icon: Zap,
    category: "vectors",
    displaySettings: {
      scale: 9,
      cx: 150,
      cy: 120,
      normalAngleThreshold: 60,
      showTriangleDefault: true,
      showDiameterDefault: false
    },
    leadAxes: [
      { name: "I", deg: 0 }, { name: "aVL", deg: -30 }, { name: "II", deg: 60 },
      { name: "aVF", deg: 90 }, { name: "III", deg: 120 }, { name: "aVR", deg: -150 }
    ],
    cases: [
      { label: "Normal", qrsL1: 4.0, qrsAVF: 9.0, tL1: 2.0, tAVF: 2.5, qrsAx: 68.93, tAx: 55.26, note: "Normal QRS/T angle (13.7°). Both axes in normal range." },
      { label: "Inf Isch", qrsL1: 11.0, qrsAVF: -3.5, tL1: 4.83, tAVF: -0.75, qrsAx: -20.16, tAx: -10.15, note: "Inferior Wall Ischemia. T-vector moves away from inferior wall." },
      { label: "Inf MI", qrsL1: 4.66, qrsAVF: 2.0, stL1: -0.8, stAVF: 2.2, qrsAx: 26.34, stAx: 107.50, note: "Inferior Wall MI. ST vector towards inferior wall." },
      { label: "IVCD", qrsL1: 8.0, qrsAVF: 1.0, tL1: -2.5, tAVF: 1.125, qrsAx: 8.2, tAx: 152.56, note: "Intraventricular conduction defect. Wide QRS/T angle." },
      { label: "Abn T", qrsL1: 9.0, qrsAVF: -8.5, tL1: -0.66, tAVF: 3.0, qrsAx: -47.46, tAx: 100.8, note: "Abnormal QRS/T angle." },
      { label: "Retro P", qrsL1: 0, qrsAVF: -2.5, tL1: 0.833, tAVF: 1.25, qrsAx: 270, tAx: 60, note: "Retrograde P wave (270°) vs Normal P wave (60°)." },
      { label: "LAFB", qrsL1: -1.0, qrsAVF: 3.5, tL1: 2.0, tAVF: -2.0, qrsAx: 103.91, tAx: -49.0, note: "LAFB pattern. Left Anterior Fascicular Block." },
      { label: "ST aVR", qrsL1: -1.25, qrsAVF: -0.375, stL1: -0.8, stAVF: 2.2, qrsAx: -160.91, stAx: 107.50, note: "ST elevation in aVR vs Inferior Wall ST elevation." },
      { label: "T Inv", qrsL1: -2.0, qrsAVF: 0.5, tL1: 4.83, tAVF: -0.75, qrsAx: 164, tAx: -10.15, note: "T-wave inversion comparison." }
    ],
    formulas: [
      { id: 901, title: 'Selected Case Index', formula: 'caseIdx', variable: 'caseIdx', testValue: 0 }
    ],
    content: "Vector circle loops visualize the spatial distribution of depolarization and repolarization forces."
  }
};
