/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors :{
        "primary-blue": "#1B374C",
        "secondary-blue": "#0C5C97"
      }
    },
  },
  plugins: [],
}