import { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Users, BookOpen, HeartPulse, CheckSquare,
  BarChart2, FileText, Settings, LogOut, Menu, Bell, Search,
  Activity, Sun, Moon, GraduationCap,
  X, Mail, Phone, Briefcase, Building2, CheckCircle, Plus, UsersIcon
} from 'lucide-react';

/* ── Add Agent Modal (inline, bank-themed) ─────────────────── */
const emptyMember = () => ({ fullName: '', email: '', phone: '', role: '', department: '', status: 'Active' });

function AddAgentModal({ isOpen, onClose, theme }) {
  const T = theme;
  const [members, setMembers] = useState([emptyMember()]);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const update = (i, field, val) =>
    setMembers(prev => prev.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)));
  const addMember = () => setMembers(prev => [...prev, emptyMember()]);
  const removeMember = (i) => setMembers(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    const valid = members.every(m => m.fullName && m.email && m.role);
    if (!valid) { alert('Full Name, Email and Role are required.'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    // TODO: wire up to your actual agent registration API here
    console.log('New agents:', members);
    setSaving(false);
    setMembers([emptyMember()]);
    onClose();
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px 10px 34px',
    border: `1.5px solid ${T.border}`,
    borderRadius: 10,
    fontSize: 13,
    color: T.text,
    backgroundColor: T.card,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      backgroundColor: 'rgba(26,22,20,0.55)',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        backgroundColor: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        width: '100%', maxWidth: 680,
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
      }}>
        {/* Header */}
        <div style={{
          padding: '28px 32px 20px',
          borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: T.primaryBg || '#fdf2ef',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Users size={16} color={T.primary} />
              </div>
              <span style={{
                fontSize: 18, fontWeight: 800, color: T.text,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}>
                Add Agent Members
              </span>
            </div>
            <p style={{ fontSize: 13, color: T.textSub, marginLeft: 42, margin: '4px 0 0 42px' }}>
              Register one or more bank agents at once.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: T.textSub }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '20px 32px', flex: 1 }}>
          {members.map((m, i) => (
            <div key={i} style={{
              border: `1.5px solid ${T.border}`,
              borderRadius: 14, padding: '20px 22px', marginBottom: 16,
              position: 'relative',
              backgroundColor: T.inputBg || '#f2efe9',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    backgroundColor: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{i + 1}</span>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: T.textSub,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    Agent #{i + 1}
                  </span>
                </div>
                {members.length > 1 && (
                  <button
                    onClick={() => removeMember(i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.primary, padding: 4 }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Full Name', field: 'fullName', placeholder: 'e.g. Adrian Cole', required: true, icon: <Users size={13} /> },
                  { label: 'Email', field: 'email', placeholder: 'name@aurelia.bank', required: true, type: 'email', icon: <Mail size={13} /> },
                  { label: 'Phone', field: 'phone', placeholder: '+1 555 000 0000', icon: <Phone size={13} /> },
                  { label: 'Role', field: 'role', placeholder: 'e.g. Relationship Manager', required: true, icon: <Briefcase size={13} /> },
                ].map(({ label, field, placeholder, required, type, icon }) => (
                  <div key={field}>
                    <label style={{
                      fontSize: 10, fontWeight: 800, color: T.textSub,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      display: 'block', marginBottom: 6,
                    }}>
                      {label} {required && <span style={{ color: T.primary }}>*</span>}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textSub }}>
                        {icon}
                      </div>
                      <input
                        type={type || 'text'}
                        value={m[field]}
                        onChange={e => update(i, field, e.target.value)}
                        placeholder={placeholder}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = T.primary)}
                        onBlur={e => (e.target.style.borderColor = T.border)}
                      />
                    </div>
                  </div>
                ))}

                {/* Department */}
                <div>
                  <label style={{
                    fontSize: 10, fontWeight: 800, color: T.textSub,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    display: 'block', marginBottom: 6,
                  }}>
                    Department
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textSub }}>
                      <Building2 size={13} />
                    </div>
                    <input
                      value={m.department}
                      onChange={e => update(i, 'department', e.target.value)}
                      placeholder="e.g. Private Wealth · West"
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = T.primary)}
                      onBlur={e => (e.target.style.borderColor = T.border)}
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label style={{
                    fontSize: 10, fontWeight: 800, color: T.textSub,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    display: 'block', marginBottom: 6,
                  }}>
                    Status
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textSub }}>
                      <CheckCircle size={13} />
                    </div>
                    <select
                      value={m.status}
                      onChange={e => update(i, 'status', e.target.value)}
                      style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                      onFocus={e => (e.target.style.borderColor = T.primary)}
                      onBlur={e => (e.target.style.borderColor = T.border)}
                    >
                      <option>Active</option>
                      <option>On Leave</option>
                      <option>Blocked</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addMember}
            style={{
              width: '100%', padding: 13,
              border: `2px dashed ${T.border}`, borderRadius: 14,
              background: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, fontSize: 13, fontWeight: 700, color: T.textSub,
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; }}
          >
            <Plus size={15} /> Add another agent
          </button>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 32px',
          borderTop: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 22px', border: `1.5px solid ${T.border}`,
              borderRadius: 10, background: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, color: T.text, fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 24px', backgroundColor: T.primary,
              border: 'none', borderRadius: 10, cursor: 'pointer',
              fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 14px rgba(200,75,49,0.35)',
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Users size={14} />
            {saving
              ? 'Saving...'
              : `Save ${members.length} Agent${members.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── SuperAdminLayout ───────────────────────────────────────── */
const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const T = theme;

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { title: 'Dashboard',        icon: <LayoutDashboard size={20} />, path: '/super-admin' },
    { title: 'Users',            icon: <Users size={20} />,           path: '/super-admin/users' },
    { title: 'Learning',         icon: <BookOpen size={20} />,        path: '/super-admin/modules' },
    { title: 'TM Editor',        icon: <GraduationCap size={20} />,   path: '/super-admin/training-modules' },
    { title: 'Training',         icon: <BarChart2 size={20} />,       path: '/super-admin/training' },
    { title: 'Clinical Cases',   icon: <HeartPulse size={20} />,      path: '/super-admin/cases' },
    { title: 'Quizzes',          icon: <CheckSquare size={20} />,     path: '/super-admin/quizzes' },
    { title: 'Analytics',        icon: <BarChart2 size={20} />,       path: '/super-admin/analytics' },
    { title: 'Settings',         icon: <Settings size={20} />,        path: '/super-admin/settings' },
  ];

  const isActive = (linkPath) => {
    if (linkPath === '/super-admin') return location.pathname === '/super-admin';
    return location.pathname === linkPath || location.pathname.startsWith(linkPath + '/');
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      display: 'flex', height: '100vh', overflow: 'hidden',
      backgroundColor: T.bg, color: T.text,
      transition: 'background-color 0.25s, color 0.25s',
    }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: sidebarOpen ? 240 : 72,
        flexShrink: 0,
        backgroundColor: T.sidebar,
        borderRight: `1px solid ${T.border}`,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: T.name === 'light' ? '2px 0 12px rgba(0,0,0,0.06)' : T.shadow,
        transition: 'width 0.25s ease, background-color 0.25s',
        zIndex: 10,
      }}>
        {/* Brand */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 88 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={24} style={{ color: T.primary, flexShrink: 0 }} />
            {sidebarOpen && (
              <span style={{ fontSize: 18, fontWeight: 700, color: T.text, whiteSpace: 'nowrap' }}>
                TTOOLECG
              </span>
            )}
          </div>
          {sidebarOpen && (
            <span style={{
              display: 'inline-block', backgroundColor: T.primary, color: '#fff',
              fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99,
              letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap', width: 'fit-content',
            }}>
              Super Admin
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 8, paddingBottom: 8 }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.title}
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 24px', fontSize: 14, fontWeight: 500,
                  textDecoration: 'none',
                  borderLeft: `3px solid ${active ? T.primary : 'transparent'}`,
                  backgroundColor: active ? T.activeNav : 'transparent',
                  color: active ? T.text : T.textSub,
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = T.text; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = T.textSub; }}
              >
                <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                {sidebarOpen && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '16px', borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`}
              alt="avatar"
              style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, backgroundColor: T.primaryBg }}
            />
            {sidebarOpen && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.first_name || 'Dr. Superdmin'}
                </div>
                <div style={{ fontSize: 12, color: T.textSub }}>System Administrator</div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: T.textSub, padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = T.danger)}
            onMouseLeave={e => (e.currentTarget.style.color = T.textSub)}
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top Header */}
        <header style={{
          height: 64,
          backgroundColor: T.card,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', flexShrink: 0,
          boxShadow: T.name === 'light' ? '0 1px 8px rgba(0,0,0,0.06)' : T.shadow,
          transition: 'background-color 0.25s, box-shadow 0.25s',
          zIndex: 5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textSub, display: 'flex', padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = T.text)}
              onMouseLeave={e => (e.currentTarget.style.color = T.textSub)}
            >
              <Menu size={22} />
            </button>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>
              {navItems.find(item => isActive(item.path))?.title || 'Dashboard'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Search */}
            <div style={{ position: 'relative', width: 280 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textSub }} />
              <input
                type="text"
                placeholder="Search users, modules..."
                style={{
                  width: '100%', backgroundColor: T.inputBg,
                  border: `1px solid ${T.border}`, borderRadius: 6,
                  padding: '8px 16px 8px 40px', fontSize: 14,
                  color: T.text, outline: 'none',
                }}
              />
            </div>

            {/* ── Add Agent Button (replaces Register User) ── */}
            <button
              onClick={() => setIsAddAgentModalOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px',
                backgroundColor: T.primary, color: '#fff',
                border: 'none', borderRadius: 6,
                fontSize: 14, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap',
                boxShadow: '0 4px 14px rgba(200,75,49,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <Users size={16} />
              Add Agent
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${T.name === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 38, height: 38, borderRadius: 8,
                border: `1px solid ${T.border}`,
                backgroundColor: T.primaryBg, cursor: 'pointer',
                color: T.primary, flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.primary; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.primaryBg; e.currentTarget.style.color = T.primary; }}
            >
              {T.name === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Bell */}
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textSub }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute', top: 2, right: 2,
                width: 16, height: 16,
                backgroundColor: T.danger, color: '#fff',
                fontSize: 10, fontWeight: 700, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>3</span>
            </button>

            {/* Avatar */}
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`}
              alt="profile"
              style={{ width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', border: `2px solid ${T.border}`, backgroundColor: T.primaryBg }}
            />
          </div>
        </header>

        {/* Scrollable Content */}
        <main style={{
          flex: 1, overflowY: 'auto', padding: 32,
          backgroundColor: T.bg, transition: 'background-color 0.25s',
        }}>
          <Outlet />
        </main>
      </div>

      {/* ── Add Agent Modal ── */}
      <AddAgentModal
        isOpen={isAddAgentModalOpen}
        onClose={() => setIsAddAgentModalOpen(false)}
        theme={T}
      />
    </div>
  );
};

export default SuperAdminLayout;