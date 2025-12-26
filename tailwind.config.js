/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        minecraft: {
          green: '#5B7C3A',
          dark: '#2D2D2D',
          stone: '#8C8C8C',
          diamond: '#38BDF8',
          redstone: '#FF5555',
          emerald: '#00D26A',
        }
      },
      fontFamily: {
        'minecraft': ['"Press Start 2P"', 'cursive'],
        'arabic': ['"Noto Sans Arabic"', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'block-rotate': 'block-rotate 20s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #5B7C3A' },
          '50%': { boxShadow: '0 0 20px #5B7C3A, 0 0 30px #5B7C3A' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'block-rotate': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
