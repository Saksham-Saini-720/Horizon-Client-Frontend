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
          light:   '#2D368E',
        },
        secondary: '#C96C38',
        surface: '#F7F6F2',
      },
      fontFamily: {
        myriad: ['MyriadPro', 'sans-serif'],
      },
    },
  },
  plugins: [],
}