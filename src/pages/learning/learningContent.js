export const learningData = [
  {
    id: 1,
    title: 'Chapter 1: Electrophysiology of Heart',
    description: 'Fundamental electrical signals, ECG waves, and grid paper properties.',
    units: [
      {
        id: 101,
        title: 'ECG Waves & Deflections',
        blocks: [
          { type: 'header', content: 'KEY CONCEPTS – ECG DEFLECTIONS', level: 'h2' },
          { type: 'text', content: 'The magnitude and direction of an ECG deflection is expressed in relation to a baseline referred to as the isoelectric line. TP segment, P-R segment & ST segment are the portions of the isoelectric interval lines.' },
          { type: 'image', url: 'https://images.unsplash.com/photo-1576091160550-217359946f3c?q=80&w=800' },
          { type: 'header', content: 'WAVEFORM MORPHOLOGY', level: 'h2' },
          { 
            type: 'table', 
            rows: [
              ['Component', 'Represents', 'Reference'],
              ['P Wave', 'Atrial Activation', 'TP segment = isoelectric'],
              ['PR Seg.', 'AV Nodal Delay', 'PR segment = isoelectric'],
              ['QRS', 'Ventricular Depolarization', 'Ends at J point'],
              ['ST Seg.', 'Isoelectric period', 'ST seg = isoelectric'],
              ['T Wave', 'Ventricular Repolarization', 'Merges from ST segment']
            ]
          }
        ]
      },
      {
        id: 102,
        title: 'ECG Components & Paper',
        blocks: [
          { type: 'header', content: 'ECG GRAPH PAPER SPECIFICATIONS', level: 'h2' },
          { type: 'text', content: 'Standard ECG recordings are made on grid paper where speed and amplitude are precisely calibrated.' },
          { 
            type: 'table', 
            rows: [
              ['Parameter', 'One Small Box (1mm)', 'One Large Box (5mm)'],
              ['Horizontal (Time)', '0.04 Seconds', '0.20 Seconds'],
              ['Vertical (Voltage)', '0.1 Mini-Volt (mV)', '0.5 Mini-Volt (mV)'],
              ['Full Scale (10mm)', 'N/A', '1.0 Mini-Volt (mV)']
            ]
          },
          { type: 'header', content: 'CALIBRATION STANDARDS', level: 'h2' },
          { type: 'text', content: 'Standard Paper Speed: 25 mm/sec. Standard Voltage: 10 mm / 1 mV. Ensure these markers are verified before interpreting any ECG strip.' },
          { type: 'image', url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=800' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Chapter 2: ECG Leads & Standardization',
    description: '12-lead system, Einthoven’s Triangle, and lead orientation.',
    units: [
      {
        id: 201,
        title: 'Standard Leads & Einthoven Triangle',
        blocks: [
          { type: 'header', content: 'STANDARD ECG – 3 SETS OF LEADS', level: 'h2' },
          { type: 'text', content: 'The standard ECG consists of 3 different sets of leads: Bipolar (I, II, III), Unipolar Augmented (aVR, aVL, aVF), and Unipolar Precordial (V1-V6).' },
          { type: 'header', content: 'LEAD FORMULAS', level: 'h2' },
          { 
            type: 'code', 
            content: "Lead I   = LA - RA\nLead II  = LL - RA\nLead III = LL - LA\n\naVR = -(Lead I + Lead II) / 2\naVL =  Lead I - (Lead II) / 2\naVF =  Lead II - (Lead I) / 2\n\naVR + aVL + aVF = 0\nLead I + Lead III = Lead II  (Einthoven Equation)\nWCT (Vw) = 1/3 (RA + LA + LL)" 
          },
          { type: 'header', content: 'PRECORDIAL CHEST LEAD PLACEMENT (V1–V6)', level: 'h2' },
          { 
            type: 'table', 
            rows: [
              ['LEAD', 'POSITION', 'ANATOMICAL VIEW'],
              ['V1', '4th ICS, Right sternal margin', 'Septal view'],
              ['V2', '4th ICS, Left sternal margin', 'Septal view'],
              ['V3', 'Midway between V2 and V4', 'Anterior view'],
              ['V4', '5th ICS, Midclavicular line', 'Anterior view'],
              ['V5', '5th ICS, Anterior axillary line', 'Lateral view'],
              ['V6', '5th ICS, Midaxillary line', 'Lateral view']
            ]
          },
          { type: 'text', content: 'Posterior leads (V7, V8, V9) are placed in the same horizontal plane as V6 — V7 at left posterior axillary line, V8 at tip of left scapula, V9 at left paraspinal region.' },
          { type: 'image', url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800' }
        ]
      },
      {
        id: 202,
        title: 'Lead Orientation & Heart Walls',
        blocks: [
          { type: 'header', content: 'LEAD ORIENTATION TOWARDS HEART WALL', level: 'h2' },
          { 
            type: 'table', 
            rows: [
              ['HEART WALL', 'LEADS'],
              ['Septal', 'V1, V2'],
              ['Anterior', 'V3, V4'],
              ['Lateral', 'I, aVL, V5, V6'],
              ['Inferior', 'II, III, aVF']
            ]
          },
          { type: 'image', url: 'https://images.unsplash.com/photo-1581594658553-359bc97dca01?q=80&w=800' }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Chapter 3: Cardiac Vector Theory – Formulation',
    description: 'Mathematical foundation of cardiac vectors and core formulas.',
    units: [
      {
        id: 301,
        title: 'Core Formula & Dot Product',
        blocks: [
          { type: 'header', content: 'CARDIAC VECTOR THEORY CORE FORMULA', level: 'h2' },
          { type: 'text', content: 'Voltage (scalar) = OH × COSα. The magnitude of the cardiac vector and its relative angle to the lead unit vector determine the recorded voltage.' },
          { type: 'header', content: 'VOLTAGE DIRECTION RULES', level: 'h2' },
          { 
            type: 'code',
            content: "Positive: α < 90°\nNegative: α > 90°\nMaximum:  α = 0°\nEquiphasic: α = 90°"
          },
          { type: 'image', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800' }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Chapter 4: Cardiac Vector Theory – Frontal Limb Leads',
    description: 'Heart axis determination, displacement vectors, ST/T wave analysis.',
    units: [
      {
        id: 401,
        title: 'Axis Determination & Lead Relationship',
        blocks: [
          { type: 'header', content: 'ANGLE (AXIS) DETERMINATION IN ECG', level: 'h2' },
          { type: 'text', content: 'The voltage recorded in a particular lead in ECG is due to the projection of Heart (Cardiac) vector on Lead vector. Angle determination can be done using the voltage recorded in aVF and Lead I. Correction factor 1.154 corrects for the difference in resistance between bipolar and unipolar limb leads.' },
          {
            type: 'code',
            content: "Tan α = aVF / Lead I\nTan α = (1.154 × aVF) / Lead I\n\nX-coordinate = Lead I\nY-coordinate = 1.154 × aVF\n\nNormal QRS axis:  −30° to +90°\nNormal T axis:    0° to +90°\nNormal QRS–T angle: < 60° (frontal plane)"
          },
          { type: 'header', content: 'HEART-LEAD VECTOR RELATIONSHIP – APPLICATION', level: 'h2' },
          {
            type: 'table',
            rows: [
              ['ECG Finding', 'Cause (Vector)', 'Clinical Meaning'],
              ['High Voltage in lead', 'Large cardiac vector OR small angle α', 'Hypertrophy / close proximity'],
              ['Low Voltage in lead', 'Small cardiac vector OR large angle α', 'Cardiomyopathy / effusion'],
              ['Prolonged wave duration', 'Decreased velocity OR longer distance', 'BBB / accessory pathway'],
              ['Shortened wave duration', 'Increased velocity OR shorter distance', 'WPW / pre-excitation']
            ]
          }
        ]
      },
      {
        id: 402,
        title: 'Displacement Vectors – QRS & ST Segment',
        blocks: [
          { type: 'header', content: 'DISPLACEMENT VECTORS – QRS COMPLEX', level: 'h2' },
          { type: 'text', content: 'Ventricular activation begins in the left subendocardial region of the lower third of the interventricular septum, spreading from left to right.' },
          { type: 'text', content: 'Septal vector: Left → Right (small). Opposed by smaller right → left force. Dominant: Left-to-right resultant.' },
          { type: 'text', content: 'Free wall vector: Larger LV force (Right→Left) dominates smaller RV force (Left→Right). Dominant: Right-to-left resultant.' },
          {
            type: 'table',
            rows: [
              ['QRS Pattern', 'Lead', 'Explanation'],
              ['rS complex', 'V1, V2 (right-oriented)', 'Small septal r; large LV free wall S'],
              ['RS complex', 'V3 (transition zone)', 'Transition from rS → qR'],
              ['qR complex', 'I, V4, V5, V6 (left-oriented)', 'Small septal q; large LV free wall R']
            ]
          },
          { type: 'header', content: 'DISPLACEMENT VECTOR – ST SEGMENT', level: 'h2' },
          { type: 'text', content: 'ST segment displacement (elevation or depression relative to isoelectric line) is clinically the most important part of ECG. When myocardium is injured, current flows between pathologically depolarized and normally polarized areas — this is the current of injury.' },
          {
            type: 'table',
            rows: [
              ['Condition', 'ST Vector Direction', 'ECG Leads Towards', 'ECG Result'],
              ['Myocardial Injury (transmural)', 'Towards injured surface (endo→epi)', 'Towards injury vector', 'ST Elevation'],
              ['Myocardial Injury (transmural)', 'Towards injured surface (endo→epi)', 'Away from injury vector', 'Reciprocal ST Depression'],
              ['Subendocardial Injury', 'Epi → Endo (opposite direction)', 'Towards', 'ST Depression']
            ]
          }
        ]
      },
      {
        id: 403,
        title: 'Displacement Vector – T Wave & Infarction',
        blocks: [
          { type: 'header', content: 'DISPLACEMENT VECTOR – T WAVE', level: 'h2' },
          {
            type: 'table',
            rows: [
              ['Condition', 'T Vector', 'Lead Orientation', 'ECG Result'],
              ['Ischemia (primary)', 'Away from ischemic region', 'Towards ischemia', 'T wave inversion'],
              ['Ischemia (primary)', 'Away from ischemic region', 'Away from ischemia', 'Positive T wave'],
              ['Intraventricular conduction defect', 'Away from QRS vector', 'Towards QRS region', 'T wave inversion (secondary)']
            ]
          },
          { type: 'text', content: 'In ischemia, more blood is needed to repolarise than to depolarize. So ischemia causes deviation of T-wave axis away from the affected region.' },
          { type: 'header', content: 'DISPLACEMENT VECTOR – QRS (INFARCTION)', level: 'h2' },
          { type: 'text', content: 'In myocardial infarction, the tissue is necrosed (electrically inert — electrical hole). QRS vector moves away from the infarcted/necrosed region.' },
          { type: 'text', content: 'Electrodes oriented towards the infarcted wall record activation of the opposite ventricular wall → Pathological Q waves (negative QRS deflection).' },
          { type: 'header', content: "EINTHOVEN'S EQUILATERAL TRIANGLE", level: 'h2' },
          { type: 'text', content: 'Heart is situated at the centre of the electric field which it generates. Right arm, left arm and left leg are extensions of its electrical field.' },
          { type: 'text', content: 'Plot net voltages of bipolar (I, II, III) and unipolar (aVR, aVL, aVF) limb leads on the hex-axial system — each forms an equilateral triangle. The triangle converts to a circle whose diameter = cardiac (resultant) vector.' },
          { type: 'text', content: 'Correction factor 1.154 = √(4/3) — ratio of radii of the two circles (bipolar vs unipolar). Multiply unipolar limb lead voltages by 1.154 to place both triangles on the same circle.' }
        ]
      }
    ]
  },

  {
    id: 5,
    title: 'Chapter 5: Cardiac Vector Theory – Teaching Tool',
    description: 'Novel vector-based approach to ECG interpretation.',
    units: [
      {
        id: 501,
        title: 'Novel Vector-Based Interpretation',
        blocks: [
          { type: 'header', content: 'NOVEL VECTOR BASED INTERPRETATION', level: 'h2' },
          { type: 'text', content: 'All cardiac waves (P, QRS, T) can be represented by circles in the hex-axial system. Higher voltage = larger circle. Normal QRS/T circle positions are in the left lower quadrant.' },
          { type: 'header', content: 'CLINICAL CIRCLE INTERPRETATION', level: 'h2' },
          { 
            type: 'table', 
            rows: [
              ['Condition', 'QRS Circle', 'T Circle', 'Key Finding'],
              ['Normal', '68.93°', '55.26°', 'Normal angle'],
              ['Inf Ischemia', '-20.16°', '-10.15°', 'T inv in III, aVF'],
              ['Inf MI (STEMI)', '26.34°', '107.50°', 'ST towards inferior']
            ]
          },
          { type: 'text', content: 'This innovative teaching tool simplifies the complex scalar representation into intuitive vector circles.' },
          { type: 'image', url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800' }
        ]
      }
    ]
  }
];
