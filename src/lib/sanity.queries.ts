import { client, isSanityConfigured } from './sanity.client';
import type { LandingPage } from './sanity.types';

export class LandingPageFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LandingPageFetchError';
  }
}

/**
 * Single GROQ query that fetches the landingPage singleton and *resolves every
 * reference* (services, projects, marquee tiles) into full documents using the
 * `->` dereference operator, so the front-end gets ready-to-render data in one
 * round trip.
 */
export const landingPageQuery = /* groq */ `
*[_type == "landingPage"][0]{
  preloader{
    isEnabled,
    loadingWords,
    animationDuration,
    preloaderBgColor,
    preloaderTextColor
  },
  hero{
    navLinks,
    heading,
    description,
    portrait
  },
  about{
    title,
    paragraph,
    moonIcon,
    legoIcon,
    object1,
    group1
  },
  services{
    title,
    items[]->{
      _id,
      number,
      name,
      description
    }
  },
  projects{
    title,
    items[]->{
      _id,
      number,
      projectType,
      title,
      linkButton,
      images
    }
  },
  marquee{
    row1[]->{ _id, image },
    row2[]->{ _id, image }
  }
}`;

/**
 * Fetch all landing page data. Returns `null` when Sanity isn't configured or
 * the document doesn't exist yet — callers then render bundled defaults.
 */
export async function getLandingPage(): Promise<LandingPage | null> {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch<LandingPage | null>(landingPageQuery);
  } catch (err) {
    console.error('[sanity] Failed to fetch landing page:', err);
    const message =
      err instanceof Error ? err.message : 'Unknown error while fetching Sanity data.';

    throw new LandingPageFetchError(message);
  }
}
