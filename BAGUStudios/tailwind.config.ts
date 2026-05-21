import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050608',
        panel: '#10131a',
        neon: {
          blue: '#38bdf8',
          violet: '#8b5cf6',
          green: '#34d399',
        },
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        neon: '0 0 30px rgba(56, 189, 248, 0.18)',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        pulseSoft: 'pulseSoft 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
