/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./main_pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        edu: ["'Edu VIC WA NT Beginner'", "cursive"],
        poppins: ["'Poppins'", "sans-serif"],
        sans: 'var(--bs-body-font-family)'

      },
    },
  },
  plugins: [],
};
