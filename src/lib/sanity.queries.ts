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
  branding{
    logo,
    favicon
  },
  preloader,
  navigation{
    links
  },
  hero{
    eyebrow,
    headline,
    subheadline,
    backgroundImage,
    ctaLabel,
    ctaHref
  },
  marquee{
    items[]->{ _id, image, label }
  },
  about{
    heading,
    body,
    image,
    stats
  },
  services{
    services[]->{
      _id,
      orderNumber,
      title,
      description,
      image
    }
  },
  skills{
    heading,
    skills[]->{
      _id,
      name,
      category,
      proficiency,
      order
    }
  },
  experiences{
    heading,
    experiences[]->{
      _id,
      role,
      company,
      duration,
      description,
      order
    }
  },
  projects{
    projects[]->{
      _id,
      title,
      techstack,
      image,
      url,
      description,
      order
    }
  },
  contact{
    heading,
    email,
    socials,
    note
  },
  footer{
    tagline,
    copyright,
    links
  },
  cv{
    fullName,
    jobTitle,
    phone,
    location,
    website,
    summary,
    education,
    certifications,
    languages,
    showDownloadButton
  },
  seo
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
