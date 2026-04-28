import { useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import {
  AlertTriangle, Image, ChevronDown, Users, HeartPulse,
  BarChart2, DatabaseBackup, Upload, Shield, Eye, EyeOff,
  Save, RotateCcw, LogOut as LogOutIcon, Lock, Clock, Key,
  Monitor, Moon, Sun, Palette, Globe, Bell, Mail, Server,
  Code, Zap, Layers,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Static Data
   ═══════════════════════════════════════════════════════════════ */
const MODULES = [
  { id: 1, name: '1. Electrophysiology & ECG Waves', type: 'LEARN', visible: true },
  { id: 2, name: '2. ECG Leads', type: 'LEARN', visible: true },
  { id: 3, name: '3. Cardiac Vector Theory — Formulation', type: 'LEARN', visible: true },
  { id: 4, name: '4. Cardiac Vector Theory — Frontal Limb Leads', type: 'LEARN', visible: true },
  { id: 5, name: '5. Teaching Tool for ECG Interpretation', type: 'LEARN', visible: false },
  { id: 6, name: '6. Standardization of ECG', type: 'TRAIN', visible: true },
  { id: 7, name: '7. Heart Rate & Axis Determination', type: 'TRAIN', visible: true },
  { id: 8, name: '8. Lead Reversal & Misplacement', type: 'TRAIN', visible: true },
  { id: 9, name: '9. Precordial Lead Trainer', type: 'TRAIN', visible: true },
  { id: 10, name: '10. Novel Vector-Based ECG Interpretation', type: 'TRAIN', visible: false },
];

const SESSIONS = [
  { user: 'Dr. Admin', ip: '192.168.1.42', device: 'Mac OS • Chrome', current: true, time: 'Current Session' },
  { user: 'Sarah Chen', ip: '10.0.0.15', device: 'Windows • Edge', current: false, time: '2 hrs ago' },
];

const NAV_ITEMS = [
  { id: 'general', label: 'General', icon: <Globe size={16} /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  { id: 'security', label: 'Security', icon: <Shield size={16} /> },
];

/* ═══════════════════════════════════════════════════════════════
   Reusable Toggle
   ═══════════════════════════════════════════════════════════════ */
const Toggle = ({ on, onToggle, T }) => {
  const [hover, setHover] = useState(false);
  const offBg = T.name === 'dark' ? T.sidebar : '#cbd5e1';
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-pressed={on}
      style={{
        width: 40,
        height: 22,
        borderRadius: 22,
        border: 'none',
        backgroundColor: on ? T.primary : offBg,
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background-color 0.2s, transform 0.1s',
        transform: hover ? 'scale(1.06)' : 'scale(1)',
        outline: 'none',
        padding: 0,
        boxShadow: on ? `0 0 8px ${T.primary}50` : 'inset 0 1px 3px rgba(0,0,0,0.15)',
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          position: 'absolute',
          top: 3,
          transition: 'left 0.2s, right 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          ...(on ? { right: 3 } : { left: 3 }),
        }}
      />
    </button>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */
const SuperAdminSettings = () => {
  const { theme: T, toggleTheme } = useTheme();

  /* ── State ── */
  const [activeSection, setActiveSection] = useState('general');
  const [appName, setAppName] = useState('TTOOLECG');
  const [devContact, setDevContact] = useState('dev@ttoolecg.com');
  const [supportEmail, setSupportEmail] = useState('support@ttoolecg.com');
  const [maintenanceMode, setMaintenanceMode] = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [guestPreview, setGuestPreview] = useState(false);
  const [modules, setModules] = useState(MODULES);
  const [casesRequireLogin, setCasesRequireLogin] = useState(true);
  const [allowCaseExport, setAllowCaseExport] = useState(false);
  const [maxCases, setMaxCases] = useState(20);
  const [primaryColor, setPrimaryColor] = useState('#1B6FDE');
  const [require2FA, setRequire2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('4 Hours');
  const [minPasswordLength, setMinPasswordLength] = useState(12);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('Weekly');
  const [lastSaved, setLastSaved] = useState('2 minutes ago');
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    quizCompletionAlerts: true,
    systemStatusAlerts: true,
    weeklyDigest: false,
  });

  /* ── Helpers ── */
  const toggleModuleVisibility = useCallback((id) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, visible: !m.visible } : m));
  }, []);

  const handleSave = () => {
    setLastSaved('Just now');
    toast.success('Settings saved successfully!');
  };

  const handleResetProgress = (moduleName) => {
    toast.info(`Progress reset for "${moduleName}"`);
  };

  /* ── Style helpers ── */
  const card = (extra = {}) => ({
    backgroundColor: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    boxShadow: T.shadow,
    ...extra,
  });

  const cardTitle = {
    fontSize: 16,
    fontWeight: 600,
    color: T.text,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `1px solid ${T.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const inputStyle = (extra = {}) => ({
    width: '100%',
    backgroundColor: T.inputBg,
    border: `1px solid ${T.border}`,
    color: T.text,
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 14,
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s, box-shadow 0.2s',
    ...extra,
  });

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    color: T.textSub,
    marginBottom: 8,
    fontWeight: 500,
  };

  const btnPrimary = (extra = {}) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 8,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    border: 'none',
    backgroundColor: T.primary,
    color: '#fff',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'opacity 0.2s, transform 0.1s',
    ...extra,
  });

  const btnOutline = (extra = {}) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 8,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    background: 'transparent',
    border: `1px solid ${T.border}`,
    color: T.text,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background-color 0.2s',
    ...extra,
  });

  /* ── Scroll to section ── */
  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(`settings-section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ═══════════════════════ RENDER ═══════════════════════════ */
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', height: 'calc(100vh - 64px)', margin: -32, marginTop: -32 }}>

      {/* ── Left Settings Nav ── */}
      <div style={{
        width: 220,
        borderRight: `1px solid ${T.border}`,
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflowY: 'auto',
        backgroundColor: 'transparent',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 16px', marginBottom: 16 }}>
          Configuration
        </div>
        {NAV_ITEMS.map(item => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 8,
                cursor: 'pointer',
                marginBottom: 4,
                border: 'none',
                background: active ? T.primaryBg : 'transparent',
                color: active ? T.primary : T.textSub,
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.15s',
                textAlign: 'left',
                width: '100%',
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = T.name === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = T.text; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = T.textSub; } }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Right Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>

        {/* Scrollable area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 48px' }}>

          {/* ████████  GENERAL  ████████ */}
          <div id="settings-section-general">

            {/* App Info */}
            <div style={card()}>
              <div style={cardTitle}>
                <Zap size={18} style={{ color: T.primary }} />
                App Info
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={labelStyle}>App Name</label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    style={inputStyle()}
                    onFocus={(e) => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 2px ${T.primaryBg}`; }}
                    onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>App Version</label>
                  <input
                    type="text"
                    value="4.0"
                    readOnly
                    style={inputStyle({ color: T.textSub, backgroundColor: T.sidebar, cursor: 'default' })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Developer Contact</label>
                  <input
                    type="email"
                    value={devContact}
                    onChange={(e) => setDevContact(e.target.value)}
                    style={inputStyle()}
                    onFocus={(e) => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 2px ${T.primaryBg}`; }}
                    onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    style={inputStyle()}
                    onFocus={(e) => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 2px ${T.primaryBg}`; }}
                    onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
            </div>




            {/* Clinical Case Settings */}
            <div style={card()}>
              <div style={cardTitle}>
                <HeartPulse size={18} style={{ color: T.primary }} />
                Clinical Case Settings
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 500, color: T.text, marginBottom: 4 }}>Cases Require Login</div>
                    <div style={{ fontSize: 13, color: T.textSub }}>Users must be logged in to view cases</div>
                  </div>
                  <Toggle on={casesRequireLogin} onToggle={() => setCasesRequireLogin(!casesRequireLogin)} T={T} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 500, color: T.text, marginBottom: 4 }}>Allow Case Export</div>
                    <div style={{ fontSize: 13, color: T.textSub }}>Allow users to download PDF versions</div>
                  </div>
                  <Toggle on={allowCaseExport} onToggle={() => setAllowCaseExport(!allowCaseExport)} T={T} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 500, color: T.text, marginBottom: 4 }}>Max Cases Per User Session</div>
                    <div style={{ fontSize: 13, color: T.textSub }}>Limit number of cases viewed per login</div>
                  </div>
                  <input
                    type="number"
                    value={maxCases}
                    onChange={(e) => setMaxCases(Number(e.target.value))}
                    style={inputStyle({ width: 100, textAlign: 'center' })}
                    onFocus={(e) => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 2px ${T.primaryBg}`; }}
                    onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ████████  APPEARANCE  ████████ */}
          <div id="settings-section-appearance">
            <div style={card()}>
              <div style={cardTitle}>
                <Palette size={18} style={{ color: T.primary }} />
                Appearance Settings
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Primary Color */}
                {/* <div>
                  <div style={{ fontWeight: 500, color: T.text, marginBottom: 12 }}>App Primary Color</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: primaryColor,
                      border: `2px solid ${T.text}`,
                      boxShadow: `0 0 0 2px ${T.border}`,
                      flexShrink: 0,
                    }} />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      style={inputStyle({ width: 120 })}
                      onFocus={(e) => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 2px ${T.primaryBg}`; }}
                      onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div> */}
                {/* Theme Toggle */}
                {/* <div>
                  <div style={{ fontWeight: 500, color: T.text, marginBottom: 12 }}>Admin Panel Theme</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <label
                      style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                      onClick={() => { if (T.name === 'light') toggleTheme(); }}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        border: `2px solid ${T.name === 'dark' ? T.primary : T.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {T.name === 'dark' && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: T.primary }} />}
                      </div>
                      <Moon size={14} style={{ color: T.textSub }} />
                      <span style={{ color: T.text, fontSize: 14 }}>Dark Mode</span>
                    </label>
                    <label
                      style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                      onClick={() => { if (T.name === 'dark') toggleTheme(); }}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        border: `2px solid ${T.name === 'light' ? T.primary : T.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {T.name === 'light' && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: T.primary }} />}
                      </div>
                      <Sun size={14} style={{ color: T.textSub }} />
                      <span style={{ color: T.text, fontSize: 14 }}>Light Mode</span>
                    </label>
                  </div>
                </div> */}
              </div>
              {/* Logo Upload */}
              <div style={{ marginTop: 24 }}>
                <div style={{ fontWeight: 500, color: T.text, marginBottom: 12 }}>App Logo</div>
                <div
                  style={{
                    border: `2px dashed ${T.border}`,
                    borderRadius: 8,
                    padding: 32,
                    textAlign: 'center',
                    background: T.name === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.background = T.primaryBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.name === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'; }}
                >
                  <Upload size={32} style={{ color: T.textSub, marginBottom: 12 }} />
                  <div style={{ color: T.text, fontWeight: 500, marginBottom: 4 }}>
                    Drag & drop logo image
                  </div>
                  <div style={{ color: T.textSub, fontSize: 13 }}>
                    SVG, PNG or JPG (max. 2MB)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ████████  NOTIFICATIONS (placeholder) ████████ */}
          <div id="settings-section-notifications">
            <div style={card()}>
              <div style={cardTitle}>
                <Bell size={18} style={{ color: T.primary }} />
                Notification Preferences
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive email alerts for new user registrations' },
                  { key: 'quizCompletionAlerts', title: 'Quiz Completion Alerts', desc: 'Get notified when users complete quizzes' },
                  { key: 'systemStatusAlerts', title: 'System Status Alerts', desc: 'Receive alerts on server health and uptime' },
                  { key: 'weeklyDigest', title: 'Weekly Digest', desc: 'Send a weekly summary of platform activity' },
                ].map((item) => (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 500, color: T.text, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: T.textSub }}>{item.desc}</div>
                    </div>
                    <Toggle on={notifications[item.key]} onToggle={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))} T={T} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ████████  SECURITY  ████████ */}
          <div id="settings-section-security">
            <div style={card()}>
              <div style={cardTitle}>
                <Shield size={18} style={{ color: T.primary }} />
                Security Settings
              </div>

              {/* 2FA + Session Timeout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: T.inputBg, padding: 16, borderRadius: 8,
                  border: `1px solid ${T.border}`,
                }}>
                  <div>
                    <div style={{ fontWeight: 500, color: T.text, marginBottom: 4 }}>Require 2FA</div>
                    <div style={{ fontSize: 13, color: T.textSub }}>For all admin accounts</div>
                  </div>
                  <Toggle on={require2FA} onToggle={() => setRequire2FA(!require2FA)} T={T} />
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: T.inputBg, padding: 16, borderRadius: 8,
                  border: `1px solid ${T.border}`,
                }}>
                  <div>
                    <div style={{ fontWeight: 500, color: T.text, marginBottom: 4 }}>Session Timeout</div>
                    <div style={{ fontSize: 13, color: T.textSub }}>Auto-logout inactive users</div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      style={{
                        ...inputStyle({ width: 130, paddingRight: 32 }),
                        appearance: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="30 Minutes">30 Minutes</option>
                      <option value="1 Hour">1 Hour</option>
                      <option value="4 Hours">4 Hours</option>
                      <option value="24 Hours">24 Hours</option>
                    </select>
                    <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: T.textSub, pointerEvents: 'none' }} />
                  </div>
                </div>
              </div>

              {/* Password Policy */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontWeight: 500, color: T.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Key size={16} style={{ color: T.primary }} />
                  Password Policy
                </div>
                <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: T.textSub, fontSize: 13 }}>Min Length</span>
                    <input
                      type="number"
                      value={minPasswordLength}
                      onChange={(e) => setMinPasswordLength(Number(e.target.value))}
                      style={inputStyle({ width: 70, textAlign: 'center', padding: 8 })}
                      onFocus={(e) => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 2px ${T.primaryBg}`; }}
                      onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Toggle on={requireUppercase} onToggle={() => setRequireUppercase(!requireUppercase)} T={T} />
                    <span style={{ color: T.textSub, fontSize: 13 }}>Require Uppercase</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Toggle on={requireSpecialChar} onToggle={() => setRequireSpecialChar(!requireSpecialChar)} T={T} />
                    <span style={{ color: T.textSub, fontSize: 13 }}>Require Special Character</span>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontWeight: 500, color: T.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Monitor size={16} style={{ color: T.primary }} />
                    Active Sessions
                  </div>
                  <button
                    style={btnOutline({ borderColor: T.danger, color: T.danger, padding: '6px 12px', fontSize: 12 })}
                    onClick={() => toast.warning('All sessions terminated!')}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${T.danger}15`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <LogOutIcon size={12} />
                    Force Logout All Sessions
                  </button>
                </div>
                <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['User', 'IP Address', 'Device / Browser', 'Time', 'Action'].map((h, i) => (
                          <th key={h} style={{
                            backgroundColor: T.sidebar,
                            color: T.textSub,
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            padding: '12px 16px',
                            textAlign: i === 4 ? 'right' : 'left',
                            borderBottom: `1px solid ${T.border}`,
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SESSIONS.map((s, i) => (
                        <tr key={i}
                          style={{ transition: 'background-color 0.15s' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = T.cardHover}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '12px 16px', borderBottom: i < SESSIONS.length - 1 ? `1px solid ${T.border}` : 'none', color: T.text, fontWeight: 500, fontSize: 14 }}>
                            {s.user}
                          </td>
                          <td style={{ padding: '12px 16px', borderBottom: i < SESSIONS.length - 1 ? `1px solid ${T.border}` : 'none', color: T.textSub, fontSize: 14 }}>
                            {s.ip}
                          </td>
                          <td style={{ padding: '12px 16px', borderBottom: i < SESSIONS.length - 1 ? `1px solid ${T.border}` : 'none', color: T.textSub, fontSize: 14 }}>
                            {s.device}
                          </td>
                          <td style={{ padding: '12px 16px', borderBottom: i < SESSIONS.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                            {s.current ? (
                              <span style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: '4px 10px',
                                borderRadius: 100,
                                backgroundColor: T.name === 'dark' ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
                                color: '#34d399',
                              }}>Current Session</span>
                            ) : (
                              <span style={{ color: T.textSub, fontSize: 14 }}>{s.time}</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', borderBottom: i < SESSIONS.length - 1 ? `1px solid ${T.border}` : 'none', textAlign: 'right' }}>
                            {s.current ? (
                              <span style={{ color: T.textSub }}>—</span>
                            ) : (
                              <button
                                style={btnOutline({ padding: '4px 8px', fontSize: 11 })}
                                onClick={() => toast.info(`Session revoked for ${s.user}`)}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = T.primaryBg; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sticky Footer ── */}
        <div style={{
          padding: '16px 48px',
          backgroundColor: T.card,
          borderTop: `1px solid ${T.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <span style={{ color: T.textSub, fontSize: 13 }}>
            <Clock size={13} style={{ verticalAlign: -2, marginRight: 6 }} />
            Last saved: {lastSaved}
          </span>
          <button
            style={btnPrimary({ padding: '12px 28px' })}
            onClick={handleSave}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Save size={16} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
