/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    typography: ({ theme }) => ({
      DEFAULT: {
        css: {
          color: theme("var(--nn-typography)"),
        },
      },
    }),
    fontFamily: {
      sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
      serif: ["adobe", ...defaultTheme.fontFamily.serif],
      mono: ["PT Mono", ...defaultTheme.fontFamily.mono],
      display: ["Libre Baskerville", ...defaultTheme.fontFamily.serif],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "nn-base": {
          light: "#f5e1c9",
          dark: "#20130d",
        },
        "nn-secondary": {
          light: "#ecc790",
          dark: "#382419",
        },
        "nn-accent": {
          light: "#382419",
          dark: "#f0b557",
        },
        "nn-gold": {
          light: "de970b",
          dark: "de970b",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwind-scrollbar"),
    require("@tailwindcss/typography"),
  ],
};
