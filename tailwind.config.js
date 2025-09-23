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
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        dark: {
          bg: '#18181b', // background
          surface: '#23232a', // card/surface
          text: '#f4f4f5', // main text
          muted: '#a1a1aa', // muted text
          accent: '#6366f1', // accent color
        }
      }
    },
  },
  plugins: [],
}
