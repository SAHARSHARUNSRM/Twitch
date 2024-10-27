/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customPurple: 'rgb(119, 44, 232)',
        navbargrey: 'rgb(24, 24, 27)',
        twitchbackgroundb:'rgb(14, 14, 16)',
      },
    },
  },
  plugins: [],
};
