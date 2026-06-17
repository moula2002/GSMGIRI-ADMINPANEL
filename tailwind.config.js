/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ─── Brand color tokens ───────────────────────────────────────────────
      colors: {
        yellow: {
          DEFAULT: '#eab308',
          light:   '#fef08a',
          deep:    '#ca8a04',
          hover:   '#ca8a04',
          muted:   '#854d0e',
        },
        gold: {
          DEFAULT: '#eab308',
          light:   '#fef08a',
          deep:    '#ca8a04',
          hover:   '#ca8a04',
          muted:   '#854d0e',
        },
        slate: {
          50:  '#000000',
          100: '#000000',
          200: '#0f172a',
          300: '#0f172a',
          350: '#0f172a',
          400: '#1e293b',
          500: '#1e293b',
          600: '#0f172a',
          700: '#e2e8f0',
          800: '#e2e8f0',
          850: '#e2e8f0',
          900: '#f8fafc',
          950: '#ffffff',
        },
      },

      // ─── Font family ──────────────────────────────────────────────────────
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },

      // ─── Keyframes ────────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-up': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },

      // ─── Animation utilities ──────────────────────────────────────────────
      animation: {
        'fade-in': 'fade-in 0.35s ease both',
        'scale-up': 'scale-up 0.28s cubic-bezier(0.22,1,0.36,1) both',
        'slide-in': 'slide-in 0.3s ease both',
        'pulse-gold': 'pulse-gold 3s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },

      // ─── Box shadows ──────────────────────────────────────────────────────
      boxShadow: {
        'gold-sm': '0 2px 12px -2px rgba(212,175,55,0.25)',
        'gold-md': '0 4px 20px -2px rgba(212,175,55,0.30)',
        'gold-lg': '0 8px 32px -4px rgba(212,175,55,0.35)',
        glass: '0 8px 32px rgba(0,0,0,0.48)',
      },

      // ─── Backdrop blur extras ─────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },
    },
  },

  // ─── Safelist: dynamic/interpolated class fragments ─────────────────────
  safelist: [
    // Status badge colours (built dynamically in OrdersManager)
    'bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/20',
    'bg-amber-500/10', 'text-amber-400', 'border-amber-500/20',
    'bg-red-500/10', 'text-red-400', 'border-red-500/20',
    // Gold dynamic classes
    'text-[#d4af37]', 'bg-[#d4af37]', 'border-[#d4af37]',
    'hover:bg-[#d4af37]', 'hover:border-[#d4af37]',
  ],

  plugins: [],
}


