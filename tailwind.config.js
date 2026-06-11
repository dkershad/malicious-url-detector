/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          50: '#f0fdf9',
          100: '#ccfbee',
          200: '#99f5dc',
          300: '#5de8c3',
          400: '#27d3a5',
          500: '#0db88c',
          600: '#079470',
          700: '#09775c',
          800: '#0b5f4b',
          900: '#0b4e3e',
          950: '#032d24',
        },
        threat: {
          low: '#22c55e',
          medium: '#f59e0b',
          high: '#ef4444',
          critical: '#dc2626',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'scan-line': 'scanLine 2s linear infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glitch': 'glitch 0.5s ease-in-out',
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
        }
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(13,184,140,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(13,184,140,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      }
    },
  },
  plugins: [],
}
