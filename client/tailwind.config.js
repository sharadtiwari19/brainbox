/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef3f2',
          100: '#fde4e1',
          200: '#fbcdc8',
          300: '#f8a9a1',
          400: '#f27568',
          500: '#e84a3a',
          600: '#d42e1e',
          700: '#b22316',
          800: '#932116',
          900: '#7a2119',
        },
        ocean: {
          50: '#eff8ff',
          100: '#dbeefe',
          200: '#bfe2fd',
          300: '#93cffc',
          400: '#5fb4f8',
          500: '#3b97f3',
          600: '#2479e8',
          700: '#1c63d5',
          800: '#1d51ac',
          900: '#1d4688',
        },
        slate: {
          850: '#1a2332',
          950: '#0d1117',
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } }
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        'glow': '0 0 20px rgba(232,74,58,0.3)',
        'glow-blue': '0 0 20px rgba(59,151,243,0.3)',
      }
    }
  },
  plugins: []
}
