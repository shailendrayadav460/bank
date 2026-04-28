import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Unauthorized = () => {
  const { theme: T } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: T.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        {/* Icon */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 96, height: 96, borderRadius: 24, marginBottom: 32,
          backgroundColor: T.name === 'dark' ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.08)',
          position: 'relative',
        }}>
          <ShieldAlert size={48} style={{ color: '#f59e0b' }} />
        </div>

        {/* 403 */}
        <div style={{ fontSize: 96, fontWeight: 900, color: T.text, lineHeight: 1, marginBottom: 12, letterSpacing: '-2px' }}>
          403
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 12 }}>
          Access Restricted
        </h2>

        <p style={{ fontSize: 15, color: T.textSub, marginBottom: 40, lineHeight: 1.7 }}>
          You don&apos;t have the required permissions to view this section. Please contact an administrator if you believe this is an error.
        </p>

        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '14px 28px',
          backgroundColor: '#f59e0b',
          color: '#fff',
          fontWeight: 700,
          fontSize: 15,
          borderRadius: 12,
          textDecoration: 'none',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Home size={18} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
