/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da3ff',
          DEFAULT: '#0066cc',
          dark: '#004c99',
        },
        secondary: {
          light: '#8c54ff',
          DEFAULT: '#6200ee',
          dark: '#4b00b5',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}