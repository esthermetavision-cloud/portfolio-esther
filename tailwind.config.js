/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#060608',
        tomb: '#0f0f13',
        slateBorder: '#272733',
        crimson: {
          DEFAULT: '#9e0d1d',
          light: '#dc2626',
          dark: '#580811',
          blood: '#73030f',
        },
        parchment: '#e5ded1',
        parchmentDim: '#9e9689',
      },
      fontFamily: {
        gothic: ['UnifrakturMaguntia', 'cursive'],
        serifClassic: ['Cinzel', 'serif'],
        monoTech: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        crimsonGlow: '0 0 25px -5px rgba(158, 13, 29, 0.45)',
        crimsonInset: 'inset 0 0 15px rgba(115, 3, 15, 0.5)',
        dossier: '0 10px 30px -10px rgba(0,0,0,0.8), 0 0 1px 1px rgba(158, 13, 29, 0.3)',
      },
    },
  },
  plugins: [],
};
