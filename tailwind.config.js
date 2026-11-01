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
        tactical: {
          950: '#070a0d',
          900: '#0c1218',
          850: '#111922',
          800: '#16222e',
          700: '#233446',
          600: '#344b62',
          500: '#4e6d8d',
        },
        camo: {
          dark: '#1b231a',
          olive: '#4b5f38',
          sage: '#6f8b56',
          bright: '#98c379',
        },
        hud: {
          green: '#10b981',
          lime: '#84cc16',
          amber: '#f59e0b',
          red: '#ef4444',
          cyan: '#06b6d4',
          gold: '#eab308',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
};
