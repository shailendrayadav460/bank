import { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  GraduationCap, BookOpen, User, LogOut, Menu, 
  Bell, HeartPulse, Sun, Moon, Search, Layers
} from 'lucide-react';

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const T = theme;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { title: 'Learning Hub', icon: <GraduationCap size={20} />, path: '/student' },
    { title: 'My Courses',   icon: <BookOpen      size={20} />, path: '/student/courses' },
    { title: 'Premium Learning', icon: <Layers size={20} />, path: '/learning' },
    { title: 'My Profile',   icon: <User          size={20} />, path: '/student/profile' },
  ];

  const isActive = (path) =>
    path === '/student' ? location.pathname === '/student' : location.pathname.startsWith(path);

  const ACCENT = '#f59e0b';

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: T.bg, color: T.text }}>

      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? 240 : 72, flexShrink: 0, backgroundColor: T.sidebar, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: T.shadow }}>
        {/* Brand */}
        <div style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 10, minHeight: 80 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <HeartPulse size={20} color="#fff" />
          </div>
          {sidebarOpen && <span style={{ fontSize: 17, fontWeight: 700, color: T.text, whiteSpace: 'nowrap' }}>Student Portal</span>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.title} to={item.path}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', fontSize: 14, fontWeight: 500, textDecoration: 'none', borderLeft: `3px solid ${active ? ACCENT : 'transparent'}`, backgroundColor: active ? (T.name === 'dark' ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.07)') : 'transparent', color: active ? T.text : T.textSub, whiteSpace: 'nowrap' }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = T.text; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = T.textSub; }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: 24, borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Student'}`} alt="avatar"
              style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, backgroundColor: T.primaryBg }} />
            {sidebarOpen && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Student'}</div>
                <div style={{ fontSize: 12, color: T.textSub }}>Medical Student</div>
              </div>
            )}
          </div>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: T.textSub, padding: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = T.danger)}
            onMouseLeave={(e) => (e.currentTarget.style.color = T.textSub)}
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: 72, backgroundColor: T.card, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0, boxShadow: T.shadow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textSub, display: 'flex', padding: 0 }}>
              <Menu size={22} />
            </button>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>Learning Hub</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 240 }}>
              <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.textSub }} />
              <input type="text" placeholder="Search modules..." style={{ width: '100%', backgroundColor: T.inputBg, border: `1px solid ${T.border}`, borderRadius: 6, padding: '7px 14px 7px 36px', fontSize: 14, color: T.text, outline: 'none' }} />
            </div>
            <button onClick={toggleTheme}
              style={{ width: 38, height: 38, borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.primaryBg, cursor: 'pointer', color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = T.primary; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = T.primaryBg; e.currentTarget.style.color = T.primary; }}>
              {T.name === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textSub }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, backgroundColor: ACCENT, borderRadius: '50%' }} />
            </button>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Student'}`} alt="avatar"
              style={{ width: 34, height: 34, borderRadius: '50%', border: `2px solid ${T.border}`, backgroundColor: T.primaryBg, cursor: 'pointer' }} />
          </div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', padding: 32, backgroundColor: T.bg }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
