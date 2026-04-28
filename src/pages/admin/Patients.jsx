import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Search, User, ChevronRight, Edit2, Save, 
  Mail, Phone, Calendar, BookOpen, 
  Activity, HeartPulse, GraduationCap,
  CheckCircle2, Zap, Target, ArrowRight, 
  Download, Users as UsersIcon, Camera, MapPin
} from 'lucide-react';

/* ── Static Mock Data ────────────────────────────────────────── */
const MOCK_PATIENTS = [
  {
    id: 'PAT-001', first_name: 'Maria', last_name: 'Garcia', age: 45, gender: 'Female',
    email: 'm.garcia@example.com', phone: '+1 (555) 888-9999',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    condition: 'Chronic Hypertension', status: 'Active',
    blood_group: 'B+', dob: '1978-05-12', address: '123 Heart Lane, Wellness City',
    state: 'Noida', pin: '201301', country: 'India',
    progress: 74, sessions: 42,
    learning: [
      { title: 'Electrophysiology', pct: 100, status: 'Completed', date: 'Oct 15' },
      { title: 'ECG Leads', pct: 45, status: 'In Progress', date: 'Pending' }
    ],
    training: [
      { title: 'Rhythm Recognition', score: '98%', date: 'Oct 22', type: 'QUIZ' },
      { title: 'Lead Placement', score: '85%', date: 'Oct 24', type: 'SIM' }
    ]
  },
  {
    id: 'PAT-002', first_name: 'James', last_name: 'Wilson', age: 62, gender: 'Male',
    email: 'j.wilson@example.com', phone: '+1 (555) 777-8888',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    condition: 'Post-MI Recovery', status: 'Stable',
    blood_group: 'O+', dob: '1961-11-04', address: '456 Recovery Road, Health Town',
    state: 'Delhi', pin: '110001', country: 'India',
    progress: 92, sessions: 128,
    learning: [
      { title: 'Cardiac Anatomy', pct: 100, status: 'Completed', date: 'Nov 05' }
    ],
    training: [
      { title: 'Pattern recognition', score: '100%', date: 'Nov 08', type: 'QUIZ' }
    ]
  }
];

const Patients = () => {
  const { theme: T } = useTheme();
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(MOCK_PATIENTS[0].id);
  const [activeTab, setActiveTab] = useState('Learning');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const P = useMemo(() => patients.find(p => p.id === selectedId), [patients, selectedId]);

  const filteredPatients = useMemo(() => patients.filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase())
  ), [patients, search]);

  const getAvatar = (img, name) => {
    if (!img) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'Patient'}`;
    if (img.startsWith('data:') || img.startsWith('http')) return img;
    return `http://127.0.0.1:8000${img}`;
  };

  const handleEdit = () => {
    setEditForm({ ...P });
    setIsEditing(true);
  };

  const handleSave = () => {
    setPatients(prev => prev.map(p => p.id === editForm.id ? editForm : p));
    setIsEditing(false);
  };

  const handleChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const InputField = ({ label, name, type = "text", options }) => (
    <div className="flex flex-col gap-1.5 group">
      <label className="text-[9px] font-black uppercase tracking-widest opacity-40">{label}</label>
      {options ? (
        <select
          name={name} value={editForm[name]} onChange={handleChange}
          className="w-full px-4 py-2.5 text-[12px] rounded-xl border outline-none appearance-none transition-all cursor-pointer font-bold"
          style={{ backgroundColor: T.inputBg, borderColor: T.border, color: T.text }}
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input
          type={type} name={name} value={editForm[name]} onChange={handleChange}
          className="w-full px-4 py-2.5 text-[12px] rounded-xl border outline-none transition-all font-bold"
          style={{ backgroundColor: T.inputBg, borderColor: T.border, color: T.text }}
        />
      )}
    </div>
  );

  return (
    <div 
      className="flex font-['DM_Sans',sans-serif] antialiased lg:h-[calc(100vh-105px)]"
      style={{ color: T.text }}
    >
      <div 
        className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden rounded-3xl border shadow-2xl transition-all duration-500"
        style={{ borderColor: T.border, backgroundColor: T.card }}
      >
        
        {/* ─── COLUMN 1: PATIENT LIST ─── */}
        <div className="w-full lg:w-64 flex flex-col border-b lg:border-b-0 lg:border-r" style={{ borderColor: T.border, backgroundColor: T.sidebar }}>
          <div className="p-4 border-b" style={{ borderColor: T.border }}>
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.textSub }} />
              <input 
                type="text" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[10px] font-black uppercase outline-none transition-all focus:ring-1"
                style={{ backgroundColor: T.inputBg, border: `1px solid ${T.border}`, color: T.text, ringColor: T.primary }}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1 max-h-[300px] lg:max-h-full">
            {filteredPatients.map(p => (
              <div 
                key={p.id} onClick={() => { setSelectedId(p.id); setIsEditing(false); }}
                className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all group hover:scale-[1.02]"
                style={{ backgroundColor: selectedId === p.id ? T.activeNav : 'transparent' }}
              >
                <img src={getAvatar(p.image, p.first_name)} className="w-9 h-9 rounded-full border shadow-md object-cover" style={{ borderColor: selectedId === p.id ? T.primary : T.border }} alt="" />
                <div className="min-w-0">
                  <div className="text-[12px] font-black uppercase truncate" style={{ color: selectedId === p.id ? T.primary : T.text }}>{p.first_name} {p.last_name}</div>
                  <div className="text-[9px] font-bold opacity-50 truncate tracking-wider">{p.condition}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── COLUMN 2: PERSONAL PROFILE ─── */}
        <div className="w-full lg:w-[38%] flex flex-col border-b lg:border-b-0 lg:border-r overflow-hidden" style={{ borderColor: T.border }}>
          <div className="flex-shrink-0 px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: T.border }}>
            <div className="flex items-center gap-4">
               <div className="relative group/avatar">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 shadow-xl p-0.5" style={{ borderColor: T.primary }}>
                    <img src={isEditing ? getAvatar(editForm.image, editForm.first_name) : getAvatar(P.image, P.first_name)} className="w-full h-full rounded-full object-cover" alt="" />
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                      <Camera size={16} className="text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
               </div>
               <div>
                  <h2 className="text-base font-black uppercase tracking-tight leading-none mb-1">{P.first_name} {P.last_name}</h2>
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: `${T.primary}15`, color: T.primary }}>{P.id}</span>
               </div>
            </div>
            {isEditing ? (
              <button 
                onClick={handleSave} 
                className="p-3 rounded-full text-white shadow-xl active:scale-95 transition-all flex items-center justify-center" 
                style={{ backgroundColor: T.primary, boxShadow: `0 8px 15px -3px ${T.primary}40` }}
              >
                <Save size={18} />
              </button>
            ) : (
              <button 
                onClick={handleEdit} 
                className="p-3 rounded-full text-white shadow-xl active:scale-95 transition-all flex items-center justify-center" 
                style={{ backgroundColor: T.primary, boxShadow: `0 8px 15px -3px ${T.primary}40` }}
              >
                <Edit2 size={18} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar space-y-8">
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2" style={{ color: T.primary }}>
                <User size={14} /> Personal Information
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <InputField label="First Name" name="first_name" />
                    <InputField label="Last Name" name="last_name" />
                    <InputField label="Gender" name="gender" options={['Male', 'Female', 'Other']} />
                    <InputField label="Age" name="age" type="number" />
                    <InputField label="Blood Group" name="blood_group" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
                    <InputField label="Status" name="condition" />
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Full Identity</label>
                      <div className="text-[12px] font-black uppercase">{P.first_name} {P.last_name}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Gender</label>
                      <div className="text-[12px] font-black uppercase">{P.gender}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Patient Age</label>
                      <div className="text-[12px] font-black uppercase">{P.age} Years</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Blood Group</label>
                      <div className="text-[12px] font-black uppercase text-red-500">{P.blood_group}</div>
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2" style={{ color: T.primary }}>
                <Activity size={14} /> Clinical & Contact
              </h3>
              
              <div className="space-y-5">
                {isEditing ? (
                  <>
                    <InputField label="Email Address" name="email" type="email" />
                    <InputField label="Phone Number" name="phone" />
                    <InputField label="Home Address" name="address" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4 group">
                      <div className="p-2.5 rounded-xl transition-colors" style={{ backgroundColor: T.bg }}><Mail size={14} className="opacity-70" /></div>
                      <div className="text-[12px] font-black tracking-tight">{P.email}</div>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="p-2.5 rounded-xl transition-colors" style={{ backgroundColor: T.bg }}><Phone size={14} className="opacity-70" /></div>
                      <div className="text-[12px] font-black tracking-tight">{P.phone}</div>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="p-2.5 rounded-xl transition-colors flex-shrink-0" style={{ backgroundColor: T.bg }}><MapPin size={14} className="opacity-70" /></div>
                      <div className="text-[12px] font-black leading-relaxed uppercase tracking-tight">{P.address}, {P.state}, {P.pin}</div>
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* ─── COLUMN 3: CLINICAL DATA ─── */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-[400px]">
          <div className="flex-shrink-0 px-6 pt-4 border-b" style={{ borderColor: T.border }}>
            <div className="flex gap-6">
              {['Learning', 'Training', 'Cases', 'Reports'].map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab ? '' : 'border-transparent'}`}
                  style={{ color: activeTab === tab ? T.primary : T.textSub, borderBottomColor: activeTab === tab ? T.primary : 'transparent' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
            {activeTab === 'Learning' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 mb-2">
                   <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: T.bg, borderColor: T.border }}>
                      <div className="text-xl font-black">{P.progress}%</div>
                      <div className="text-[8px] font-black uppercase opacity-40">Progress</div>
                   </div>
                   <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: T.bg, borderColor: T.border }}>
                      <div className="text-xl font-black">{P.sessions}</div>
                      <div className="text-[8px] font-black uppercase opacity-40">Sessions</div>
                   </div>
                </div>
                {P.learning.map((l, i) => (
                  <div key={i} className="p-4 rounded-2xl border group transition-all" style={{ borderColor: T.border }}>
                    <div className="flex justify-between items-center mb-2">
                       <h4 className="text-[11px] font-black uppercase">{l.title}</h4>
                       <span className="text-[9px] font-bold opacity-50">{l.status}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: T.bg }}>
                       <div className="h-full" style={{ backgroundColor: T.primary, width: `${l.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Training' && (
              <div className="space-y-3">
                {P.training.map((t, i) => (
                  <div key={i} className="p-4 rounded-2xl border flex items-center justify-between" style={{ borderColor: T.border }}>
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded-xl" style={{ backgroundColor: `${T.primary}15`, color: T.primary }}><Zap size={14} /></div>
                       <div>
                          <div className="text-[11px] font-black uppercase">{t.title}</div>
                          <div className="text-[9px] font-bold opacity-50">{t.type} • {t.date}</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-black" style={{ color: T.primary }}>{t.score}</div>
                       <div className="text-[8px] font-black uppercase opacity-40">Accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Cases' && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 gap-3">
                   {[
                     { id: 'CAS-881', title: 'Normal Sinus Rhythm', status: 'Reviewed', severity: 'Normal' },
                     { id: 'CAS-902', title: 'Limb Lead Reversal', status: 'Pending', severity: 'Attention' },
                     { id: 'CAS-1024', title: 'Anterior Wall MI', status: 'Critical', severity: 'Emergency' }
                   ].map((c, i) => (
                     <div key={i} className="p-4 rounded-2xl border flex items-center gap-4 transition-all hover:scale-[1.01]" style={{ backgroundColor: T.bg, borderColor: T.border }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${T.primary}15` }}>
                           <HeartPulse size={18} style={{ color: T.primary }} />
                        </div>
                        <div className="flex-1">
                           <div className="text-[8px] font-black uppercase opacity-30 tracking-widest">{c.id}</div>
                           <h4 className="text-[11px] font-black uppercase">{c.title}</h4>
                        </div>
                        <div className="text-right">
                           <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${c.severity === 'Emergency' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>{c.status}</span>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'Reports' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Analytics Summary */}
                <div className="grid grid-cols-3 gap-3">
                   <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: T.bg, borderColor: T.border }}>
                      <div className="text-[11px] font-black text-blue-500">{P.learning.length}</div>
                      <div className="text-[8px] font-black uppercase opacity-40">Modules</div>
                   </div>
                   <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: T.bg, borderColor: T.border }}>
                      <div className="text-[11px] font-black text-amber-500">{P.training.length}</div>
                      <div className="text-[8px] font-black uppercase opacity-40">Quizzes</div>
                   </div>
                   <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: T.bg, borderColor: T.border }}>
                      <div className="text-[11px] font-black text-green-500">14</div>
                      <div className="text-[8px] font-black uppercase opacity-40">Cases</div>
                   </div>
                </div>

                {/* Activity Visual (Bar Chart style) */}
                <div className="p-5 rounded-3xl border" style={{ backgroundColor: T.bg, borderColor: T.border }}>
                   <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50">7-Day Activity Analysis</h4>
                      <Target size={12} style={{ color: T.primary }} />
                   </div>
                   <div className="flex items-end justify-between h-32 px-2">
                      {[4, 7, 4, 9, 6, 3, 8].map((v, i) => (
                        <div key={i} className="group relative flex flex-col items-center gap-2">
                           <span className="text-[8px] font-black opacity-40 group-hover:opacity-100 transition-opacity mb-1">{v}</span>
                           <div className="w-6 rounded-t-lg transition-all group-hover:brightness-110" style={{ height: `${v * 10}%`, backgroundColor: i === 3 ? T.primary : `${T.primary}40` }} />
                           <span className="text-[7px] font-black uppercase opacity-30">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Performance Chart (New) */}
                <div className="p-5 rounded-3xl border" style={{ backgroundColor: T.bg, borderColor: T.border }}>
                   <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50">Accuracy Score Trend</h4>
                      <Zap size={12} className="text-amber-500" />
                   </div>
                   <div className="flex items-center gap-1.5 h-8">
                      {[70, 85, 92, 78, 95, 88].map((s, i) => (
                        <div key={i} className="flex-1 h-full rounded-md overflow-hidden bg-slate-800/50 relative group">
                           <div className="absolute inset-0 bg-green-500/20" style={{ width: `${s}%` }} />
                           <div className="absolute inset-0 flex items-center justify-center text-[7px] font-black opacity-0 group-hover:opacity-100 transition-opacity">{s}%</div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Performance Insight */}
                <div className="p-5 rounded-3xl border border-dashed" style={{ borderColor: T.border }}>
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${T.primary}15` }}>
                         <Activity size={18} style={{ color: T.primary }} />
                      </div>
                      <div>
                         <h5 className="text-[11px] font-black uppercase mb-1">Performance Insight</h5>
                         <p className="text-[10px] font-medium opacity-60 leading-relaxed">
                            Patient shows high engagement in <b>Rhythm recognition</b> but needs more focus on <b>ECG Leads</b> module. Current accuracy is above average.
                         </p>
                      </div>
                   </div>
                </div>

                {/* Recent activity Log */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2">Recent Timeline</h4>
                   {[
                     { act: 'Completed Electrophysiology', time: '12m ago', icon: CheckCircle2 },
                     { act: 'Attempted Quiz: Rhythm', time: '1h ago', icon: Zap },
                     { act: 'Reviewed Case #CAS-881', time: '5h ago', icon: Activity }
                   ].map((log, idx) => (
                     <div key={idx} className="flex items-center gap-4 px-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: T.primary }} />
                        <div className="flex-1 text-[10px] font-black uppercase tracking-tight">{log.act}</div>
                        <div className="text-[8px] font-bold opacity-30 uppercase whitespace-nowrap">{log.time}</div>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Patients;
