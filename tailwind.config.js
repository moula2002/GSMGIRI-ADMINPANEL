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
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        accent: {
          DEFAULT: '#06B6D4',
          hover: '#0891B2',
        },
        navy: {
          DEFAULT: '#0F172A',
        },
        slate: {
          ...require('tailwindcss/colors').slate,
          header: '#1E293B',
          search: '#334155',
          border: '#475569',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        bg: {
          main: '#F8FAFC',
          card: '#FFFFFF',
        },
        text: {
          dark: '#111827',
          light: '#64748B',
        },
        border: {
          DEFAULT: '#E2E8F0',
        }
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
        'pulse-primary': {
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
        'pulse-primary': 'pulse-primary 3s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },

      // ─── Box shadows ──────────────────────────────────────────────────────
      boxShadow: {
        'primary-sm': '0 2px 12px -2px rgba(37,99,235,0.25)',
        'primary-md': '0 4px 20px -2px rgba(37,99,235,0.30)',
        'primary-lg': '0 8px 32px -4px rgba(37,99,235,0.35)',
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
    // Dynamic classes
    'text-primary', 'bg-primary', 'border-primary',
    'hover:bg-primary', 'hover:border-primary',
  ],

  plugins: [],
}


