/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        'sm': '700px',
        'md': '800px',
        'lg': '950px',
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
  ],
};
