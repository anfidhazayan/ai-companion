/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eeebff',
          100: '#e0dbff',
          200: '#c5baff',
          300: '#a190ff',
          400: '#795dff',
          500: '#6344f6', // Brand accent violet
          600: '#4e28e9',
          700: '#3e1ac9',
          800: '#3315a6',
          900: '#2b1386',
          950: '#150854',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
