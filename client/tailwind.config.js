/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets:[require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'primary': '#F7EFE7',
        'secondary': '#EA5E41',
        'accent': '#FFDACB'
      },
      fontFamily:{
        galindo:['Galindo_400Regular'],
        montserrat400:[
          'Montserrat_400Regular'
        ],
        montserrat700:[
          'Montserrat_700Bold'
        ],
        montserrat900:[
          'Montserrat_900Black'
        ],
        gaegu: ['Gaegu_700Bold'],
      }
    },
  },
  plugins: [],
}

