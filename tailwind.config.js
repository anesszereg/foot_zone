/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['"Barlow Condensed"', 'Inter', 'sans-serif'],
      },
      colors: {
        'fz': {
          green: '#00C853',
          neon: '#69FF47',
          dark: '#0A0A0A',
          red: '#FF1744',
          gold: '#FFD600',
          gray: '#1A1A1A',
        }
      },
      borderRadius: {
        'card': '12px',
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
}

