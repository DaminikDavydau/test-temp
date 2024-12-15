module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  mode: "jit",
  theme: {
    extend: {
      colors: {
        notification: {
          DEFAULT: "#ff0000",
          green: "#19d813"
        },
        BGgreen: {
          DEFAULT: "#79D0AB"
        },
        BGdark: {
          DEFAULT: "#2D333E",
          lighter: "#373F41"
        },
        BGgray: {
          DEFAULT: "#8D8D8",
          dark: "#8E9293",
          darker: "#575D68",
          light: "#A49B9B"
        },
        BGtext: {
          DEFAULT: "#545A5B",
          gray: "#C3CBCD"
        },
        BGlight: {
          DEFAULT: "#F2F7FA",
          white: "#FFFFFF"
        },
        BGdark_lightblue: {
          DEFAULT: "#002A3A",
          lighter: "#003B5C"
        },
        BG_blue: {
          DEFAULT: "#B9D9EB",
          greener: "#B8DDE1"
        },
        tpBg: {
          DEFAULT: "rgba(0, 0, 0, 0.4)"
        },
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}