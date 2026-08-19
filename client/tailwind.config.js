/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#090d16',
        darkSurface: '#111827',
        darkCard: 'rgba(17, 24, 39, 0.7)',
        accentBlue: '#3b82f6',
        accentEmerald: '#10b981',
        accentPurple: '#8b5cf6',
        accentAmber: '#f59e0b',
        accentPink: '#ec4899',
        accentCyan: '#06b6d4',
        accentIndigo: '#6366f1'
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
