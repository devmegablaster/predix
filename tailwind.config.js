/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        'sm': '700px',
        'md': '800px',
        'lg': '1000px',
        'xl': '1250px'
      },
      width: {
        '65p': '65%',
        '35p': '35%',
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
  ],
};
