/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0a0a',
          900: '#121212',
          800: '#1a1a1a',
          700: '#2a2a2a',
        },
        cinnabar: {
          DEFAULT: '#962828',
          dark: '#7a1f1f',
          light: '#b33b3b'
        },
        bronze: {
          DEFAULT: '#C5A059',
          light: '#D4B475',
          dark: '#9E7D41'
        }
      }
    }
  },
  plugins: [],
}