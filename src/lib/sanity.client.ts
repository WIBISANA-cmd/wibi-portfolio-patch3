import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Vite exposes only variables prefixed with VITE_ to the browser bundle.
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.VITE_SANITY_DATASET as string) || 'production';
const apiVersion =
  (import.meta.env.VITE_SANITY_API_VERSION as string) || '2024-10-01';

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
};

/**
 * `isSanityConfigured` lets the UI degrade gracefully to its bundled default
 * content when no project id is present (e.g. before the CMS is set up).
 */
export const isSanityConfigured = Boolean(projectId);

export const client: SanityClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  // CDN for fast, cached public reads. Set to false if you add a token/preview.
  useCdn: true,
});

const builder = imageUrlBuilder(client);

/** Build an optimized image URL from a Sanity image source. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Safe helper: returns a URL string for an (optional) Sanity image, or
 * `undefined` when the asset is missing — so callers can fall back cleanly.
 */
export function imageUrl(
  source: SanityImageSource | null | undefined,
  width?: number
): string | undefined {
  if (!source) return undefined;
  try {
    let b = urlFor(source).auto('format').fit('max');
    if (width) b = b.width(width);
    return b.url();
  } catch {
    return undefined;
  }
}
