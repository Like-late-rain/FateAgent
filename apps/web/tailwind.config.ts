import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif']
      },
      colors: {
        ink: '#0f172a',
        aurora: '#ff8a65',
        tide: '#0ea5e9',
        dusk: '#f4f1eb'
      },
      boxShadow: {
        glow: '0 10px 40px rgba(14, 165, 233, 0.25)'
      }
    }
  },
  plugins: []
};

export default config;
