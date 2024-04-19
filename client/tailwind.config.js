/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['"Roboto"', "sans-serif"],
        "lexend-deca": ['"Lexend Deca"', "sans-serif"],
      },
      colors: {
        bgColor: "#202329",
        darkBgColor: "#131313",
        fontWhiteDarkBgColor: "#DADADA",
        borderColor: "#2E343D",
        fontBgColor: "#7C7D84",
        purple: "#6B8AFD",
      },
    },
  },
};
