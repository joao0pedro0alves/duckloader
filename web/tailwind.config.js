/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', 'src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: "'Inter', sans-serif",
      },

      colors: {
        gray: {
          100: '#FBFAFF',
          200: '#9892A6',
          700: '#746E82',
          800: '#857E95',
          900: '#575361',
        },
        green: {
          200: '#DAF2D9',
          500: '#73B172',
          700: '#4E884D',
        },
        purple: {
          100: '#F3F0FF',
          200: '#E9E3F8',
          300: '#C1B2FA',
          400: '#AC96E4',
          500: '#794FED',
          600: '#7A5FEC',
          700: '#7C3AED',
        },
        red: {
          200: '#F2D9D9',
          500: '#E36363',
        },
        yellow: {
          300: '#E3E3ED',
        },
      },

      backgroundImage: {
        progress:
          'linear-gradient(90deg, rgba(58, 97, 237, 0.52) 0%, #7C3AED 100%)',
      },

      boxShadow: {
        fileShadow: '0px 4px 16px #EAE2FD',
      },
    },
  },
  plugins: [],
}
