/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        theme: {
          canvas: 'var(--color-bg-canvas)',
          surface: 'var(--color-bg-surface)',
          'surface-card': 'var(--color-bg-surface-card)',
          border: 'var(--color-border)',
          'border-highlight': 'var(--color-border-highlight)',
          text: 'var(--color-text-main)',
          'text-muted': 'var(--color-text-muted)',
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          'primary-light': 'var(--color-primary-light)',
          accent: 'var(--color-accent)',
          gold: 'var(--color-gold)',
          peach: 'var(--color-peach)',
        },
        // Direct spring palette tokens
        spring: {
          dew: '#F6F9F5',
          sprout: '#6EE7B7',
          emerald: '#10B981',
          deep: '#059669',
          celadon: '#0D9488',
          gold: '#F59E0B',
          peach: '#F472B6',
          ink: '#0F172A',
        },
      },
      fontFamily: {
        serif: [
          '"Songti SC"',
          '"Source Han Serif SC"',
          '"Noto Serif CJK SC"',
          'STSong',
          'SimSun',
          'serif',
        ],
        sans: [
          '"PingFang SC"',
          '"Noto Sans CJK SC"',
          '"Microsoft YaHei"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        'jade-glow': '0 0 25px -5px var(--glow-primary)',
        'gold-glow': '0 0 25px -5px var(--glow-gold)',
        'card-soft': '0 10px 30px -10px var(--shadow-ambient)',
      },
    },
  },
  plugins: [],
};
