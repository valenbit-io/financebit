/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 👇 AGREGA ESTA SECCIÓN DE KEYFRAMES Y ANIMATION
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' }, // Empieza fuera a la derecha
          '100%': { transform: 'translateX(-100%)' }, // Termina fuera a la izquierda
        }
      }
      // 👆 HASTA AQUÍ
    },
  },
  plugins: [],
}