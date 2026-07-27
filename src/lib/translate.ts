/**
 * Whole-string translation of a fetched Sanity payload.
 *
 * The dictionary is keyed by the *source* (English) string, so a section never
 * has to know about languages: `translate(data, dict)` returns the same shape
 * with every human-readable string swapped, and anything missing from the
 * dictionary falls back to the original text.
 */

/** Keys whose values are machine-readable (URLs, ids, assets) — never translated. */
const SKIP_KEYS = new Set([
  'url',
  'href',
  'ctaHref',
  'email',
  'phone',
  'website',
  'asset',
  'image',
  'backgroundImage',
  'ogImage',
  'logo',
  'favicon',
]);

export type Dict = Map<string, string>;

/** Build a lookup from `[{ from, to }]` entries, ignoring incomplete rows. */
export function buildDict(entries?: { from?: string; to?: string }[]): Dict {
  return new Map(
    (entries ?? [])
      .filter((e): e is { from: string; to: string } => Boolean(e?.from && e?.to))
      .map((e) => [e.from.trim(), e.to])
  );
}

export function translate<T>(value: T, dict: Dict): T {
  if (dict.size === 0) return value;
  return walk(value, dict) as T;
}

function walk(value: unknown, dict: Dict): unknown {
  if (typeof value === 'string') return dict.get(value.trim()) ?? value;
  if (Array.isArray(value)) return value.map((v) => walk(v, dict));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      // `_id`, `_type`, `_ref`, `_key` … are Sanity internals; keep them intact.
      out[key] = key.startsWith('_') || SKIP_KEYS.has(key) ? val : walk(val, dict);
    }
    return out;
  }
  return value;
}
