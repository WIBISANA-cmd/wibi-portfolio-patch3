import { CONTENT_SLOTS, SIZE_DEFAULT, SIZE_MAX, SIZE_MIN, slotScaleVar, slotSizeFieldName } from './fontRegistry';
import type { ThemeSettingsDoc } from './sanity.types';

/**
 * Pure: turn the per-content "Text size" percentages from Sanity into CSS
 * variables (`--scale-hero-name: 1.25`). Missing, invalid or default (100)
 * values are left out, so the stylesheet's own `var(--scale-…, 1)` fallback
 * applies. Out-of-range numbers are clamped.
 */
export function resolveTextScales(theme: ThemeSettingsDoc | null | undefined): Record<string, string> {
  const values = (theme ?? {}) as Record<string, unknown>;
  const variables: Record<string, string> = {};

  for (const slot of CONTENT_SLOTS) {
    const percent = values[slotSizeFieldName(slot.key)];
    if (typeof percent !== 'number' || !Number.isFinite(percent) || percent === SIZE_DEFAULT) continue;
    const clamped = Math.min(SIZE_MAX, Math.max(SIZE_MIN, percent));
    variables[slotScaleVar(slot.key)] = String(clamped / 100);
  }
  return variables;
}

/** Variables set by the previous call, so a value cleared in the Studio is removed again. */
let applied: string[] = [];

/** Apply the text-size multipliers on <html>. Idempotent. */
export function applyTextSizes(theme: ThemeSettingsDoc | null | undefined) {
  const root = document.documentElement;
  const variables = resolveTextScales(theme);

  for (const name of applied) if (!(name in variables)) root.style.removeProperty(name);
  for (const [name, value] of Object.entries(variables)) root.style.setProperty(name, value);
  applied = Object.keys(variables);
}
