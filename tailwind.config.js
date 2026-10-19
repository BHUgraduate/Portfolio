/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  darkMode: 'media', // follows the device's day/night setting, as before
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Noto Sans Devanagari', 'ui-monospace', 'monospace'],
        deva: ['Noto Sans Devanagari', 'sans-serif'],
      },
      colors: {
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        surface2: 'rgb(var(--surface2-rgb) / <alpha-value>)',
        border: 'rgb(var(--border-rgb) / <alpha-value>)',
        textmain: 'rgb(var(--text-main-rgb) / <alpha-value>)',
        textmuted: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
        cardbg: 'var(--card-bg)',
        accent: '#6366F1',
        teal: '#2DD4BF',
        // text-safe variants (meet 4.5:1 on both themes)
        'accent-ink': 'var(--accent-ink)',
        'teal-ink': 'var(--teal-ink)',
        'amber-ink': 'var(--amber-ink)',
        'orange-ink': 'var(--orange-ink)',
        'green-ink': 'var(--green-ink)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 12s ease-in-out infinite reverse',
        'glow-pulse': 'glowPulse 3s infinite',
        'spin-slow': 'spin 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 0.9, transform: 'scale(1.05)' },
        },
      },
    },
  },
};
