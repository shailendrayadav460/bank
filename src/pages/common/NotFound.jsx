import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const NotFound = () => {
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
          backgroundColor: T.name === 'dark' ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)',
        }}>
          <SearchX size={48} style={{ color: T.danger }} />
        </div>

        {/* 404 */}
        <div style={{ fontSize: 96, fontWeight: 900, color: T.text, lineHeight: 1, marginBottom: 12, letterSpacing: '-2px' }}>
          404
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 12 }}>
          Page Not Found
        </h2>

        <p style={{ fontSize: 15, color: T.textSub, marginBottom: 40, lineHeight: 1.7 }}>
          We couldn&apos;t find the page you&apos;re looking for. It may have been moved, deleted, or never existed.
        </p>

        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '14px 28px',
          backgroundColor: T.primary,
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

export default NotFound;
