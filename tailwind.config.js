/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      colors: {
        ivory: {
          DEFAULT: '#FBF7F0',
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#FBF7F0',
          300: '#F5EFEB',
          400: '#EDE2D7',
          500: '#E2D4C5',
        },
        ink: {
          DEFAULT: '#2B2118',
          900: '#1D1610',
          800: '#2B2118',
          700: '#433426',
          600: '#5C4A3A',
          500: '#756150',
          400: '#94806F',
          300: '#BAA99B',
        },
        terracotta: {
          DEFAULT: '#C05621',
          50: '#FBF2EC',
          100: '#F7E2D5',
          200: '#ECC3AA',
          300: '#E0A37E',
          400: '#D37F50',
          500: '#C05621',
          600: '#A84517',
          700: '#8A3410',
        },
        marigold: {
          DEFAULT: '#E9B44C',
          50: '#FDF9F0',
          100: '#FAF1DC',
          200: '#F5E2B6',
          300: '#EFCF8D',
          400: '#E9B44C',
          500: '#D89E30',
          600: '#B8801F',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      aspectRatio: {
        '4/5': '4 / 5',
      },
    },
  },
  plugins: [],
}
