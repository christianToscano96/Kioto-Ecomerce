/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Earthbound Curator Color Palette
        // Crema - warm cream/neutral
        crema: {
          50: '#fdfcf9',
          100: '#faf5ed',
          200: '#f2e8d9',
          300: '#e8d5ba',
          400: '#dbc197',
          500: '#c9a973',
          600: '#b48d54',
          700: '#967145',
          800: '#644f34',
          900: '#423221',
        },
        // Arena - sandy beige
        arena: {
          50: '#faf8f5',
          100: '#f2ede4',
          200: '#e4d9c8',
          300: '#d1bdaa',
          400: '#bba185',
          500: '#a38666',
          600: '#876c4b',
          700: '#675137',
          800: '#443624',
          900: '#281f15',
        },
        // Chocolate - rich brown
        chocolate: {
          50: '#faf5f2',
          100: '#f0e5e0',
          200: '#dbc4bb',
          300: '#c2a294',
          400: '#a67f6c',
          500: '#885f4a',
          600: '#684532',
          700: '#4c3120',
          800: '#2f1d13',
          900: '#1a100a',
        },
        // Terracota - earthy clay
        terracota: {
          50: '#fff8f5',
          100: '#ffeee8',
          200: '#ffd9cc',
          300: '#ffb899',
          400: '#ff8f66',
          500: '#ff6633',
          600: '#cc5229',
          700: '#993d1f',
          800: '#662914',
          900: '#33140a',
        },
        // Verde Bosque - forest green
        'verde-bosque': {
          50: '#f0f5f0',
          100: '#d9e8d9',
          200: '#b3ceb3',
          300: '#8bb08b',
          400: '#628d62',
          500: '#427042',
          600: '#335733',
          700: '#243d24',
          800: '#162416',
          900: '#0b120b',
        },
      },
      fontFamily: {
        // Noto Serif for headlines (serif)
        serif: ['Noto Serif', 'Georgia', 'serif'],
        // Manrope for body (sans)
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}