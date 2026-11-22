import plugin from 'tailwindcss/plugin.js';
import defaultTheme from 'tailwindcss/defaultTheme.js';
import { CONTENT_SLOTS, slotClassName, slotCssVar, slotScaleVar } from './src/lib/fontRegistry.ts';

// One `font-<content>` utility per content slot (e.g. `font-hero-name`), each
// reading a CSS variable that Sanity → Theme Settings controls at runtime.
const contentFonts = Object.fromEntries(
  CONTENT_SLOTS.map((slot) => [slotClassName(slot.key), `var(${slotCssVar(slot.key)})`])
);

/**
 * Text size. `--ts` is a unitless multiplier that every font-size below is
 * multiplied by. A `font-<content>` class sets it from that content's size in
 * Sanity → Theme Settings (see below), and being a custom property it is
 * inherited — so a container class also scales the plain `text-*` text inside it.
 * With nothing set, `--ts` is 1 and every size is exactly what it was.
 */
const SCALE = 'var(--ts, 1)';
const scaled = (value) => (/^[\d.]+(rem|px)$/.test(value) ? `calc(${value} * ${SCALE})` : value);

const scaledFontSizes = Object.fromEntries(
  Object.entries(defaultTheme.fontSize).map(([name, [size, { lineHeight }]]) => [
    name,
    [scaled(size), { lineHeight: scaled(lineHeight) }],
  ])
);

const textScale = plugin(({ addUtilities, matchUtilities }) => {
  // `font-hero-name` also carries `--ts: var(--scale-hero-name, 1)`.
  addUtilities(
    Object.fromEntries(
      CONTENT_SLOTS.map((slot) => [`.font-${slotClassName(slot.key)}`, { '--ts': `var(${slotScaleVar(slot.key)}, 1)` }])
    )
  );
  // `fs-[0.8rem]` — a custom font-size that scales like the `text-*` steps do.
  matchUtilities({ fs: (value) => ({ fontSize: `calc(${value} * ${SCALE})` }) });
});

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: scaledFontSizes,
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
        page: 'var(--max-page-width, 2560px)',
      },
    },
  },
  plugins: [textScale],
};
