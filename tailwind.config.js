import { CONTENT_SLOTS, slotClassName, slotCssVar } from './src/lib/fontRegistry.ts';

// One `font-<content>` utility per content slot (e.g. `font-hero-name`), each
// reading a CSS variable that Sanity → Theme Settings controls at runtime.
const contentFonts = Object.fromEntries(
  CONTENT_SLOTS.map((slot) => [slotClassName(slot.key), `var(${slotCssVar(slot.key)})`])
);

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
        accent: 'var(--accent)',
        'accent-strong': 'var(--accent-strong)',
        'accent-text': 'var(--accent-text)',
        'accent-line': 'var(--accent-line)',
        'on-accent': 'var(--on-accent)',
      },
      // Base roles (fallbacks for any content left on "Default") plus the
      // per-content utilities generated above.
      fontFamily: {
        sans: 'var(--font-body)',
        body: 'var(--font-body)',
        heading: 'var(--font-heading)',
        display: 'var(--font-display)',
        script: 'var(--font-script)',
        ...contentFonts,
      },
      maxWidth: {
        page: '2560px',
      },
    },
  },
  plugins: [],
};
