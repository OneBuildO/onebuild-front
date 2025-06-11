/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1.5rem",
        screens: {
          xl: "1280px",
        },
        maxWidth: {
          DEFAULT: "max-w-xl",
        },
      },
      transitionProperty: {
        height: "max-height",
      },

      colors:{
        primary: '#030303',
        secondary: '#E09448',

        warning: '#DE9500',
        danger: '#F04C42',
        branco: '#FFF',
        preto: '#000000',
        neutro: {
          50: "#F8F8F8",
          100: "#DFDFDF",
          200: "#C6C6C6",
          300: "#ADADAD",
          400: "#949494",
          500: "#7B7B7B",
          600: "#626262",
          700: "#494949",
          800: "#303030",
          900: "#171717",
        },
        sucesso: {
          50: "#E3EBE6",
          300: "#ABC9BA",
          500: "#73A78E",
          700: "#3B8562",
          900: "#036336",
        },
        alerta: {
          50: "#FFEAC4",
          300: "#FFCF70",
          500: "#FFAB00",
          700: "#C78500",
          900: "#8F5F00",
        },
        erro: {
          50: "#F4B2A8",
          300: "#EA7E70",
          500: "#E04A38",
          700: "#D61600",
          900: "#A61200",
        },
      },
      screens: {
        sm: { max: '699px' },
        md: { min: '700px', max: '889px' },
        lg: { min: '890px' }
      }
    },
  },
  plugins: [],
};