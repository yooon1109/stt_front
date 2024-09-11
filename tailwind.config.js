// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#c084fc", // Tailwind의 주 색상
        secondary: "#a855f7", // Tailwind의 보조 색상
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
