/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#171C26',
          light:   '#C96C38',
        },
        secondary: '#2D368E',
        surface: '#ffffff',
      },
      fontFamily: {
        myriad: ['MyriadPro', 'sans-serif'],
      },
    },
  },
  plugins: [],
}