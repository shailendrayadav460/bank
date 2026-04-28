import React, { memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

/* ─── Shared Sub-Components (mirroring ECG-APP) ─────────────── */

const Card = memo(({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm mb-4">
    {title && (
      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 border-b border-blue-50 dark:border-blue-900/20 pb-2">
        {title}
      </div>
    )}
    {children}
  </div>
));

const Body = memo(({ children, className = '' }) => (
  <p className={`text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium ${className}`}>
    {children}
  </p>
));

const Strong = memo(({ children }) => (
  <span className="font-bold text-blue-600 dark:text-blue-400">{children}</span>
));

const FormulaBox = memo(({ children }) => (
  <div className="bg-[#0A111A] rounded-2xl p-4 font-mono text-[11px] text-[#00D4FF] border border-blue-900/20 whitespace-pre-wrap leading-relaxed shadow-inner">
    {children}
  </div>
));

const InfoBox = memo(({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300',
    red: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-300',
    amber: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-300',
    green: 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-300',
  };
  return (
    <div className={`rounded-xl p-3 border text-xs font-bold leading-relaxed ${colors[color]}`}>
      {children}
    </div>
  );
});

const DataTable = memo(({ headers, rows }) => (
  <div className="overflow-x-auto -mx-1 no-scrollbar">
    <table className="w-full text-xs">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="text-left py-2.5 px-2 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100 dark:border-gray-700">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
            {row.map((cell, ci) => (
              <td key={ci} className="py-2.5 px-2 text-gray-700 dark:text-gray-300 font-bold">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

const DiagramBox = memo(({ children }) => (
  <div className="bg-[#0A111A] rounded-2xl p-4 border border-blue-900/10 mb-2 shadow-2xl shadow-blue-500/5 overflow-hidden">
    {children}
  </div>
));

const Label = memo(({ children, className = '' }) => (
  <p className={`text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
    {children}
  </p>
));

/* ══════════════════════════════════════════════════════════════
   MODULE 1 – ELECTROPHYSIOLOGY OF HEART
══════════════════════════════════════════════════════════════ */
const Module1Content = memo(() => (
  <>
    <Card title="KEY CONCEPTS – ECG DEFLECTIONS">
      <Body>
        The magnitude and direction of an <Strong>ECG deflection</Strong> is expressed in
        relation to a baseline referred to as the <Strong>isoelectric line</Strong>.
      </Body>
      <Body className="mt-2">
        <Strong>TP segment</Strong>, <Strong>P-R segment</Strong> &amp;{' '}
        <Strong>ST segment</Strong> are the portions of the isoelectric interval lines.
      </Body>
      <Body className="mt-2">
        <Strong>Atrial activation</Strong> is reflected by the <Strong>P wave</Strong>.{' '}
        <Strong>QRS complex</Strong> represents ventricular depolarization and the{' '}
        <Strong>T wave</Strong> represents ventricular repolarization.
      </Body>
      <Body className="mt-2">
        The junction between the <Strong>QRS complex</Strong> and <Strong>ST segment</Strong>{' '}
        is the <Strong>J point</Strong>.
      </Body>
      <Body className="mt-2">
        The <Strong>normal ST segment</Strong> leaves the baseline in the isoelectric period
        and merges smoothly and imperceptibly with the proximal limb of the T wave.
      </Body>

      <div className="mt-4">
        <DiagramBox>
          <svg width="100%" viewBox="0 0 320 130">
            <defs>
              <filter id="waveGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#00D4FF" />
              </linearGradient>
            </defs>
            <line x1="0" y1="80" x2="320" y2="80" stroke="rgba(0,212,255,0.15)" strokeWidth="1" strokeDasharray="4 2" />
            <path
              d="M 10 80 L 38 80 Q 52 56 66 80 L 82 80 L 86 93 L 100 16 L 114 108 L 120 80 L 148 80 Q 190 40 225 80 L 310 80"
              fill="none" stroke="url(#waveGrad)" strokeWidth="2.5"
              filter="url(#waveGlow)" strokeLinecap="round" strokeLinejoin="round"
            />
            <text x="52" y="50" fontSize="9" fontWeight="bold" fill="#3B82F6">P</text>
            <text x="94" y="11" fontSize="9" fontWeight="bold" fill="#00D4FF">QRS</text>
            <text x="190" y="36" fontSize="9" fontWeight="bold" fill="#94A3B8">T</text>
            <text x="12" y="95" fontSize="7" fill="rgba(148,163,184,0.6)">TP seg</text>
            <text x="68" y="95" fontSize="7" fill="rgba(148,163,184,0.6)">PR seg</text>
            <text x="122" y="95" fontSize="7" fill="rgba(148,163,184,0.6)">ST seg</text>
            <circle cx="120" cy="80" r="3" fill="#F59E0B" />
            <text x="124" y="75" fontSize="7" fill="#F59E0B">J pt</text>
            <text x="235" y="77" fontSize="7" fill="rgba(0,212,255,0.4)">— isoelectric</text>
          </svg>
        </DiagramBox>
      </div>
    </Card>

    <Card title="WAVEFORM MORPHOLOGY">
      <DataTable
        headers={['Component', 'Represents', 'Reference / Notes']}
        rows={[
          ['P Wave', 'Atrial Activation (Depolarization)', 'TP segment = isoelectric'],
          ['PR Seg.', 'AV Nodal Delay', 'PR segment = isoelectric'],
          ['QRS', 'Ventricular Depolarization', 'Ends at J point'],
          ['J Point', 'Junction: QRS–ST segment', 'Reference for ST shift'],
          ['ST Seg.', 'Isoelectric period (ventricular plateau)', 'ST seg = isoelectric'],
          ['T Wave', 'Ventricular Repolarization', 'Merges from ST segment'],
        ]}
      />
    </Card>
  </>
));

/* ══════════════════════════════════════════════════════════════
   MODULE 2 – ECG LEADS
══════════════════════════════════════════════════════════════ */
const Module2Content = memo(() => (
  <>
    <Card title="STANDARD ECG – 3 SETS OF LEADS">
      <Body>
        The standard ECG consists of <Strong>3 different sets of leads</Strong>:
      </Body>
      <div className="mt-3 space-y-2">
        <InfoBox color="blue">
          Bipolar Leads: Lead I, II &amp; III — measure voltage difference between limb electrodes.
        </InfoBox>
        <InfoBox color="amber">
          Unipolar Augmented: aVR, aVL &amp; aVF — recorded through Goldberger's Central Terminal (GCT).
        </InfoBox>
        <InfoBox color="green">
          Unipolar Precordial: V1–V6 — recorded through Wilson's Central Terminal (WCT).
        </InfoBox>
        <InfoBox color="red">
          Right Leg electrode = Ground/Reference electrode for all leads.
        </InfoBox>
      </div>
      <Body className="mt-3">
        <Strong>Augmentation factor 3/2 (50% higher)</Strong> for leads recorded through GCT
        compared with leads recorded through WCT.
      </Body>
      <Body className="mt-2">
        <Strong>Correction factor 1.154</Strong> is used to correct for the difference in
        strength (resistance) between bipolar and unipolar limb leads.
      </Body>
    </Card>

    <Card title="EINTHOVEN'S TRIANGLE & LEAD FORMULAS">
      <Body>
        Limb leads measure voltage differences between <Strong>RA (Right Arm)</Strong>,{' '}
        <Strong>LA (Left Arm)</Strong> and <Strong>LL (Left Leg)</Strong>.
      </Body>
      <div className="mt-4">
        <DiagramBox>
          <svg width="100%" viewBox="0 0 280 180">
            <defs>
              <marker id="arr" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                <polygon points="0 0, 7 3.5, 0 7" fill="#3B82F6" />
              </marker>
            </defs>
            <polygon points="140,20 30,155 250,155" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" strokeDasharray="5 3" />
            <line x1="48" y1="155" x2="232" y2="155" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arr)" />
            <line x1="140" y1="20" x2="42" y2="148" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arr)" />
            <line x1="140" y1="20" x2="240" y2="148" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arr)" />
            <circle cx="140" cy="20" r="5" fill="#EF4444" />
            <circle cx="30" cy="155" r="5" fill="#3B82F6" />
            <circle cx="250" cy="155" r="5" fill="#10B981" />
            <text x="140" y="14" fontSize="9" fontWeight="bold" fill="#EF4444">RA</text>
            <text x="14" y="162" fontSize="9" fontWeight="bold" fill="#3B82F6">LA</text>
            <text x="250" y="168" fontSize="9" fontWeight="bold" fill="#10B981">LL</text>
            <text x="140" y="170" fontSize="8" fontWeight="bold" fill="#00D4FF" textAnchor="middle">Lead I</text>
            <text x="64" y="95" fontSize="8" fontWeight="bold" fill="#00D4FF" transform="rotate(-58 64,95)">Lead II</text>
            <text x="208" y="95" fontSize="8" fontWeight="bold" fill="#00D4FF" transform="rotate(58 208,95)">Lead III</text>
          </svg>
        </DiagramBox>
      </div>

      <Label className="mt-3 mb-2">Lead Formulas</Label>
      <FormulaBox>{`Lead I   = LA − RA\nLead II  = LL − RA\nLead III = LL − LA\n\naVR = −(Lead I + Lead II) / 2\naVL =  Lead I − (Lead II) / 2\naVF =  Lead II − (Lead I) / 2\n\naVR + aVL + aVF = 0\nLead I + Lead III = Lead II  (Einthoven Equation)\nWCT (Vw) = 1/3 (RA + LA + LL)`}</FormulaBox>
    </Card>

    <Card title="PRECORDIAL CHEST LEAD PLACEMENT (V1–V6)">
      <DataTable
        headers={['Lead', 'Position', 'Anatomical View']}
        rows={[
          ['V1', '4th ICS, Right sternal margin', 'Septal view'],
          ['V2', '4th ICS, Left sternal margin', 'Septal view'],
          ['V3', 'Midway between V2 and V4', 'Anterior view'],
          ['V4', '5th ICS, Midclavicular line', 'Anterior view'],
          ['V5', '5th ICS, Anterior axillary line', 'Lateral view'],
          ['V6', '5th ICS, Midaxillary line', 'Lateral view'],
        ]}
      />
      <Body className="mt-3">
        <Strong>Posterior leads</Strong> (V7, V8, V9) are placed in the same horizontal
        plane as V6 — V7 at left posterior axillary line, V8 at tip of left scapula,
        V9 at left paraspinal region.
      </Body>
    </Card>

    <Card title="LEAD ORIENTATION TOWARDS HEART WALL">
      <DataTable
        headers={['Heart Wall', 'Leads']}
        rows={[
          ['Septal', 'V1, V2'],
          ['Anterior', 'V3, V4'],
          ['Lateral', 'I, aVL, V5, V6'],
          ['Inferior', 'II, III, aVF'],
        ]}
      />
    </Card>
  </>
));

/* ══════════════════════════════════════════════════════════════
   MODULE 3 – CARDIAC VECTOR THEORY – FORMULATION
══════════════════════════════════════════════════════════════ */
const Module3Content = memo(() => (
  <>
    <Card title="CARDIAC VECTOR THEORY – CORE FORMULA">
      <Body>
        <Strong>Cardiac Vector Theory</Strong> states that voltage recorded in a particular
        lead is the result of the <Strong>dot product</Strong> between the Cardiac Vector
        and the Lead Vector.
      </Body>
      <div className="mt-4">
        <FormulaBox>{`(OH→) · (OL^) = (OH) COSα\n          OR\n(h→) · (l^) = (OH) COSα\n\nOH  = magnitude of the Heart (Cardiac) Vector\nOL  = magnitude of the Lead Vector (taken as 1)\nα   = angle between cardiac vector & lead vector\nVoltage (scalar) = OH × COSα`}</FormulaBox>
      </div>
      <Body className="mt-3">
        The voltage recorded in a particular lead depends on:
      </Body>
      <div className="mt-2 space-y-2">
        <InfoBox color="blue">Both the magnitude AND direction of the cardiac vector.</InfoBox>
        <InfoBox color="amber">Only the direction of the lead vector (magnitude = 1).</InfoBox>
      </div>
    </Card>

    <Card title="HEX-AXIAL REFERENCE SYSTEM">
      <Body>
        The <Strong>centre of the Hex-axial Reference System</Strong> is the zero point
        which denotes the origin. If a perpendicular line is drawn from the tip of the
        cardiac vector into their respective leads, the corresponding segment in that
        lead represents the <Strong>magnitude of the voltage</Strong> recorded in that lead.
      </Body>
      <div className="mt-4">
        <DiagramBox>
          <svg width="100%" viewBox="0 0 240 240">
            <defs>
              <filter id="hexGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <marker id="hexArr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#3B82F6" />
              </marker>
            </defs>
            <circle cx="120" cy="120" r="90" stroke="rgba(59,130,246,0.15)" fill="none" strokeWidth="1" />
            {[0, 30, 60, 90, 120, 150].map(a => (
              <line key={a}
                x1={120 - 90 * Math.cos(a * Math.PI / 180)}
                y1={120 - 90 * Math.sin(a * Math.PI / 180)}
                x2={120 + 90 * Math.cos(a * Math.PI / 180)}
                y2={120 + 90 * Math.sin(a * Math.PI / 180)}
                stroke="rgba(59,130,246,0.2)" strokeWidth="0.8" strokeDasharray="3 3"
              />
            ))}
            <text x="212" y="124" fontSize="8" fontWeight="bold" fill="#3B82F6">I (+)</text>
            <text x="14" y="124" fontSize="8" fontWeight="bold" fill="#64748B">±180°</text>
            <text x="120" y="22" fontSize="8" fontWeight="bold" fill="#64748B" textAnchor="middle">−90°</text>
            <text x="120" y="222" fontSize="8" fontWeight="bold" fill="#10B981" textAnchor="middle">aVF (+)</text>
            <text x="195" y="52" fontSize="8" fontWeight="bold" fill="#64748B">aVL (+)</text>
            <text x="15" y="180" fontSize="8" fontWeight="bold" fill="#64748B">aVR (+)</text>
            <text x="160" y="185" fontSize="8" fontWeight="bold" fill="#64748B">II (+)</text>
            <text x="50" y="185" fontSize="8" fontWeight="bold" fill="#64748B">III (+)</text>
            <line x1="120" y1="120" x2="175" y2="160"
              stroke="#00D4FF" strokeWidth="3" markerEnd="url(#hexArr)"
              filter="url(#hexGlow)" strokeLinecap="round" />
            <circle cx="120" cy="120" r="4" fill="#F59E0B" filter="url(#hexGlow)" />
            <text x="108" y="135" fontSize="7" fill="#F59E0B">O (origin)</text>
          </svg>
        </DiagramBox>
      </div>
    </Card>

    <Card title="VOLTAGE DIRECTION RULES">
      <Body>
        Voltage recorded in a particular lead will be:
      </Body>
      <div className="mt-3 space-y-2">
        <InfoBox color="green">Positive — if both vectors are in the SAME direction (α &lt; 90°)</InfoBox>
        <InfoBox color="red">Negative — if both vectors are in OPPOSITE direction (α &gt; 90°)</InfoBox>
        <InfoBox color="blue">Maximum — if cardiac vector is PARALLEL (α = 0°) to the lead</InfoBox>
        <InfoBox color="amber">Equiphasic / Zero — if cardiac vector is PERPENDICULAR (α = 90°) to lead</InfoBox>
      </div>
      <div className="mt-4">
        <Label className="mb-2">Cosine Angle Values</Label>
        <DataTable
          headers={['Angle (α)', 'cos α Value', 'ECG Effect']}
          rows={[
            ['0°', '1.000', 'Maximum positive deflection'],
            ['30°', '0.866 (√3/2)', 'Large positive deflection'],
            ['45°', '0.707 (1/√2)', 'Moderate positive deflection'],
            ['60°', '0.500 (1/2)', 'Smaller positive deflection'],
            ['90°', '0', 'Equiphasic (isoelectric)'],
            ['90°–180°', 'Negative', 'Negative deflection'],
          ]}
        />
      </div>
    </Card>

    <Card title="LEAD VECTOR CONCEPT">
      <Body>
        The <Strong>Lead Vector (OL→)</Strong> denotes the orientation of the electrode
        position only. It has magnitude (strength) but is compared relatively with other
        lead vectors.
      </Body>
      <Body className="mt-2">
        Cardiac Vector = <Strong>electrical field vector</Strong> measured in volt/metre.
      </Body>
      <Body className="mt-2">
        Lead Vector = <Strong>unit vector</Strong> measured in metre (magnitude taken as 1).
      </Body>
      <Body className="mt-2">
        Therefore, <Strong>Voltage (volt)</Strong> = dot product of cardiac vector ×
        lead unit vector = scalar quantity.
      </Body>
    </Card>
  </>
));

/* ══════════════════════════════════════════════════════════════
   MODULE 4 – CARDIAC VECTOR THEORY – FRONTAL LIMB LEADS
══════════════════════════════════════════════════════════════ */
const Module4Content = memo(() => (
  <>
    <Card title="ANGLE (AXIS) DETERMINATION IN ECG">
      <Body>
        The voltage recorded in a particular lead in ECG is due to the{' '}
        <Strong>projection of Heart (Cardiac) vector on Lead vector</Strong>.
      </Body>
      <Body className="mt-2">
        Angle determination can be done using the voltage recorded in{' '}
        <Strong>aVF and Lead I</Strong>. Correction factor 1.154 corrects for the
        difference in resistance between bipolar and unipolar limb leads.
      </Body>
      <div className="mt-4">
        <FormulaBox>{`Tan α = aVF / Lead I\nTan α = (1.154 × aVF) / Lead I\n\nX-coordinate = Lead I\nY-coordinate = 1.154 × aVF\n\nNormal QRS axis:  −30° to +90°\nNormal T axis:    0° to +90°\nNormal QRS–T angle: < 60° (frontal plane)`}</FormulaBox>
      </div>
    </Card>

    <Card title="HEART-LEAD VECTOR RELATIONSHIP – APPLICATION">
      <DataTable
        headers={['ECG Finding', 'Cause (Vector)', 'Clinical Meaning']}
        rows={[
          ['High Voltage in lead', 'Large cardiac vector magnitude OR small angle α', 'Hypertrophy / close proximity'],
          ['Low Voltage in lead', 'Small cardiac vector magnitude OR large angle α', 'Cardiomyopathy / effusion'],
          ['Prolonged wave duration', 'Decreased vector velocity OR longer distance', 'BBB / accessory pathway'],
          ['Shortened wave duration', 'Increased vector velocity OR shorter distance', 'WPW / pre-excitation'],
        ]}
      />
    </Card>

    <Card title="DISPLACEMENT VECTORS – QRS COMPLEX">
      <Body>
        Ventricular activation begins in the <Strong>left subendocardial region</Strong> of
        the lower third of the interventricular septum, spreading from left to right.
      </Body>
      <div className="mt-3 space-y-2">
        <InfoBox color="blue">
          Septal vector: Left → Right (small). Opposed by smaller right → left force.
          Dominant: Left-to-right resultant.
        </InfoBox>
        <InfoBox color="amber">
          Free wall vector: Larger LV force (Right→Left) dominates smaller RV force (Left→Right).
          Dominant: Right-to-left resultant.
        </InfoBox>
      </div>
      <div className="mt-4">
        <Label className="mb-2">QRS Pattern Per Lead</Label>
        <DataTable
          headers={['QRS Pattern', 'Lead', 'Explanation']}
          rows={[
            ['rS complex', 'V1, V2 (right-oriented)', 'Small septal r; large LV free wall S'],
            ['RS complex', 'V3 (transition zone)', 'Transition from rS → qR'],
            ['qR complex', 'I, V4, V5, V6 (left-oriented)', 'Small septal q; large LV free wall R'],
          ]}
        />
      </div>
    </Card>

    <Card title="DISPLACEMENT VECTOR – ST SEGMENT">
      <Body>
        <Strong>ST segment displacement</Strong> (elevation or depression relative to
        isoelectric line) is clinically the most important part of ECG. When myocardium
        is injured, current flows between pathologically depolarized and normally
        polarized areas — this is the <Strong>current of injury</Strong>.
      </Body>
      <div className="mt-3">
        <DataTable
          headers={['Condition', 'ST Vector Direction', 'ECG Leads Towards', 'ECG Result']}
          rows={[
            ['Myocardial Injury (transmural)', 'Towards injured surface (endo→epi)', 'Towards injury vector', 'ST Elevation'],
            ['Myocardial Injury (transmural)', 'Towards injured surface (endo→epi)', 'Away from injury vector', 'Reciprocal ST Depression'],
            ['Subendocardial Injury', 'Epi → Endo (opposite direction)', 'Towards', 'ST Depression'],
          ]}
        />
      </div>
    </Card>

    <Card title="DISPLACEMENT VECTOR – T WAVE">
      <DataTable
        headers={['Condition', 'T Vector', 'Lead Orientation', 'ECG Result']}
        rows={[
          ['Ischemia (primary)', 'Away from ischemic region', 'Towards ischemia', 'T wave inversion'],
          ['Ischemia (primary)', 'Away from ischemic region', 'Away from ischemia', 'Positive T wave'],
          ['Intraventricular conduction defect', 'Away from QRS vector', 'Towards QRS region', 'T wave inversion (secondary)'],
        ]}
      />
      <Body className="mt-3">
        In ischemia, more blood is needed to <Strong>repolarise</Strong> than to depolarize.
        So ischemia causes deviation of T-wave axis away from the affected region.
      </Body>
    </Card>

    <Card title="DISPLACEMENT VECTOR – QRS (INFARCTION)">
      <Body>
        In <Strong>myocardial infarction</Strong>, the tissue is necrosed (electrically
        inert — <Strong>electrical hole</Strong>). QRS vector moves{' '}
        <Strong>away from the infarcted/necrosed region</Strong>.
      </Body>
      <Body className="mt-2">
        Electrodes oriented towards the infarcted wall record activation of the
        opposite ventricular wall → <Strong>Pathological Q waves</Strong> (negative QRS deflection).
      </Body>
    </Card>

    <Card title="EINTHOVEN'S EQUILATERAL TRIANGLE">
      <Body>
        Heart is situated at the <Strong>centre of the electric field</Strong> which it
        generates. Right arm, left arm and left leg are extensions of its electrical field.
      </Body>
      <Body className="mt-2">
        Plot net voltages of bipolar (I, II, III) and unipolar (aVR, aVL, aVF) limb leads
        on the hex-axial system — each forms an <Strong>equilateral triangle</Strong>.
        The triangle converts to a <Strong>circle</Strong> whose diameter = cardiac
        (resultant) vector.
      </Body>
      <Body className="mt-2">
        <Strong>Correction factor 1.154</Strong> = √(4/3) — ratio of radii of the two
        circles (bipolar vs unipolar). Multiply unipolar limb lead voltages by 1.154
        to place both triangles on the same circle.
      </Body>
    </Card>
  </>
));

/* ══════════════════════════════════════════════════════════════
   MODULE 5 – CARDIAC VECTOR THEORY – TEACHING TOOL
══════════════════════════════════════════════════════════════ */
const Module5Content = memo(() => (
  <>
    <Card title="NOVEL VECTOR BASED ECG INTERPRETATION">
      <Body>
        Each cardiac wave (<Strong>P, QRS, T &amp; ST</Strong>) can be represented in the
        form of <Strong>circles</Strong> in the Hex-axial reference system. The diameter
        of each circle represents the resultant cardiac vector for that wave.
      </Body>
      <div className="mt-3 space-y-2">
        <InfoBox color="blue">
          All circles should form in the LEFT LOWER quadrant — except QRS which can go up to −30°.
        </InfoBox>
        <InfoBox color="amber">
          Higher voltage = Larger circle size.
        </InfoBox>
        <InfoBox color="green">
          ST segment is isoelectric — no circle seen normally. ST circle formation indicates myocardial injury amount.
        </InfoBox>
        <InfoBox color="red">
          Increased angle between QRS and T circles → strain, abnormal conduction, or ischemia.
        </InfoBox>
      </div>
    </Card>

    <Card title="NORMAL AXIS RANGES">
      <DataTable
        headers={['Wave', 'Normal Axis Range', 'Notes']}
        rows={[
          ['QRS', '−30° to +90°', 'Left lower quadrant (normal axis quadrant)'],
          ['T', '0° to +90°', 'Left lower quadrant'],
          ['QRS–T angle', '< 60°', 'Frontal plane; widening = strain/ischemia'],
          ['P', '0° to +75°', 'Normal sinus rhythm direction'],
        ]}
      />
    </Card>

    <Card title="CLINICAL CIRCLE INTERPRETATION EXAMPLES">
      <DataTable
        headers={['Figure', 'Condition', 'QRS Circle', 'T / ST Circle', 'Key Finding']}
        rows={[
          ['Fig 1', 'Normal ECG', '68.93°', '55.26°', 'Normal QRS/T angle'],
          ['Fig 2', 'Inferior Wall Ischemia', '−20.16°', '−10.15°', 'T vector away from inferior wall (T inv in III, aVF)'],
          ['Fig 3', 'Inferior Wall MI (ST elevation)', '26.34°', '107.50°', 'ST circle towards inferior leads (II, III, aVF)'],
          ['Fig 4', 'Intraventricular Conduction Defect', '8.2°', '152.56°', 'Wide QRS/T angle — T vector away from QRS (secondary)'],
          ['Fig 5', 'LBBB — Abnormal QRS/T', '−47.46°', '100.8°', 'Wide QRS/T — T vector moves away from QRS vector'],
          ['Fig 6', 'Retrograde P wave', '270°', '—', 'Abnormal P angle vs normal 60°'],
          ['Fig 7', 'Pathological Q vs LAFB', '103.91°', '−49.0°', 'QRS axis deviation differentiates infarct vs fascicular block'],
          ['Fig 8', 'ST in aVR vs inferior ST elevation', '−160.91°', '107.50°', 'Subendocardial vs inferior wall injury differentiated'],
          ['Fig 9', 'Lateral vs Inferior Ischemia', '164°', '−10.15°', 'T inversion: I,aVL=lateral; III,aVF=inferior ischemia'],
        ]}
      />
    </Card>

    <Card title="VECTOR PRINCIPLES – DIAGNOSIS SUMMARY">
      <DataTable
        headers={['Vector', 'Moves Towards', 'Moves Away From', 'Clinical Diagnosis']}
        rows={[
          ['QRS vector', 'Normal ventricular wall', 'Infarcted/necrosed wall', 'Pathological Q waves (infarction)'],
          ['ST vector', 'Injured surface (endo→epi)', 'Opposite wall', 'STEMI / reciprocal depression'],
          ['T vector', 'Normal tissue', 'Ischemic region', 'T wave inversion (ischemia)'],
          ['T vector', 'Away from QRS', '—', 'T inversion secondary to conduction defect'],
        ]}
      />
      <Body className="mt-3">
        <Strong>Vector principles</Strong> (cardiac vector theory + circle representation)
        can be applied to diagnose most common cardiac diseases without ambiguity.
      </Body>
    </Card>
  </>
));

/* ─── Module Meta ─────────────────────────────────────── */
const MODULE_META = [
  { id: 1, division: 'MODULE I', title: 'Electrophysiology of Heart', Content: Module1Content },
  { id: 2, division: 'MODULE II', title: 'ECG Leads', Content: Module2Content },
  { id: 3, division: 'MODULE III', title: 'Cardiac Vector Theory – Formulation', Content: Module3Content },
  { id: 4, division: 'MODULE IV', title: 'Cardiac Vector Theory – Frontal Limb Leads', Content: Module4Content },
  { id: 5, division: 'MODULE V', title: 'Cardiac Vector Theory – Teaching Tool', Content: Module5Content },
];

/* ─── Main Page ───────────────────────────────────────── */
export default function ModuleContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const moduleNum = parseInt(id) || 1;
  const meta = MODULE_META.find(m => m.id === moduleNum) || MODULE_META[0];
  const { Content } = meta;

  return (
    <div className="w-full min-h-screen bg-[#EEF2F7] dark:bg-gray-900 flex justify-center pb-24 font-['Outfit']">
      <style>{`
        @keyframes mdFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .md-fade { opacity: 0; animation: mdFadeUp 0.4s ease forwards; }
      `}</style>

      <div className="w-full max-w-[480px] pt-10 flex flex-col">
        {/* HEADER */}
        <div className="px-4 pb-4 md-fade">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => navigate('/learning/modules')}
              className="flex items-center gap-1.5 text-[#2563EB] dark:text-blue-400 font-bold text-sm transition-opacity hover:opacity-70"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              <span>Back</span>
            </button>
            <span className="bg-blue-100 dark:bg-blue-900/40 text-[#2563EB] dark:text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
              {meta.division}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white leading-tight mb-2">
            {meta.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 text-[#64748B] dark:text-gray-400 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              Core Learning Path
            </span>
          </div>
        </div>

        {/* MODULE CONTENT */}
        <div className="px-4 pb-4 space-y-0 md-fade" style={{ animationDelay: '0.08s' }}>
          <Content />

          {/* Navigation Buttons */}
          <div className="pt-6 pb-8 flex gap-3">
            {moduleNum > 1 && (
              <button
                onClick={() => navigate(`/learning/module/${moduleNum - 1}`)}
                className="flex-1 py-4 rounded-2xl font-bold text-sm border-2 border-[#E2E8F0] dark:border-gray-700 text-[#64748B] dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-[#2563EB] hover:text-[#2563EB] transition-all"
              >
                ← Prev Module
              </button>
            )}
            {moduleNum < 5 ? (
              <button
                onClick={() => navigate(`/learning/module/${moduleNum + 1}`)}
                className="flex-[2] py-4 rounded-2xl font-bold text-sm bg-[#2563EB] text-white shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all"
              >
                Next Module →
              </button>
            ) : (
              <button
                onClick={() => navigate('/learning/modules')}
                className="flex-[2] py-4 rounded-2xl font-bold text-sm bg-[#2563EB] text-white shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} strokeWidth={2.5} />
                All Modules Done!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
