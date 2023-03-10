module.exports = {
  content: [
    // app content
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./stories/**/*.{js,ts,jsx,tsx}",
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
      },
    },
  },
  plugins: [],
}
