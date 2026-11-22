import {
  CONTENT_SLOTS,
  DEFAULT_BREAKPOINTS,
  SIZE_DEFAULT,
  SIZE_MAX,
  SIZE_MIN,
  slotScaleVar,
  slotSizeFieldName,
} from './fontRegistry';
import type { ResponsiveSizeValue, ThemeSettingsDoc } from './sanity.types';

const STYLE_ID = 'theme-text-sizes';

interface ParsedSlotSize {
  desktop: number;
  tablet: number;
  mobile: number;
}

function clamp(min: number, max: number, value: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Normalizes a slot's size value (whether stored as a legacy number or a
 * responsive object { desktop, tablet, mobile }) with clean cascading fallback:
 *   mobile inherits tablet -> tablet inherits desktop -> desktop defaults to 100.
 */
export function parseSlotSize(raw: unknown): ParsedSlotSize {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const val = clamp(SIZE_MIN, SIZE_MAX, raw);
    return { desktop: val, tablet: val, mobile: val };
  }

  if (raw && typeof raw === 'object') {
    const obj = raw as ResponsiveSizeValue;
    const desktop =
      typeof obj.desktop === 'number' && Number.isFinite(obj.desktop)
        ? clamp(SIZE_MIN, SIZE_MAX, obj.desktop)
        : SIZE_DEFAULT;

    const tablet =
      typeof obj.tablet === 'number' && Number.isFinite(obj.tablet)
        ? clamp(SIZE_MIN, SIZE_MAX, obj.tablet)
        : desktop;

    const mobile =
      typeof obj.mobile === 'number' && Number.isFinite(obj.mobile)
        ? clamp(SIZE_MIN, SIZE_MAX, obj.mobile)
        : tablet;

    return { desktop, tablet, mobile };
  }

  return { desktop: SIZE_DEFAULT, tablet: SIZE_DEFAULT, mobile: SIZE_DEFAULT };
}

export interface ResolvedTextTheme {
  desktopVars: Record<string, string>;
  tabletVars: Record<string, string>;
  mobileVars: Record<string, string>;
  breakpoints: {
    mobile: number;
    tablet: number;
    pageMax: number;
  };
  css: string;
}

/**
 * Pure: turns Sanity theme settings (custom screen breakpoints, global scales,
 * and per-content responsive text sizes) into CSS custom properties and media queries.
 */
export function resolveTextTheme(theme: ThemeSettingsDoc | null | undefined): ResolvedTextTheme {
  const values = (theme ?? {}) as Record<string, unknown>;

  const rawMobile = Number(theme?.screenMobile);
  const mobileBp = Number.isFinite(rawMobile)
    ? clamp(320, 900, rawMobile)
    : DEFAULT_BREAKPOINTS.mobile;

  const rawTablet = Number(theme?.screenTablet);
  const tabletBp = Number.isFinite(rawTablet)
    ? clamp(mobileBp + 1, 1440, rawTablet)
    : DEFAULT_BREAKPOINTS.tablet;

  const rawPageMax = Number(theme?.maxPageWidth);
  const pageMax = Number.isFinite(rawPageMax)
    ? clamp(1024, 3840, rawPageMax)
    : DEFAULT_BREAKPOINTS.pageMax;

  const gDesktop =
    typeof theme?.globalScaleDesktop === 'number' && Number.isFinite(theme.globalScaleDesktop)
      ? clamp(50, 200, theme.globalScaleDesktop) / 100
      : 1;

  const gTablet =
    typeof theme?.globalScaleTablet === 'number' && Number.isFinite(theme.globalScaleTablet)
      ? clamp(50, 200, theme.globalScaleTablet) / 100
      : 1;

  const gMobile =
    typeof theme?.globalScaleMobile === 'number' && Number.isFinite(theme.globalScaleMobile)
      ? clamp(50, 200, theme.globalScaleMobile) / 100
      : 1;

  const desktopVars: Record<string, string> = {
    '--max-page-width': `${pageMax}px`,
  };
  const tabletVars: Record<string, string> = {};
  const mobileVars: Record<string, string> = {};

  for (const slot of CONTENT_SLOTS) {
    const raw = values[slotSizeFieldName(slot.key)];
    const parsed = parseSlotSize(raw);
    const varName = slotScaleVar(slot.key);

    const dScale = Number(((parsed.desktop / 100) * gDesktop).toFixed(4));
    const tScale = Number(((parsed.tablet / 100) * gTablet).toFixed(4));
    const mScale = Number(((parsed.mobile / 100) * gMobile).toFixed(4));

    if (dScale !== 1) {
      desktopVars[varName] = String(dScale);
    }

    if (tScale !== dScale) {
      tabletVars[varName] = String(tScale);
    }

    if (mScale !== tScale) {
      mobileVars[varName] = String(mScale);
    }
  }

  // Generate CSS stylesheet
  const rootDeclarations = Object.entries(desktopVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  let css = `:root {\n${rootDeclarations}\n}`;

  if (Object.keys(tabletVars).length > 0) {
    const tabletDeclarations = Object.entries(tabletVars)
      .map(([k, v]) => `    ${k}: ${v};`)
      .join('\n');
    css += `\n\n@media (max-width: ${tabletBp}px) {\n  :root {\n${tabletDeclarations}\n  }\n}`;
  }

  if (Object.keys(mobileVars).length > 0) {
    const mobileDeclarations = Object.entries(mobileVars)
      .map(([k, v]) => `    ${k}: ${v};`)
      .join('\n');
    css += `\n\n@media (max-width: ${mobileBp}px) {\n  :root {\n${mobileDeclarations}\n  }\n}`;
  }

  return {
    desktopVars,
    tabletVars,
    mobileVars,
    breakpoints: { mobile: mobileBp, tablet: tabletBp, pageMax },
    css,
  };
}

/** Legacy helper: returns desktop CSS variables */
export function resolveTextScales(theme: ThemeSettingsDoc | null | undefined): Record<string, string> {
  return resolveTextTheme(theme).desktopVars;
}

/** Track variables set directly on style for cleanup */
let appliedDesktopVars: string[] = [];

/**
 * Apply the responsive text size multipliers and custom screen breakpoints.
 * Updates/injects <style id="theme-text-sizes"> and keeps :root inline styles in sync.
 * Idempotent.
 */
export function applyTextSizes(theme: ThemeSettingsDoc | null | undefined) {
  const { desktopVars, css } = resolveTextTheme(theme);
  const root = document.documentElement;

  // 1. Keep inline desktop variables in sync for immediate style calculations
  for (const name of appliedDesktopVars) {
    if (!(name in desktopVars)) root.style.removeProperty(name);
  }
  for (const [name, value] of Object.entries(desktopVars)) {
    root.style.setProperty(name, value);
  }
  appliedDesktopVars = Object.keys(desktopVars);

  // 2. Inject or update the responsive media query stylesheet
  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }
  if (styleEl.textContent !== css) {
    styleEl.textContent = css;
  }
}
