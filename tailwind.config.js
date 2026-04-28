/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',   // ← enables class-based dark mode (ThemeContext adds/removes 'dark' on <html>)
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#080e1f',
          card: '#0d1530',
          border: '#1a2545',
          sidebar: '#060b18',
          primary: '#1b6fde',
          'primary-light': '#112844',
          muted: '#0b1221',
          'muted-foreground': '#8b9dbf',
          success: '#29c36a',
          destructive: '#e74c3c',
          warning: '#f2c046',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
      }
    },
  },
  plugins: [],
}
