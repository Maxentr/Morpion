module.exports = {
  content: [
    // app content
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    // include packages if not transpiling
    "../../packages/ui-web/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {},
  plugins: [],
};
