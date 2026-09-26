/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D473BF',
          light: '#F0D6E8',
          pale: '#FBF3F8',
          dark: '#9E4C8C',
        },
        ink: {
          DEFAULT: '#221B26',
          soft: '#5B5364',
        },
        plum: '#5C3A52',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
