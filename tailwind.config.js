/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        aura: {
          bg: '#0F172A',
          rose: '#F43F5E',
          indigo: '#6366F1',
          emerald: '#10B981',
        },
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(244,63,94,0.5)' },
          '100%': { boxShadow: '0 0 0 14px rgba(244,63,94,0)' },
        },
      },
      animation: {
        wave1: 'wave 1.1s ease-in-out infinite',
        wave2: 'wave 1.1s ease-in-out 0.15s infinite',
        wave3: 'wave 1.1s ease-in-out 0.3s infinite',
        wave4: 'wave 1.1s ease-in-out 0.45s infinite',
        wave5: 'wave 1.1s ease-in-out 0.6s infinite',
        pulseRing: 'pulseRing 1.4s ease-out infinite',
      },
    },
  },
  plugins: [],
}
