/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.jsx"],
  theme: {
    extend: {
      keyframes: {
        open: {
          "0%": { transform: "translateY(-20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        close: {
          "0%": { transform: "translateY(0)", opacity: 1 },
          "100%": {
            transform: "translateY(-20px)",
            opacity: 0,
          },
        },
      },
      animation: {
        open: "open 0.3s ease-in-out",
        close: "close 0.3s ease-in-out",
      },
      colors: {
        "wh-bg": "#0c1317",
        "wh-user": "#182229",
        "wh-dark-gray": "#202c33",
        "wh-selected": "#2a3942",
        "wh-my-message": "#005c4b",
      },
    },
  },
  plugins: [],
};
