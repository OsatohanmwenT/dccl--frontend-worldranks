/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "white": "#D2D5DA",
        "grey": "#6C727F",
        "blue": "#4E80EE",
        "dark-grey": "#282B30",
        "very-dark-grey": "#1B1D1F"
      },
    },
  },
  plugins: [],
}