/**
 * Single source of truth for the selectable Google Fonts.
 * Imported by the Sanity schema (dropdown options) and by the frontend
 * (stylesheet URL + fallback stacks), so both always agree on the list.
 * Plain data only — safe to import from Studio and browser code.
 */

export type FontCategory = 'sans' | 'serif' | 'mono' | 'display' | 'script';

export interface FontDefinition {
  /** Family name exactly as Google Fonts spells it. */
  family: string;
  category: FontCategory;
  /** Weights requested from Google Fonts. */
  weights: number[];
}

export const GOOGLE_FONTS: FontDefinition[] = [
  // Sans serif
  { family: 'Inter', category: 'sans', weights: [300, 400, 500, 600, 700] },
  { family: 'Plus Jakarta Sans', category: 'sans', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Poppins', category: 'sans', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'DM Sans', category: 'sans', weights: [300, 400, 500, 600, 700] },
  { family: 'Manrope', category: 'sans', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Montserrat', category: 'sans', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Space Grotesk', category: 'sans', weights: [300, 400, 500, 600, 700] },
  { family: 'Roboto', category: 'sans', weights: [300, 400, 500, 700] },
  // Serif
  { family: 'Playfair Display', category: 'serif', weights: [400, 500, 600, 700, 800] },
  { family: 'Merriweather', category: 'serif', weights: [300, 400, 700, 900] },
  { family: 'Lora', category: 'serif', weights: [400, 500, 600, 700] },
  // Monospace
  { family: 'JetBrains Mono', category: 'mono', weights: [300, 400, 500, 600, 700] },
  // Display (condensed / poster)
  { family: 'Anton', category: 'display', weights: [400] },
  { family: 'Bebas Neue', category: 'display', weights: [400] },
  { family: 'Oswald', category: 'display', weights: [300, 400, 500, 600, 700] },
  // Script / handwritten
  { family: 'Allura', category: 'script', weights: [400] },
  { family: 'Great Vibes', category: 'script', weights: [400] },
  { family: 'Dancing Script', category: 'script', weights: [400, 500, 600, 700] },
  { family: 'Caveat', category: 'script', weights: [400, 500, 600, 700] },
];

/** Generic fallbacks appended after the chosen family. */
export const FALLBACK_STACKS: Record<FontCategory, string> = {
  sans: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  display: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
  script: "'Brush Script MT', cursive",
};

/** The typographic roles an editor can restyle. */
export const FONT_ROLES = ['body', 'heading', 'display', 'script'] as const;
export type FontRole = (typeof FONT_ROLES)[number];

export const FONT_ROLE_LABELS: Record<FontRole, string> = {
  body: 'Body (paragraphs, labels, buttons)',
  heading: 'Headings (section & card titles)',
  display: 'Display (hero name, giant word, numbers)',
  script: 'Script (greeting & signature)',
};

/** Defaults — the fonts of the original design. Used when Sanity is empty. */
export const DEFAULT_FONTS: Record<FontRole, string> = {
  body: 'Inter',
  heading: 'Inter',
  display: 'Anton',
  script: 'Allura',
};

/** Fallback category per role when the chosen font is a custom upload. */
export const ROLE_CATEGORY: Record<FontRole, FontCategory> = {
  body: 'sans',
  heading: 'sans',
  display: 'display',
  script: 'script',
};

const CATEGORY_LABEL: Record<FontCategory, string> = {
  sans: 'Sans',
  serif: 'Serif',
  mono: 'Mono',
  display: 'Display',
  script: 'Script',
};

/** Options for a Sanity `string` field dropdown. */
export const FONT_OPTIONS = GOOGLE_FONTS.map((f) => ({
  title: `${f.family} — ${CATEGORY_LABEL[f.category]}`,
  value: f.family,
}));

export function findGoogleFont(family?: string): FontDefinition | undefined {
  return GOOGLE_FONTS.find((f) => f.family === family);
}

/* ------------------------------------------------------------------ content */

/**
 * Every piece of content whose font an editor can set on its own.
 * `role` is the built-in design default for that content (and what it falls
 * back to when left on "Default").
 */
export interface ContentSlot {
  /** camelCase id. Sanity field = `${key}Font`, CSS var = `--font-<kebab>`, Tailwind class = `font-<kebab>`. */
  key: string;
  label: string;
  group: string;
  role: FontRole;
}

export const CONTENT_GROUPS = [
  { name: 'header', title: 'Header' },
  { name: 'hero', title: 'Hero' },
  { name: 'sections', title: 'Section titles' },
  { name: 'projects', title: 'Projects' },
  { name: 'about', title: 'About' },
  { name: 'skills', title: 'Skills & Education' },
  { name: 'services', title: 'Services / Work Process' },
  { name: 'quote', title: 'Quote panel' },
  { name: 'experience', title: 'Work Experience' },
  { name: 'contact', title: 'Contact' },
  { name: 'other', title: 'Footer, buttons & preloader' },
] as const;

export const CONTENT_SLOTS: ContentSlot[] = [
  { key: 'navBrand', label: 'Brand label (top-left)', group: 'header', role: 'body' },
  { key: 'navMenu', label: 'Menu links & availability badge', group: 'header', role: 'body' },

  { key: 'heroWord', label: 'Giant background word', group: 'hero', role: 'display' },
  { key: 'heroGreeting', label: 'Greeting (script line)', group: 'hero', role: 'script' },
  { key: 'heroName', label: 'Name', group: 'hero', role: 'display' },
  { key: 'heroRole', label: 'Role / title', group: 'hero', role: 'body' },
  { key: 'heroIntro', label: 'Intro paragraph', group: 'hero', role: 'body' },
  { key: 'heroTagline', label: 'Side tagline & location note', group: 'hero', role: 'body' },
  { key: 'heroStatNumber', label: 'Stat numbers', group: 'hero', role: 'display' },
  { key: 'heroStatLabel', label: 'Stat labels', group: 'hero', role: 'body' },

  { key: 'sectionTitle', label: 'Section titles (Projects, About, …)', group: 'sections', role: 'heading' },
  { key: 'sectionSubtitle', label: 'Sub-headings (Education, Skills)', group: 'sections', role: 'heading' },

  { key: 'projectNumber', label: 'Card number (01, 02, …)', group: 'projects', role: 'display' },
  { key: 'projectTitle', label: 'Card title', group: 'projects', role: 'heading' },
  { key: 'projectMeta', label: 'Card category / tech stack', group: 'projects', role: 'body' },

  { key: 'aboutBody', label: 'About text', group: 'about', role: 'body' },

  { key: 'educationText', label: 'Education & certifications', group: 'skills', role: 'body' },
  { key: 'skillTag', label: 'Skill tags', group: 'skills', role: 'body' },

  { key: 'serviceNumber', label: 'Step number', group: 'services', role: 'display' },
  { key: 'serviceTitle', label: 'Step title', group: 'services', role: 'heading' },
  { key: 'serviceText', label: 'Step description', group: 'services', role: 'body' },

  { key: 'quoteText', label: 'Quote text', group: 'quote', role: 'body' },
  { key: 'quoteSignature', label: 'Signature', group: 'quote', role: 'script' },
  { key: 'quoteFootnote', label: 'Footnote', group: 'quote', role: 'body' },

  { key: 'experienceNumber', label: 'Card number', group: 'experience', role: 'display' },
  { key: 'experienceRole', label: 'Role title', group: 'experience', role: 'heading' },
  { key: 'experienceText', label: 'Company, duration & description', group: 'experience', role: 'body' },

  { key: 'contactHeading', label: 'Heading', group: 'contact', role: 'heading' },
  { key: 'contactText', label: 'Intro & contact details', group: 'contact', role: 'body' },

  { key: 'buttons', label: 'Buttons & links (Download CV, View all, language)', group: 'other', role: 'body' },
  { key: 'footerText', label: 'Footer', group: 'other', role: 'body' },
  { key: 'preloaderWord', label: 'Preloader wordmark', group: 'other', role: 'display' },
];

const kebab = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** `heroName` → `--font-hero-name` */
export const slotCssVar = (key: string) => `--font-${kebab(key)}`;
/** `heroName` → `heroNameFont` (the Sanity field name) */
export const slotFieldName = (key: string) => `${key}Font`;
/** `heroName` → `hero-name` (suffix of the `font-*` Tailwind class) */
export const slotClassName = kebab;

export function findSlotByField(fieldName?: string): ContentSlot | undefined {
  return CONTENT_SLOTS.find((s) => slotFieldName(s.key) === fieldName);
}

/* --------------------------------------------------------------- text size */

/**
 * Text size is a percentage of the design's own size for that content
 * (100 = unchanged). It is a multiplier, so the responsive steps of the design
 * (phone → desktop) are kept — every breakpoint just grows or shrinks together.
 */
export const SIZE_DEFAULT = 100;
export const SIZE_MIN = 40;
export const SIZE_MAX = 300;
export const SIZE_STEP = 5;

/** `heroName` → `heroNameSize` (the Sanity field name) */
export const slotSizeFieldName = (key: string) => `${key}Size`;
/** `heroName` → `--scale-hero-name` (unitless multiplier, e.g. 1.25) */
export const slotScaleVar = (key: string) => `--scale-${kebab(key)}`;

export function findSlotBySizeField(fieldName?: string): ContentSlot | undefined {
  return CONTENT_SLOTS.find((s) => slotSizeFieldName(s.key) === fieldName);
}
