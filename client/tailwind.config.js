/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["Dancing Script", "cursive"],
      },
      colors: {
        maroon: "#800000",
        darkBrown: "#5A3E36",
        lightBeige: "#F5F5DC",
        gold: "#FFD700",
      },
    },
  },
  plugins: [],
};
