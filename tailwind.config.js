/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neonCyan: '#00F9FF',
        neonPink: '#FF007A',
        neonMagenta: '#FF00FF',
        bgNight: '#0d0d13',
        bgDark: '#15151e',
      },
      fontFamily: {
        orbitron: ['"Orbitron"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 6px #00F9FF, 0 0 12px #00F9FF88',
        neonPink: '0 0 6px #FF007A, 0 0 12px #FF007A88',
      },
      dropShadow: {
        neonPink: '0 0 6px #FF007A',
      },
    },
  },
  plugins: [],
};