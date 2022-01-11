module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'tablet': {'max': '900px'},
      'phone':{'max':'540px'}
    },
    extend: {
      colors:{
        primary:'#FF6363',
        secondary:{
          100: '#E2E2D5',
          200:'#888883',
        }
      },
      fontFamily:{
        body:['Roboto'],
        family:['Rubik'],
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active']
    },
  },
  plugins: [],
}