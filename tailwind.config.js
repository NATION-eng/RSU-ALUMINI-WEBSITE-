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
          950: '#051A0F',
          900: '#092B19',
          850: '#0E3B23',
          800: '#134D2E',
          700: '#1B6B40',
          600: '#268E56',
          500: '#34B36F',
        },
        jubilee: {
          gold: '#D4AF37',
          lightgold: '#F4E3A8',
          darkgold: '#A07C18',
          cream: '#FAF7EE',
          warmcream: '#F4EFEA',
          sage: '#E3EBE4',
          mints: '#34D399',
          leaf: '#10B981',
          darkgreen: '#072013',
        }
      },
      fontFamily: {
        retro: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cinzel Decorative"', '"Cinzel"', 'serif'],
        serif: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 45px -10px rgba(5, 26, 15, 0.4), 0 0 25px rgba(212, 175, 55, 0.12)',
        'gold-glow': '0 0 35px rgba(212, 175, 55, 0.25)',
      },
      animation: {
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
