/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg:      '#0a0f1e',
        surface: '#111827',
        border:  '#1e293b',
        go:      '#22c55e',
        caution: '#f59e0b',
        stop:    '#ef4444',
      },
      fontFamily: {
        mono:  ['IBMPlexMono_700Bold'],
        tamil: ['NotoSansTamil_400Regular'],
      },
    },
  },
  plugins: [],
};
