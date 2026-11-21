import {
  CONTENT_SLOTS,
  DEFAULT_FONTS,
  FALLBACK_STACKS,
  FONT_ROLES,
  ROLE_CATEGORY,
  findGoogleFont,
  slotCssVar,
  slotFieldName,
  type FontCategory,
  type FontDefinition,
  type FontRole,
} from './fontRegistry';
import type { CustomFontDoc, ThemeSettingsDoc } from './sanity.types';

/** Already requested by the static <link> in index.html (the design defaults). */
const PRELOADED_FAMILIES = new Set(Object.values(DEFAULT_FONTS));

/** Legacy per-role fields — still honoured as the fallback for content left on "Default". */
const ROLE_FIELD: Record<FontRole, keyof ThemeSettingsDoc> = {
  body: 'bodyFont',
  heading: 'headingFont',
  display: 'displayFont',
  script: 'scriptFont',
};

const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9 _-]*$/;
const SANITY_CDN = /^https:\/\/cdn\.sanity\.io\//;
const FORMATS: Record<string, string> = { woff2: 'woff2', woff: 'woff', ttf: 'truetype', otf: 'opentype' };

const LINK_ID = 'theme-google-fonts';
const STYLE_ID = 'theme-custom-fonts';

export interface ResolvedFontTheme {
  /** CSS custom property → font-family stack (base roles + one per content slot). */
  variables: Record<string, string>;
  googleFontsUrl?: string;
  fontFaceCss: string;
}

type UsableCustomFont = CustomFontDoc & { fontName: string; url: string };

interface ResolvedFamily {
  stack: string;
  /** Set when the family has to be requested from Google Fonts. */
  google?: FontDefinition;
}

function isUsableCustomFont(font: CustomFontDoc): font is UsableCustomFont {
  return Boolean(font.fontName && SAFE_NAME.test(font.fontName.trim()) && font.url && SANITY_CDN.test(font.url));
}

function googleFamilyParam(font: FontDefinition) {
  const name = font.family.replace(/ /g, '+');
  const onlyRegular = font.weights.length === 1 && font.weights[0] === 400;
  return onlyRegular ? name : `${name}:wght@${font.weights.join(';')}`;
}

/**
 * Pure: turn the Sanity settings into CSS variables, a Google Fonts URL and @font-face rules.
 *
 * Every content slot resolves in this order:
 *   1. the font picked for that content (uploaded or Google),
 *   2. the base font of its role (legacy "Body / Heading / Display / Script" values),
 *   3. the original design font.
 */
export function resolveFontTheme(theme: ThemeSettingsDoc | null | undefined): ResolvedFontTheme {
  const customFonts = (theme?.customFonts ?? []).filter(isUsableCustomFont);
  const values = (theme ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);

  /** A dropdown value → uploaded font, or a known Google font; anything else → undefined. */
  const pick = (name: string | undefined, category: FontCategory): ResolvedFamily | undefined => {
    if (!name) return undefined;
    if (customFonts.some((f) => f.fontName.trim() === name)) {
      return { stack: `"${name}", ${FALLBACK_STACKS[category]}` };
    }
    const google = findGoogleFont(name);
    return google ? { stack: `"${google.family}", ${FALLBACK_STACKS[google.category]}`, google } : undefined;
  };

  // Base roles (fallback layer).
  const roles = {} as Record<FontRole, ResolvedFamily>;
  for (const role of FONT_ROLES) {
    const picked = str(values[ROLE_FIELD[role]]);
    const legacyUpload = customFonts.find((f) => f.usage?.includes(role));
    roles[role] =
      pick(picked && customFonts.some((f) => f.fontName.trim() === picked) ? picked : undefined, ROLE_CATEGORY[role]) ??
      (legacyUpload
        ? { stack: `"${legacyUpload.fontName.trim()}", ${FALLBACK_STACKS[ROLE_CATEGORY[role]]}` }
        : undefined) ??
      pick(picked, ROLE_CATEGORY[role]) ??
      pick(DEFAULT_FONTS[role], ROLE_CATEGORY[role])!;
  }

  const variables: Record<string, string> = {};
  const googleToLoad = new Map<string, FontDefinition>();
  const use = (cssVar: string, family: ResolvedFamily) => {
    variables[cssVar] = family.stack;
    if (family.google && !PRELOADED_FAMILIES.has(family.google.family)) googleToLoad.set(family.google.family, family.google);
  };

  for (const role of FONT_ROLES) use(`--font-${role}`, roles[role]);
  for (const slot of CONTENT_SLOTS) {
    const own = pick(str(values[slotFieldName(slot.key)]), ROLE_CATEGORY[slot.role]);
    use(slotCssVar(slot.key), own ?? roles[slot.role]);
  }

  const googleFontsUrl = googleToLoad.size
    ? `https://fonts.googleapis.com/css2?${[...googleToLoad.values()].map((f) => `family=${googleFamilyParam(f)}`).join('&')}&display=swap`
    : undefined;

  const fontFaceCss = customFonts
    .map((f) => {
      const format = FORMATS[(f.extension ?? '').toLowerCase()];
      const weight = Number.isFinite(f.weight) ? Math.min(900, Math.max(100, Number(f.weight))) : 400;
      const style = f.style === 'italic' ? 'italic' : 'normal';
      return `@font-face{font-family:"${f.fontName.trim()}";src:url("${encodeURI(f.url)}")${format ? ` format("${format}")` : ''};font-weight:${weight};font-style:${style};font-display:swap;}`;
    })
    .join('\n');

  return { variables, googleFontsUrl, fontFaceCss };
}

/**
 * Apply the resolved fonts to the document: CSS variables on <html>, one
 * <link> for the extra Google Fonts and one <style> with the @font-face rules.
 * Idempotent — calling it again replaces the previous result.
 */
export function applyFontTheme(theme: ThemeSettingsDoc | null | undefined) {
  const { variables, googleFontsUrl, fontFaceCss } = resolveFontTheme(theme);
  const root = document.documentElement;

  for (const [name, value] of Object.entries(variables)) root.style.setProperty(name, value);

  let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
  if (googleFontsUrl) {
    if (!link) {
      link = document.createElement('link');
      link.id = LINK_ID;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (link.href !== googleFontsUrl) link.href = googleFontsUrl;
  } else {
    link?.remove();
  }

  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (fontFaceCss) {
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = fontFaceCss;
  } else {
    style?.remove();
  }
}
