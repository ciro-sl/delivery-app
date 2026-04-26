/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'vinotinto': '#b60000',
        'vinotinto-claro': '#2d0a0a',
        'gris-oscuro': '#1e1e1e',
        'naranja': '#FF7F11',
        'amarillo': '#D97D2F',
        'verde': '#2F8A5E',
        'texto': '#f5f5f5',
        'texto-muted': '#c0c0c0',
        'negro': '#0a0a0a',
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
      },
      animationDelay: {
        '500': '500ms',
        '400': '400ms',
        '300': '300ms',
        '200': '200ms',
        '100': '100ms',
        '50': '50ms',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
}