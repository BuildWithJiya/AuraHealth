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
        aura: {
          blush: '#FCE7E8',
          rose: '#D96B85',
          'sage-light': '#E8EFE3',
          'sage-dark': '#405A43',
          cream: '#F8F0E8',
          lavender: '#E8DDF0',
          gold: '#D9A84E',
          plum: '#6A3D55',
          // Backwards compatibility mappings:
          bg: '#F8F0E8',
          indigo: '#405A43',
          emerald: '#405A43',
        },
        brand: {
          blush: '#FCE7E8',
          rose: '#D96B85',
          roseDark: '#B8526B',
          sageLight: '#E8EFE3',
          sageDark: '#405A43',
          cream: '#F8F0E8',
          lavender: '#E8DDF0',
          gold: '#D9A84E',
          plum: '#6A3D55',
          charcoal: '#31232B',
          stone: '#5E5259',
          stoneLight: '#8C8087',
        },
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(217,107,133,0.5)' },
          '100%': { boxShadow: '0 0 0 14px rgba(217,107,133,0)' },
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
