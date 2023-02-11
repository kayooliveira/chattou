module.exports = {
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx,vue,html}'],
  theme: {
    extend: {
      backgroundImage: {
        home: 'url(/src/assets/img/bg-home.png)'
      },
      colors: {
        app: { // App colors
            primary: "#7C01F6",
            primaryDark: "#AC5BFD",
            secondary: "#EDDBFF",
            background: "#161616",
            backgroundLight: '#1f1f1f',
            light: "#C8C8C8",
            text: "#FFFFFF"
        },
      },
      fontFamily: {
        brand: 'Nunito, Arial, Helvetica, sans-serif'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible:true })
  ],
}
