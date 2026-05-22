import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#020504',
        graphite: '#0a1110',
        reactor: '#16f2b3',
        plasma: '#33b7ff',
        ambercore: '#f8c14a',
        critical: '#ff4d65',
        magenta: '#e45dff',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
