/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#062013',
          900: '#0b3520',
          850: '#0e4228',
          800: '#114f31',
          700: '#196f45',
          600: '#238f5a',
          500: '#2ea76b',
        },
        jubilee: {
          gold: '#D4AF37',
          lightgold: '#F3E5AB',
          darkgold: '#AA820A',
          cream: '#FAF7EE',
          warmcream: '#F4EFEA',
          sage: '#E3EBE4',
          mints: '#34D399',
          leaf: '#10B981',
          darkgreen: '#0A2E1C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['Cinzel', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'noise-pattern': "radial-gradient(rgba(212, 175, 55, 0.15) 1px, transparent 0)",
      }
    },
  },
  plugins: [],
}
