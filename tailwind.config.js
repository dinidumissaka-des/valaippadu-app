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
        // Airbnb-inspired palette
        rausch:  '#FF385C',   // Airbnb coral
        dark:    '#222222',
        medium:  '#484848',
        muted:   '#717171',
        faint:   '#B0B0B0',
        divider: '#EEEEEE',
        surface: '#FFFFFF',
        bg:      '#F7F7F7',
        // Zone colors
        go:      { DEFAULT: '#008A05', light: '#EDFFF0', border: '#B8ECC0' },
        caution: { DEFAULT: '#C47D00', light: '#FFF9EC', border: '#F5DFA0' },
        stop:    { DEFAULT: '#C13515', light: '#FFF1EE', border: '#F5C4B8' },
      },
      borderRadius: {
        airbnb: '12px',
        pill:   '9999px',
      },
      boxShadow: {
        airbnb:       '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
        'airbnb-md':  '0 2px 4px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.08)',
        'airbnb-hover': '0 2px 4px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
};
