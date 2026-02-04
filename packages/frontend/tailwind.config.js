/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OpenClaw-inspired color palette
        claw: {
          bg: '#0a0b0d',
          surface: '#12141a',
          card: '#1a1d24',
          border: '#2a2e38',
        },
        accent: {
          primary: '#10b981',    // Emerald green
          secondary: '#06b6d4',  // Cyan
          tertiary: '#8b5cf6',   // Violet
          warning: '#f59e0b',    // Amber
          danger: '#ef4444',     // Red
          muted: '#6b7280',      // Gray
        },
        // Legacy cyber colors (for compatibility)
        cyber: {
          black: '#0a0b0d',
          dark: '#12141a',
          green: '#10b981',
          blue: '#06b6d4',
          pink: '#ec4899',
          yellow: '#f59e0b',
          red: '#ef4444',
          purple: '#8b5cf6',
          orange: '#f97316',
          grid: 'rgba(16, 185, 129, 0.05)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glow-green': 'radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
        'glow-cyan': 'radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(16, 185, 129, 0.2)',
        'glow-md': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-lg': '0 0 30px rgba(16, 185, 129, 0.4)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}
