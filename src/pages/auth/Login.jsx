import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, ChevronRight } from 'lucide-react';

const APP_ID = 'dev@sumit.com';
const APP_PASS = '142536';

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Doctor / Admin',
};

/* ─── tiny SVG icons ─── */
const IconActivity = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconEyeOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeClosed = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IconSpinner = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" style={{ width: 15, height: 15, animation: 'ttecg-spin .7s linear infinite' }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);


import { toast } from 'react-toastify';


export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme: T, toggleTheme } = useTheme();

  const [email, setEmail] = useState(APP_ID);
  const [pass, setPass] = useState(APP_PASS);
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState('SUPER_ADMIN');
  const [dropOpen, setDropOpen] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkGo, setCheckGo] = useState(false);
  const dropRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

const handleLogin = async () => {
  if (!email || !pass) {
    toast.warning('Please fill in all fields.');
    return;
  }

  setLoading(true);

  // Simulate loading
  await new Promise(resolve => setTimeout(resolve, 800));

  // Hardcoded credentials check
  if (email === APP_ID && pass === APP_PASS) {
    setLoading(false);
    setSuccess(true);
    toast.success('Successfully authenticated!');

    // Role ke hisaab se navigate karo
    setTimeout(() => {
      if (role === 'SUPER_ADMIN') {
        navigate('/super-admin');
      } else if (role === 'ADMIN') {
        navigate('/admin');
      }
    }, 800);

  } else {
    setLoading(false);
    toast.error('Invalid email or password.');
  }
};


  const ecgPath = "M0,100 L280,100 L300,100 L320,55 L345,145 L365,100 L400,100 L415,75 L435,125 L450,100 L500,100 L520,60 L540,140 L560,100 L600,100 L620,80 L640,120 L650,100 L700,100 L720,50 L745,150 L765,100 L820,100 L840,70 L860,130 L875,100 L950,100 L970,65 L990,135 L1010,100 L1200,100";

  return (
    <div className="ttecg-wrap" style={{
      backgroundColor: T.bg, color: T.text, width: '100vw', height: '100vh',
      position: 'fixed', inset: 0, fontFamilies: "'DM Sans', sans-serif", display: 'flex', overflow: 'hidden'
    }}>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute', top: 24, right: 24, zIndex: 50,
          width: 42, height: 42, borderRadius: 12, border: `1px solid ${T.border}`,
          backgroundColor: T.card, color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s', boxShadow: T.shadow
        }}
      >
        {T.name === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* ECG animated background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', opacity: T.name === 'dark' ? .15 : .08 }}>
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path className="ttecg-ecg-line" d={ecgPath} fill="none" stroke={T.primary} strokeWidth="1.8" />
          <path className="ttecg-ecg-pulse" d={ecgPath} fill="none" stroke={T.primary} strokeWidth="1.8" />
        </svg>
      </div>

      {/* ── Left Side: Branding ── */}
      <div className="ttecg-left" style={{
        width: '50%', backgroundColor: T.sidebar, borderRight: `1px solid ${T.border}`,
        padding: '4rem 5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', zIndex: 1
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, backgroundColor: T.primary, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}><IconActivity /></div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: .5, color: T.text }}>BANKFLOW</span>
          </div>
          <div style={{ fontSize: 9.5, color: T.textSub, letterSpacing: '2.5px', textTransform: 'uppercase', marginLeft: 44, marginTop: 4 }}>High-Fidelity Portal</div>
        </div>

        <div style={{ animation: 'ttecg-fadeUp 0.8s ease-out' }}>
          <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.15, color: T.text, marginBottom: 18, letterSpacing: '-1px' }}>
            Advanced Banking<br />Flow Analytics &<br /><em style={{ fontStyle: 'normal', color: T.primary }}>Intelligence.</em>
          </h1>
          <p style={{ color: T.textSub, fontSize: 14, lineHeight: 1.7, maxWidth: 380, marginBottom: '2.5rem' }}>
            Empowering financial institutions with real-time transaction monitoring, intelligent risk detection, and seamless cashflow management. Experience next-generation banking operations with secure, scalable, and data-driven insights.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {[['14k', 'Reads'], ['9', 'Cases'], ['5', 'Active TM']].map(([n, l], i) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                {i > 0 && <div style={{ width: 1, height: 36, background: T.border }} />}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: T.text }}>{n}</span>
                  <span style={{ fontSize: 9, color: T.textSub, textTransform: 'uppercase', letterSpacing: 2 }}>{l}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 10, color: T.textSub }}>© 2026 BANKFLOW · SECURED ACCESS</div>
      </div>

      {/* ── Right Side: Login Card ── */}
      <div className="ttecg-right" style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1
      }}>
        <div className="ttecg-card" style={{
          width: '100%', maxWidth: 360, backgroundColor: T.card, border: `1px solid ${T.border}`,
          borderRadius: 24, padding: '2.5rem 2rem', position: 'relative', zIndex: 2, boxShadow: T.shadow,
          maxHeight: 'calc(100vh - 40px)', overflowY: 'auto'
        }}>


          {/* Access Success Overlay */}
          {success && (
            <div style={{ position: 'absolute', inset: 0, borderRadius: 24, backgroundColor: T.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 10 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: `${T.success}15`, border: `1px solid ${T.success}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 20, color: T.text }}>Access Granted</h3>
              <p style={{ fontSize: 13, color: T.textSub }}>Authenticating your session...</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, backgroundColor: `${T.primary}10`,
              border: `1px solid ${T.primary}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.primary, marginBottom: 12
            }}><IconShield /></div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Welcome Back
            </h2>
            <p style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>Enter your credentials to continue</p>
          </div>



          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, marginLeft: 4 }}>Identity Email</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.textSub }}><IconMail /></span>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  autoComplete="off"
                  style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: 14, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 13, outline: 'none' }}
                  placeholder="admin@ttoolecg.com"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, marginLeft: 4 }}>Vault Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.textSub }}><IconLock /></span>
                <input
                  type={showPw ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                  autoComplete="new-password"
                  style={{ width: '100%', padding: '12px 42px 12px 42px', borderRadius: 14, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 13, outline: 'none' }}
                  placeholder="••••••••"
                />
                <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: T.textSub, cursor: 'pointer' }}>
                  {showPw ? <IconEyeClosed /> : <IconEyeOpen />}
                </button>
              </div>
            </div>

            <div style={{ position: 'relative' }} ref={dropRef}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, marginLeft: 4 }}>Role Authorization</label>
              <div onClick={() => setDropOpen(!dropOpen)} style={{ padding: '12px 14px', borderRadius: 14, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IconUsers /> {ROLE_LABELS[role]}
                </div>
                <ChevronRight size={14} style={{ transform: dropOpen ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
              </div>
              {dropOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', zIndex: 50, boxShadow: T.shadow }}>
                  {Object.entries(ROLE_LABELS).map(([k, v]) => (
                    <div key={k} onClick={() => { setRole(k); setDropOpen(false); }} style={{ padding: '12px 16px', fontSize: 13, color: T.text, cursor: 'pointer', backgroundColor: role === k ? `${T.primary}15` : 'transparent' }}>{v}</div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleLogin} disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', backgroundColor: T.primary, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, boxShadow: `0 8px 24px ${T.primary}30` }}
            >
              {loading ? <IconSpinner /> : <IconShield />}
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 0' }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ padding: '0 12px', fontSize: 9, color: T.textSub, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>Authorized Only</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ttecg-ecgDraw { to { stroke-dashoffset: 0; } }
        @keyframes ttecg-ecgScroll { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -2400; } }
        @keyframes ttecg-fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ttecg-spin { to { transform: rotate(360deg); } }
        .ttecg-ecg-line { stroke-dasharray: 2400; stroke-dashoffset: 2400; animation: ttecg-ecgDraw 3s ease-out forwards; }
        .ttecg-ecg-pulse { stroke-dasharray: 2400; stroke-dashoffset: 0; animation: ttecg-ecgScroll 4s linear infinite; opacity: 0.4; }
        .ttecg-card::-webkit-scrollbar { width: 4px; }
        .ttecg-card::-webkit-scrollbar-track { background: transparent; }
        .ttecg-card::-webkit-scrollbar-thumb { background: ${T.border}; borderRadius: 10px; }
      `}</style>
    </div>
  );
}