/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefbff',
          100: '#d8f5ff',
          200: '#baedff',
          300: '#8ae3ff',
          400: '#52d0ff',
          500: '#2ab4ff',
          600: '#0e94ff',
          700: '#0a7beb',
          800: '#1062be',
          900: '#145495',
          950: '#11335a',
        },
        accent: {
          400: '#00f0ff',
          500: '#00d4e0',
          600: '#00a8b4',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e2e3e5',
          200: '#c4c5cb',
          300: '#9fa1a9',
          400: '#7b7d87',
          500: '#60626d',
          600: '#4c4e57',
          700: '#3f4047',
          800: '#2a2b30',
          850: '#1e1f23',
          900: '#18191d',
          950: '#0d0e10',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-flow': 'borderFlow 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.3)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
    },
  },
  plugins: [],
};
