/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    fontFamily: {
      'serif': ['baskerville'],
      'mono': ['pt-mono']
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
        'nn-backdrop-light': '#FBF2E8',
        'nn-backdrop-dark': '#130B07',
        'nn-light': '#F5E1C9',
        'nn-dark': '#1F130C',
        'nn-primary-light': '#DE970B',
        'nn-primary-dark': '#F0B557',
        'nn-secondary-light': '#FBF2E8',
        'nn-secondary-dark': '#382418'
      },
      fontFamily: {
        title: ["baskerville", "serif"],
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
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar'),
    require('@tailwindcss/typography')
  ],
}