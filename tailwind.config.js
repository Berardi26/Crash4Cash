/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'crash': "url('/assets/images/bg/bg.jpg')",
      },
      colors: {
        'primary': {
          DEFAULT: '#8A0000',
          '50': '#FFCDC3',
          '100': '#FF907F',
          '200': '#A3140D',
          '300': '#A10F09',
          '400': '#850000',
          '500': '#710000',
          '600': '#5E0000',
          '700': '#4B0000',
          '800': '#380000',
          '900': '#250000',
          '950': '#120000',
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animation-delay"),
  ],
}

