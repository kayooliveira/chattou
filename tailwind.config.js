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
            secondary: "#EDDBFF",
            background: "#161616",
            light: "#C8C8C8",
            text: "#FFFFFF"
        },
      },
      fontFamily: {
        brand: 'Comfortaa, Arial, Helvetica, sans-serif'
      }
    },
  },
  plugins: [],
}
