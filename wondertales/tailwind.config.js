/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#05B6D3",
        secondary: "#EF863E"
      },
      backgroundImage:{
        'login-bg-img':"url(./src/assets/image/)",
        'signup-bg-img':"url(./src/assets/image/)"
      }
    },
  },
  plugins: [],
}