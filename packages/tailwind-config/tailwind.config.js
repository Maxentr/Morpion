module.exports = {
  darkMode: "class",
  content: [
    // app content
    "./**/**/*.{js,ts,jsx,tsx}",
    // include packages if not transpiling
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fffffe",
        secondary: "#f45d48",
        highlight: "#078080",
        tertiary: "#f8f5f2",
        customBlack: "#232323",
        dark: {
          black: "#16161a",
          gray: "#242629",
        },
      },
    },
  },
  plugins: [],
}
