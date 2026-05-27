/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans:     ['Manrope_400Regular'],
        medium:   ['Manrope_500Medium'],
        semibold: ['Manrope_600SemiBold'],
        bold:     ['Manrope_700Bold'],
        extrabold:['Manrope_800ExtraBold'],
        tamil:    ['NotoSansTamil_400Regular'],
      },
      colors: {
        bg:           '#f8fafc',
        surface:      '#ffffff',
        border:       '#e2e8f0',
        go:           '#16a34a',
        'go-bg':      '#f0fdf4',
        caution:      '#d97706',
        'caution-bg': '#fffbeb',
        stop:         '#dc2626',
        'stop-bg':    '#fef2f2',
      },
    },
  },
  plugins: [],
};
