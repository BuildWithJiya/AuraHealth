/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        script: ['"Caveat"', 'cursive'],
      },
      colors: {
        brand: {
          sage: '#526E5B',
          sageDark: '#415848',
          sageLight: '#EEF4EC',
          sageMist: '#F2F6F0',
          eucalyptus: '#8FA98F',
          rose: '#C97A72',
          roseDark: '#B4645C',
          roseLight: '#FDF2F0',
          roseMuted: '#F8DDD8',
          cream: '#FAF7F2',
          ivory: '#FFFDF9',
          warmSand: '#E8DFD8',
          honey: '#D4A373',
          charcoal: '#2E2825',
          stone: '#5C5552',
          stoneLight: '#8A817C',
        },
        aura: {
          bg: '#FAF7F2',
          rose: '#C97A72',
          indigo: '#526E5B',
          emerald: '#62846B',
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
