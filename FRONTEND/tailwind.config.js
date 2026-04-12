import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand — Power BI yellow como acento
        brand: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          400: '#F2C811',
          500: '#EAB308',
          600: '#CA8A04',
        },
        // Surface — escala neutra estilo Linear/Vercel
        surface: {
          0:   '#FFFFFF',
          50:  '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        },
        // Accent — Tech blue para credibilidad tecnológica
        accent: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        // Semánticos
        success: { light: '#DCFCE7', DEFAULT: '#16A34A', dark: '#15803D' },
        error:   { light: '#FEE2E2', DEFAULT: '#DC2626', dark: '#B91C1C' },
        warning: { light: '#FEF9C3', DEFAULT: '#CA8A04', dark: '#A16207' },
        info:    { light: '#DBEAFE', DEFAULT: '#2563EB', dark: '#1D4ED8' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'xs':         '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'card':       '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'elevated':   '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'focus':      '0 0 0 3px rgb(242 200 17 / 0.35)',
        'glow-brand': '0 0 0 3px rgba(242,200,17,0.3), 0 0 20px rgba(242,200,17,0.15)',
        'glow-accent':'0 0 0 3px rgba(59,130,246,0.3), 0 0 20px rgba(59,130,246,0.12)',
        'premium':    '0 8px 32px -4px rgba(0,0,0,0.18), 0 2px 8px -2px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-in':      'fadeIn 0.2s ease-out',
        'slide-up':     'slideUp 0.25s ease-out',
        'pulse-slow':   'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':      'shimmer 2.5s linear infinite',
        'slide-in-left':'slideInLeft 0.22s ease-out',
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
        'scale-in':     'scaleIn 0.2s ease-out',
        'stagger-1':    'slideUp 0.3s ease-out 0.05s both',
        'stagger-2':    'slideUp 0.3s ease-out 0.1s both',
        'stagger-3':    'slideUp 0.3s ease-out 0.15s both',
        'stagger-4':    'slideUp 0.3s ease-out 0.2s both',
        'stagger-5':    'slideUp 0.3s ease-out 0.25s both',
        'stagger-6':    'slideUp 0.3s ease-out 0.3s both',
      },
      keyframes: {
        fadeIn:      { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:     { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        slideInLeft: { from: { opacity: 0, transform: 'translateX(-8px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        glowPulse:   { '0%, 100%': { boxShadow: '0 0 0 0 rgba(242,200,17,0)' }, '50%': { boxShadow: '0 0 0 4px rgba(242,200,17,0.25)' } },
        scaleIn:     { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [animate],
};
