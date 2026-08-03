/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: 'rgb(0,140,169)',
          teal: 'rgb(24,72,82)',
          red:  'rgb(236,51,56)',
        },
        surface:          '#FFFFFF',
        'surface-muted':  '#F1F5F9',
        border:           '#E2E8F0',
        ink:              '#0F172A',
        'ink-secondary':  '#475569',
        'ink-muted':      '#94A3B8',
        background:       '#F8FAFC',
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        grotesk: ['"Cabinet Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        blink: {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
