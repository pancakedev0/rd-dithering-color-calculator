/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        script: ['Pacifico'],
      },
      keyframes: {
        twirl: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(180deg)',
          },
        },
        rise: {
          '0%': {
            transform: 'translate(115px,-60px)',
            opacity: 1,
          },
          '100%': {
            transform: 'translate(115px,-80px)',
            opacity: 0,
          },
        },
      },
      animation: {
        twirl: 'twirl 200ms ease-out',
        rise: 'rise 500ms linear',
      },
    },
  },
  plugins: [],
};
