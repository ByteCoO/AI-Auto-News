/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          DEFAULT: '#4B6BFB',
          dark: '#3A57E8',
        },
        secondary: {
          50: '#F6F6F7',
          100: '#E8E8EA',
          200: '#DCDDDF',
          300: '#BABABF',
          400: '#97989F',
          500: '#696A75',
          600: '#3B3C4A',
          700: '#242535',
          800: '#181A2A',
          900: '#141624',
        }
      }
    },
  },
  plugins: [
   
    require('tailwind-scrollbar')({ nocompatible: true })
  ],
}