/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {}
    }
  },
  safelist: ["green", "red", "blue", "brown", "gray", "yellow"]
    .map((c) => [
      `bg-${c}-100`,
      `bg-${c}-200`,
      `bg-${c}-300`,
      `bg-${c}-500`,
      `border-${c}-500`,
      `text-${c}-700`,
      `text-${c}-600`,
      `text-${c}-500`,
      `text-${c}-300`,
      `text-${c}-100`,
      `to-${c}-100`,
      `to-${c}-300`,
      `from-${c}-100`,
      `from-${c}-300`,
    ])
    .reduce((a, b) => a.concat(b)),
  plugins: [require("tailwindcss-animate")],
}
