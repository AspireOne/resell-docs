/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js'
  ],
  plugins: [
      require("daisyui")
  ],
  daisyui: {
    styled: true,
    themes: false,
    darkTheme: "light",
  },
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('/a_1.jpg')",
      },
    }
  },
}
