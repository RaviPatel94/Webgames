/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        lightgrey:"#c0c0c0",
        navyblue:"#1b1b32"
      },
      fontFamily:{
        Handjet:["Handjet"]
      }
    },
  },
  plugins: [],
}

