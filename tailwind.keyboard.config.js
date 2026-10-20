/** Theme for sanskrit-keyboard.html (previously an inline config for the Tailwind CDN script). */
module.exports = {
  content: ['./sanskrit-keyboard.html'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        deva: ['Noto Sans Devanagari', 'sans-serif'],
      },
      colors: {
        appBg: 'var(--app-bg)',
        panelBg: 'var(--panel-bg)',
        keyBg: 'var(--key-bg)',
        keyBgPress: 'var(--key-bg-press)',
        keySpecial: 'var(--key-special)',
        keySpecialPress: 'var(--key-special-press)',
        borderMain: 'var(--border-main)',
        textMain: 'var(--text-main)',
        textMuted: 'var(--text-muted)',
        accent: 'rgb(79 70 229 / <alpha-value>)', // fills, with white text
        accentInk: 'var(--accent-ink)', // accent as text
      },
      boxShadow: {
        key: '0 1px 1px 0 rgba(0,0,0,0.15)',
        'key-press': '0 0 0 0 rgba(0,0,0,0)',
      },
    },
  },
};
