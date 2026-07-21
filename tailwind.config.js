/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        line: 'var(--line)',
        muted: 'var(--muted)',
        'ink-2': 'var(--ink-2)',
        ink: 'var(--ink)',
        'ink-strong': 'var(--ink-strong)',
      },
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        display: ['Inter', 'sans-serif'], // Added modern display font
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
