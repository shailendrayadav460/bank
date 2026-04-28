import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  User, Mail, Phone, MapPin, Camera, Edit2, Save,
  Activity, HeartPulse, Shield, Target, BookOpen,
  Briefcase, Zap, Calendar, ClipboardCheck,
  MoreVertical, Plus, FileBarChart, Download, Filter,
  ChevronRight, CheckCircle2, TrendingUp, Star,
  Users as UsersIcon, X
} from 'lucide-react';
import authService from '../../services/authService';
import api from '../../services/api';
import { toast } from 'react-toastify';

/* ─── Tiny reusable pieces ──────────────────────────────────── */

const Badge = ({ label, color }) => (
  <span
    className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest"
    style={{ backgroundColor: `${color}15`, color }}
  >
    {label}
  </span>
);

const EditInput = ({ name, value, onChange, placeholder, type = 'text', T }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full rounded-xl px-3.5 py-2.5 text-[12px] font-semibold outline-none border transition-all"
    style={{
      color: T.text,
      borderColor: T.border,
      backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
      colorScheme: T.name === 'dark' ? 'dark' : 'light',
    }}
  />
);

const EditSelect = ({ name, value, onChange, options, T }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="w-full rounded-xl px-3.5 py-2.5 text-[12px] font-semibold outline-none border transition-all"
    style={{ color: T.text, borderColor: T.border, backgroundColor: T.card }}
  >
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const AdminProfile = () => {
  const { theme: T } = useTheme();
  const { user, updateUser } = useAuth();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('Learning');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Patients state
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);
  const [patientForm, setPatientForm] = useState({});
  const [patientSaving, setPatientSaving] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', phone: '', gender: 'Male',
    blood_group: 'A+', address: '', dob: '', image: '',
    state: '', pin: '', country: 'India',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        gender: user.gender || 'Male',
        blood_group: user.blood_group || 'A+',
        address: user.address || '',
        dob: user.dob || '',
        image: user.image || '',
        state: user.state || '',
        pin: user.pin || '',
        country: user.country || 'India',
      });
    }
  }, [user]);

  const P = useMemo(() => ({
    firstName: user?.first_name || 'Sumit',
    lastName: user?.last_name || 'Saxena',
    email: user?.email || 'sumit@ttoolecg.com',
    phone: user?.phone || '+91 98765 43210',
    specialization: user?.specialization || 'System Administrator',
    hospital: user?.hospital_name || 'TTOOL Portal',
    qualification: user?.qualification || 'Administrator',
    experience: user?.experience || '5 Yrs',
    bloodGroup: user?.blood_group || 'A+',
    gender: user?.gender || 'Male',
    address: user?.address || 'Headquarters',
    dob: user?.dob || '1990-01-01',
    state: user?.state || 'Haryana',
    pin: user?.pin || '122001',
    country: user?.country || 'India',
    id: user?.id ? `#TTOOL-${user.id}` : '#TTOOL-246534',
    hireDate: user?.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : 'Jan 05, 2023',
  }), [user]);

  const learningData = useMemo(() => [
    { title: 'Cardiac Anatomy 101', status: 'Completed', progress: 98, date: 'Oct 12, 2023', icon: <BookOpen size={13} /> },
    { title: 'Advanced Rhythm Analysis', status: 'Completed', progress: 95, date: 'Oct 10, 2023', icon: <Activity size={13} /> },
    { title: 'Lead Theory & Physics', status: 'In Progress', progress: 45, date: 'Oct 15, 2023', icon: <Zap size={13} /> },
    { title: 'Pediatric ECG Standards', status: 'Queued', progress: 12, date: 'Oct 18, 2023', icon: <Shield size={13} /> },
  ], []);

  const trainingData = useMemo(() => [
    { title: 'Advanced Arrhythmia Training', status: 'Completed', score: 98, date: 'Oct 12, 2023', icon: <Zap size={13} /> },
    { title: 'Vector Analysis Mastery', status: 'Completed', score: 94, date: 'Oct 08, 2023', icon: <Target size={13} /> },
    { title: 'Emergency ECG Protocols', status: 'In Progress', score: 65, date: 'Oct 15, 2023', icon: <Activity size={13} /> },
    { title: 'Pacemaker Rhythm Interpretation', status: 'In Progress', score: 12, date: 'Oct 18, 2023', icon: <Zap size={13} /> },
  ], []);

  const clinicalCases = useMemo(() => [
    { id: 'CAS-1024', title: 'Anterior Wall MI', status: 'Critical', date: 'Oct 20, 2023' },
    { id: 'CAS-1012', title: 'Limb Lead Reversal', status: 'Reviewed', date: 'Oct 18, 2023' },
    { id: 'CAS-0998', title: 'Normal Sinus Rhythm', status: 'Reviewed', date: 'Oct 15, 2023' },
    { id: 'CAS-0985', title: 'Paroxysmal AFib', status: 'Stable', date: 'Oct 12, 2023' },
  ], []);

  const reportData = useMemo(() => [
    { title: 'Monthly Clinical Performance', size: '2.4 MB', date: 'Oct 01, 2023' },
    { title: 'Patient Engagement Summary', size: '1.8 MB', date: 'Sep 15, 2023' },
    { title: 'Diagnostic Accuracy Audit', size: '3.1 MB', date: 'Sep 01, 2023' },
  ], []);

  const getStatusColor = useCallback((s) => {
    if (!s) return T.textSub;
    if (['Completed', 'Reviewed', 'Stable'].includes(s)) return T.success;
    if (s === 'In Progress') return T.warning;
    if (s === 'Critical') return T.danger;
    return T.textSub;
  }, [T]);

  // Fetch patients when Patients tab is active
  useEffect(() => {
    if (activeTab === 'Patients') {
      api.get('/users').then(r => {
        setPatients(r.data.filter(u => u.role === 'patient'));
      }).catch(() => toast.error('Failed to load patients'));
    }
  }, [activeTab]);

  const openEditPatient = (p) => {
    setEditPatient(p);
    setPatientForm({
      first_name: p.first_name || '',
      last_name: p.last_name || '',
      phone: p.phone || '',
      gender: p.gender || 'male',
      blood_group: p.blood_group || 'A+',
      dob: p.dob || '',
      address: p.address || '',
      state: p.state || '',
      pin: p.pin || '',
      country: p.country || 'India',
    });
  };

  const handlePatientSave = async () => {
    setPatientSaving(true);
    try {
      const res = await authService.updatePatient(editPatient.id, patientForm);
      setPatients(ps => ps.map(p => p.id === editPatient.id ? res.user : p));
      setEditPatient(null);
      toast.success('Patient updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update patient');
    } finally {
      setPatientSaving(false);
    }
  };

  const handleChange = (e) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleCancel = () => setIsEditing(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Sanitize: convert empty strings → null so DB doesn't choke on them
      const sanitize = (v) => (v === '' || v === undefined) ? null : v;
      const payload = {
        email: user.email,
        first_name:  sanitize(formData.first_name),
        last_name:   sanitize(formData.last_name),
        phone:       sanitize(formData.phone),
        gender:      sanitize(formData.gender)?.toLowerCase() ?? null,
        blood_group: sanitize(formData.blood_group),
        address:     sanitize(formData.address),
        dob:         sanitize(formData.dob),
        state:       sanitize(formData.state),
        pin:         sanitize(formData.pin),
        country:     sanitize(formData.country) ?? 'India',
        image:       formData.image, // Include image in payload
      };
      const res = await authService.updateProfile(payload);
      updateUser(res.user);
      setFormData({
        first_name: res.user.first_name,
        last_name:  res.user.last_name,
        email:      res.user.email,
        phone:      res.user.phone,
        gender:     res.user.gender,
        blood_group: res.user.blood_group,
        address:    res.user.address,
        dob:        res.user.dob,
        state:      res.user.state,
        pin:        res.user.pin,
        country:    res.user.country,
        image:      res.user.image,
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      const msg = err?.message || err?.error || JSON.stringify(err);
      toast.error('Update failed: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const getAvatar = (img) => {
    if (!img) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${P.firstName}`;
    if (img.startsWith('data:')) return img;
    if (img.startsWith('http')) return img;
    return `http://127.0.0.1:8000${img}`;
  };

  return (
    <div
      className="flex font-['DM_Sans',sans-serif] antialiased lg:h-[calc(100vh-105px)]"
      style={{ color: T.text }}
    >
      <div 
        className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden rounded-3xl border shadow-2xl transition-all duration-500"
        style={{ borderColor: T.border, backgroundColor: T.card }}
      >
        {/* ══════════════ LEFT COLUMN (Identity) ══════════════════ */}
        <div 
          className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r overflow-hidden"
          style={{ borderColor: T.border }}
        >
          {/* Header Bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-2.5 border-b" style={{ borderColor: T.border }}>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="w-12 h-12 rounded-full overflow-hidden border shadow-md" style={{ borderColor: `${T.primary}30` }}>
                  <img 
                    src={getAvatar(formData.image || user?.image)} 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={() => document.getElementById('av-upload-main').click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full"
                >
                  <Camera size={14} className="text-white" />
                </button>
                <input id="av-upload-main" type="file" accept="image/*" className="hidden" onChange={e => {
                  const f = e.target.files[0];
                  if (f) {
                    const r = new FileReader();
                    r.onloadend = () => {
                      handleChange({ target: { name: 'image', value: r.result } });
                      setIsEditing(true); // Automatically enter edit mode so SAVE button appears
                    };
                    r.readAsDataURL(f);
                  }
                }} />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight" style={{ color: T.text }}>{P.firstName} {P.lastName}</h1>
                <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: T.textSub }}>{P.id}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button onClick={handleCancel} className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all" style={{ borderColor: T.border, color: T.textSub }}>CANCEL</button>
                  <button onClick={handleSave} disabled={loading} className="px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md" style={{ backgroundColor: T.primary, color: '#fff' }}>
                    {loading ? <div className="w-3 h-3 border-2 border-t-transparent animate-spin rounded-full" /> : <><Save size={12} /> SAVE</>}
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md" style={{ backgroundColor: T.primary, color: '#fff' }}>
                  EDIT PROFILE
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4" style={{ scrollbarWidth: 'none' }}>
            <div className="max-w-xl mx-auto space-y-5">
              
              {/* Personal Information */}
              <section>
                <div className="flex items-center gap-2.5 mb-4">
                  <User size={14} style={{ color: T.primary }} />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: T.text }}>Personal Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>First Name</label>
                    {isEditing ? (
                      <EditInput name="first_name" value={formData.first_name} onChange={handleChange} T={T} />
                    ) : (
                      <div className="px-3.5 py-2.5 rounded-xl border font-semibold text-[12px]" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>{P.firstName}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Last Name</label>
                    {isEditing ? (
                      <EditInput name="last_name" value={formData.last_name} onChange={handleChange} T={T} />
                    ) : (
                      <div className="px-3.5 py-2.5 rounded-xl border font-semibold text-[12px]" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>{P.lastName}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Date of Birth</label>
                    {isEditing ? (
                      <EditInput name="dob" type="date" value={formData.dob} onChange={handleChange} T={T} />
                    ) : (
                      <div className="px-3.5 py-2.5 rounded-xl border font-semibold text-[12px]" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>{P.dob}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Gender</label>
                    {isEditing ? (
                      <EditSelect name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} T={T} />
                    ) : (
                      <div className="px-3.5 py-2.5 rounded-xl border font-semibold text-[12px]" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>{P.gender}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Blood Group</label>
                    {isEditing ? (
                      <EditSelect name="blood_group" value={formData.blood_group} onChange={handleChange} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} T={T} />
                    ) : (
                      <div className="px-3.5 py-2.5 rounded-xl border font-semibold text-[12px]" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>{P.bloodGroup}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Contact Number</label>
                    {isEditing ? (
                      <EditInput name="phone" value={formData.phone} onChange={handleChange} T={T} />
                    ) : (
                      <div className="px-3.5 py-2.5 rounded-xl border font-semibold text-[12px]" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>{P.phone}</div>
                    )}
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Email Address</label>
                    <div className="px-3 py-2 rounded-lg border font-semibold text-[12px] flex items-center gap-2" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>
                      <Mail size={12} style={{ color: T.primary, flexShrink: 0 }} />
                      <span className="truncate">{P.email}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Medical Profile */}
              <section>
                <div className="flex items-center gap-2.5 mb-4">
                  <Briefcase size={14} style={{ color: T.primary }} />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: T.text }}>Medical Profile</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Address</label>
                    {isEditing ? (
                      <textarea 
                        name="address" value={formData.address} onChange={handleChange} rows={2}
                        className="w-full rounded-xl px-3.5 py-2.5 text-[12px] font-semibold outline-none border resize-none transition-all"
                        style={{ color: T.text, borderColor: T.border, backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)' }}
                      />
                    ) : (
                      <div className="px-3.5 py-2.5 rounded-xl border font-semibold text-[12px] leading-relaxed" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>
                        {P.address}, {P.state} {P.pin}, {P.country}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>State</label>
                      {isEditing ? (
                        <EditInput name="state" value={formData.state} onChange={handleChange} T={T} />
                      ) : (
                        <div className="px-3.5 py-2.5 rounded-xl border font-semibold text-[12px]" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>{P.state}</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>PIN Code</label>
                      {isEditing ? (
                        <EditInput name="pin" value={formData.pin} onChange={handleChange} T={T} />
                      ) : (
                        <div className="px-3.5 py-2.5 rounded-xl border font-semibold text-[12px]" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>{P.pin}</div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Country</label>
                      {isEditing ? (
                        <EditInput name="country" value={formData.country} onChange={handleChange} T={T} />
                      ) : (
                        <div className="px-3.5 py-2.5 rounded-xl border font-semibold text-[12px]" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>{P.country}</div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Qualification</label>
                      <div className="px-3.5 py-2.5 rounded-xl border font-semibold text-[12px]" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>{P.qualification}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Experience</label>
                      <div className="px-3.5 py-2.5 rounded-xl border font-semibold text-[12px]" style={{ borderColor: T.border, backgroundColor: `${T.primary}03` }}>{P.experience}</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* ══════════════ RIGHT COLUMN (50%) ════════════════════ */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div
            className="flex-shrink-0 flex items-center gap-1 px-5 border-b"
            style={{ borderColor: T.border, backgroundColor: T.card, minHeight: 48 }}
          >
            {['Learning', 'Training', 'Cases', 'Report', 'Patients'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] transition-colors"
                style={{ color: activeTab === tab ? T.primary : T.textSub }}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-t-full" style={{ backgroundColor: T.primary }} />
                )}
              </button>
            ))}
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: `${T.border} transparent` }}>
            
            {/* LEARNING TAB */}
            {activeTab === 'Learning' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: T.textSub }}>Academic Progress</h3>
                </div>
                {learningData.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border transition-all hover:bg-black/5" style={{ backgroundColor: T.card, borderColor: T.border }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${T.primary}10`, color: T.primary }}>{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[12px] font-black uppercase tracking-tight truncate" style={{ color: T.text }}>{item.title}</h4>
                        <p className="text-[9px] font-bold mt-0.5" style={{ color: T.textSub }}>{item.date}</p>
                      </div>
                      <Badge label={item.status} color={getStatusColor(item.status)} />
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: T.bg }}>
                        <div className="h-full rounded-full transition-all duration-1000" style={{ backgroundColor: getStatusColor(item.status), width: `${item.progress}%` }} />
                      </div>
                      <span className="text-[9px] font-black" style={{ color: getStatusColor(item.status) }}>{item.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TRAINING TAB */}
            {activeTab === 'Training' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: T.textSub }}>Skill Assessments</h3>
                </div>
                {trainingData.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border flex items-center gap-3 transition-all hover:bg-black/5" style={{ backgroundColor: T.card, borderColor: T.border }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${T.warning}10`, color: T.warning }}>{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12px] font-black uppercase tracking-tight truncate" style={{ color: T.text }}>{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge label={`${item.score}%`} color={getStatusColor(item.status)} />
                        <span className="text-[9px] font-bold" style={{ color: T.textSub }}>• {item.date}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} style={{ color: T.textSub }} />
                  </div>
                ))}
              </div>
            )}

            {/* CASES TAB */}
            {activeTab === 'Cases' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: T.textSub }}>Recent Cases</h3>
                </div>
                {clinicalCases.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all hover:shadow-md" style={{ backgroundColor: T.card, borderColor: T.border }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${getStatusColor(item.status)}10`, color: getStatusColor(item.status) }}>
                      <HeartPulse size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-black uppercase tracking-widest mb-0.5" style={{ color: T.textSub }}>{item.id}</p>
                      <h4 className="text-[12px] font-black uppercase truncate" style={{ color: T.text }}>{item.title}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStatusColor(item.status) }} />
                        <span className="text-[9px] font-bold uppercase" style={{ color: T.textSub }}>{item.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black" style={{ color: T.text }}>{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* REPORT TAB */}
            {activeTab === 'Report' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: T.textSub }}>Analytical Reports</h3>
                  <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white">
                    <Plus size={12} /> NEW
                  </button>
                </div>
                {reportData.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl border transition-all" style={{ borderColor: T.border, backgroundColor: T.card }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-500/5 text-gray-400">
                      <FileBarChart size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12px] font-black uppercase tracking-tight truncate" style={{ color: T.text }}>{item.title}</h4>
                      <p className="text-[9px] font-bold mt-0.5" style={{ color: T.textSub }}>{item.date} • {item.size}</p>
                    </div>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-blue-500/10" style={{ color: T.primary }}>
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* PATIENTS TAB */}
            {activeTab === 'Patients' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: T.textSub }}>Patient Profiles</h3>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${T.primary}15`, color: T.primary }}>{patients.length} patients</span>
                </div>
                {patients.length === 0 && (
                  <div className="text-center py-12" style={{ color: T.textSub }}>
                    <UsersIcon size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-[11px] font-bold">No patients found</p>
                  </div>
                )}
                {patients.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: T.card, borderColor: T.border }}>
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border" style={{ borderColor: T.border }}>
                      <img src={getAvatar(p.image, p.first_name)} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12px] font-black uppercase truncate" style={{ color: T.text }}>{p.first_name} {p.last_name}</h4>
                      <p className="text-[9px] font-bold mt-0.5 truncate" style={{ color: T.textSub }}>{p.email} • {p.phone || 'No phone'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {p.blood_group && <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: `${T.danger}15`, color: T.danger }}>{p.blood_group}</span>}
                        {p.gender && <span className="text-[8px] font-black px-1.5 py-0.5 rounded capitalize" style={{ backgroundColor: `${T.primary}15`, color: T.primary }}>{p.gender}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => openEditPatient(p)}
                      className="p-2 rounded-lg transition-all hover:scale-105"
                      style={{ backgroundColor: `${T.primary}15`, color: T.primary }}
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {editPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: T.card, borderColor: T.border }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[13px] font-black uppercase tracking-widest" style={{ color: T.text }}>Edit Patient</h2>
                <p className="text-[9px] font-bold mt-0.5 uppercase tracking-widest" style={{ color: T.textSub }}>{editPatient.first_name} {editPatient.last_name}</p>
              </div>
              <button onClick={() => setEditPatient(null)} className="p-2 rounded-lg" style={{ backgroundColor: `${T.border}`, color: T.textSub }}>
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['first_name','First Name'],['last_name','Last Name'],['phone','Phone'],['dob','Date of Birth']].map(([k, lbl]) => (
                <div key={k} className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>{lbl}</label>
                  <input
                    type={k === 'dob' ? 'date' : 'text'}
                    value={patientForm[k] || ''}
                    onChange={e => setPatientForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full rounded-lg px-3 py-2 text-[12px] font-semibold outline-none border"
                    style={{ color: T.text, borderColor: T.border, backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', colorScheme: T.name === 'dark' ? 'dark' : 'light' }}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Gender</label>
                <select value={patientForm.gender || 'male'} onChange={e => setPatientForm(f => ({ ...f, gender: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-[12px] font-semibold outline-none border"
                  style={{ color: T.text, borderColor: T.border, backgroundColor: T.card }}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Blood Group</label>
                <select value={patientForm.blood_group || 'A+'} onChange={e => setPatientForm(f => ({ ...f, blood_group: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-[12px] font-semibold outline-none border"
                  style={{ color: T.text, borderColor: T.border, backgroundColor: T.card }}>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>State</label>
                <input value={patientForm.state || ''} onChange={e => setPatientForm(f => ({ ...f, state: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-[12px] font-semibold outline-none border"
                  style={{ color: T.text, borderColor: T.border, backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>PIN</label>
                <input value={patientForm.pin || ''} onChange={e => setPatientForm(f => ({ ...f, pin: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-[12px] font-semibold outline-none border"
                  style={{ color: T.text, borderColor: T.border, backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}
                />
              </div>
            </div>
            <div className="space-y-1 mt-3">
              <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Address</label>
              <textarea rows={2} value={patientForm.address || ''} onChange={e => setPatientForm(f => ({ ...f, address: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-[12px] font-semibold outline-none border resize-none"
                style={{ color: T.text, borderColor: T.border, backgroundColor: T.name === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditPatient(null)} className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border" style={{ borderColor: T.border, color: T.textSub }}>Cancel</button>
              <button onClick={handlePatientSave} disabled={patientSaving} className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2" style={{ backgroundColor: T.primary, color: '#fff' }}>
                {patientSaving ? <div className="w-3 h-3 border-2 border-t-transparent animate-spin rounded-full" /> : <><Save size={12} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;