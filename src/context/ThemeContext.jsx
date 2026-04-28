import { createContext, useContext, useState, useCallback, useEffect } from 'react';

/* ── Colour palettes ─────────────────────────────────────────── */
export const themes = {
  dark: {
    name: 'dark',
    bg:        '#080e1f',
    card:      '#0d1530',
    cardHover: '#111d3a',
    sidebar:   '#060b18',
    border:    '#1a2545',
    primary:   '#1b6fde',
    primaryBg: 'rgba(27,111,222,0.15)',
    text:      '#ffffff',
    textSub:   '#8b9dbf',
    success:   '#29c36a',
    danger:    '#e74c3c',
    warning:   '#f2c046',
    inputBg:   '#080e1f',
    shadow:    'none',
    activeNav: '#112844',
  },
  light: {
    name: 'light',
    bg:        '#eef2f6', // Slightly darker to contrast with white cards
    card:      '#ffffff',
    cardHover: '#f8fafc',
    sidebar:   '#ffffff',
    border:    '#d1d8e0', // Darker border for visibility
    primary:   '#1b6fde',
    primaryBg: 'rgba(27,111,222,0.1)',
    text:      '#0f172a',
    textSub:   '#64748b',
    success:   '#16a34a',
    danger:    '#dc2626',
    warning:   '#d97706',
    inputBg:   '#eef2f6',
    shadow:    '0 4px 14px rgba(0,0,0,0.05)',
    activeNav: 'rgba(27,111,222,0.08)',
  },
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.dark);

  useEffect(() => {
    // ── Sync Tailwind dark mode class ──────────────────────────────
    if (theme.name === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // ── CSS custom properties (for non-Tailwind inline-style components) ──
    document.documentElement.style.setProperty('--theme-body-bg',  theme.bg);
    document.documentElement.style.setProperty('--theme-body-text', theme.text);
    document.documentElement.style.setProperty('--theme-border',   theme.border);
    document.documentElement.style.setProperty('--theme-card',     theme.card);
    document.documentElement.style.setProperty('--theme-sidebar',  theme.sidebar);
    document.documentElement.style.setProperty('--theme-primary',  theme.primary);
    // Apply bg to body so no flash on un-covered areas
    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.text;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev.name === 'dark' ? themes.light : themes.dark));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};
