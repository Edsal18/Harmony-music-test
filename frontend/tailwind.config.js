/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        harmony: {
          navy: '#102E40',
          slate: '#025373',
          cyan: '#30DDF2',
          gray: '#C7D2D9',
          darkBg: '#0B1E2B',
          accentBlue: '#41D3F2',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
