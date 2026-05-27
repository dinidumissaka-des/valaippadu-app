/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['var(--font-manrope)', 'sans-serif'],
        tamil:   ['var(--font-noto-tamil)', 'sans-serif'],
      },
      colors: {
        go:      { DEFAULT: '#16a34a', light: '#f0fdf4', border: '#bbf7d0' },
        caution: { DEFAULT: '#d97706', light: '#fffbeb', border: '#fde68a' },
        stop:    { DEFAULT: '#dc2626', light: '#fef2f2', border: '#fecaca' },
      },
    },
  },
  plugins: [],
};
