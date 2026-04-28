import { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import RegisterPatientModal from '../components/RegisterPatientModal';
import {
  LayoutDashboard, Users, Calendar, LogOut, Menu,
  Bell, Activity, Sun, Moon, Search, User, BookOpen, Plus, UserPlus
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const T = theme;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { title: 'Patients', icon: <Users size={20} />, path: '/admin/patients' },
    { title: 'My Profile', icon: <User size={20} />, path: '/admin/profile' },
  ];

  const getAvatar = (img, name) => {
    if (!img) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'Doctor'}`;
    if (img.startsWith('data:')) return img;
    if (img.startsWith('http')) return img;
    return `http://127.0.0.1:8000${img}`;
  };

  const isActive = (linkPath) => {
    if (linkPath === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === linkPath || location.pathname.startsWith(linkPath + '/');
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: T.bg, color: T.text }}>
      
      {/* ── Sidebar (Synced with SuperAdmin Spacing) ── */}
      <aside style={{
        width: sidebarOpen ? 240 : 72,
        flexShrink: 0,
        backgroundColor: T.sidebar,
        borderRight: `1px solid ${T.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: T.shadow,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Brand Section */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 88 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={24} style={{ color: T.primary, flexShrink: 0 }} />
            {sidebarOpen && (
              <span style={{ fontSize: 18, fontWeight: 700, color: T.text, whiteSpace: 'nowrap', letterSpacing: '-0.5px' }}>
                TTOOLECG
              </span>
            )}
          </div>
          {sidebarOpen && (
            <span style={{
              display: 'inline-block',
              backgroundColor: T.primary,
              color: '#fff',
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 99,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              width: 'fit-content',
              boxShadow: `0 4px 6px -1px ${T.primary}30`
            }}>
              Doctor Portal
            </span>
          )}
        </div>

        {/* Navigation Section */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 8, paddingBottom: 8 }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link 
                key={item.title} 
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                  borderLeft: `3px solid ${active ? T.primary : 'transparent'}`,
                  backgroundColor: active ? T.activeNav : 'transparent',
                  color: active ? T.text : T.textSub,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = T.text; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = T.textSub; }}
              >
                <span style={{ flexShrink: 0, display: 'flex', transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s ease' }}>{item.icon}</span>
                {sidebarOpen && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout Section (Synced with SuperAdmin) */}
        <div style={{ padding: '16px', borderTop: `1px solid ${T.border}`, backgroundColor: T.name === 'dark' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ position: 'relative' }}>
              <img
                src={getAvatar(user?.image, user?.first_name)}
                alt="avatar"
                style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, backgroundColor: T.primaryBg, border: `2px solid ${T.border}` }}
              />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, backgroundColor: '#10B981', border: `2px solid ${T.sidebar}`, borderRadius: '50%' }} />
            </div>
            {sidebarOpen && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Dr. {user?.first_name || 'Ankit'}
                </div>
                <div style={{ fontSize: 12, color: T.textSub, fontWeight: 500 }}>Clinical Specialist</div>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: 14, 
              fontWeight: 500, 
              color: T.textSub, 
              padding: '4px 0',
              width: '100%',
              textAlign: 'left',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = T.danger)}
            onMouseLeave={(e) => (e.currentTarget.style.color = T.textSub)}
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Exit Portal</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Universal Header (Synced with SuperAdmin) */}
        <header style={{
          height: 64,
          backgroundColor: T.card,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          flexShrink: 0,
          boxShadow: T.shadow,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textSub, display: 'flex', padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.textSub)}
            >
              <Menu size={22} />
            </button>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0, display: 'none', md: 'block' }}>
              {navItems.find(item => isActive(item.path))?.title || 'Command Center'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Global Search */}
            <div style={{ position: 'relative', width: 280, display: 'none', lg: 'block' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textSub }} />
              <input 
                type="text" 
                placeholder="Search records..." 
                style={{
                  width: '100%',
                  backgroundColor: T.inputBg,
                  border: `1px solid ${T.border}`,
                  borderRadius: 6,
                  padding: '8px 16px 8px 40px',
                  fontSize: 14,
                  color: T.text,
                  outline: 'none',
                }}
              />
            </div>

            {/* Registration Button (Now opens Patient Modal) */}
            <button 
              onClick={() => setIsRegisterModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: T.primary,
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: `0 4px 6px -1px ${T.primary}30`
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.9)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
            >
              <UserPlus size={16} />
              Registration
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 8,
                border: `1px solid ${T.border}`,
                backgroundColor: T.primaryBg,
                cursor: 'pointer',
                color: T.primary,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = T.primary; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = T.primaryBg; e.currentTarget.style.color = T.primary; }}
            >
              {T.name === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {/* Notifications */}
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textSub }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute', top: 2, right: 2,
                width: 8, height: 8,
                backgroundColor: T.danger,
                borderRadius: '50%',
                border: `2px solid ${T.card}`
              }} />
            </button>

            {/* Avatar */}
            <img
              src={getAvatar(user?.image, user?.first_name)}
              alt="profile"
              style={{ width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', border: `2px solid ${T.border}`, backgroundColor: T.primaryBg }}
            />
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          backgroundColor: T.bg,
        }} className="no-scrollbar">
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>

      <RegisterPatientModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />
    </div>
  );
};

export default AdminLayout;
