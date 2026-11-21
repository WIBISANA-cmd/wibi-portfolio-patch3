import { client, isSanityConfigured } from './sanity.client';
import type { LandingPage, ThemeSettingsDoc, TranslationDoc } from './sanity.types';

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
    label,
    sublabel,
    links
  },
  hero{
    backgroundWord,
    headline,
    name,
    eyebrow,
    subheadline,
    locationNote,
    tagline,
    availability,
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
    heading,
    services[]->{
      _id,
      orderNumber,
      title,
      description,
      icon,
      image
    }
  },
  skills{
    heading,
    educationHeading,
    skillsHeading,
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
    heading,
    featuredCount,
    viewAllLabel,
    showLessLabel,
    projects[]->{
      _id,
      title,
      category,
      techstack,
      image,
      url,
      description,
      order
    }
  },
  quote{
    text,
    signature,
    footnote
  },
  contact{
    heading,
    email,
    socials,
    note,
    image
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
    showDownloadButton,
    buttonLabel
  },
  seo
}`;

/** Every published language dictionary, in document order. */
export const translationsQuery = /* groq */ `
*[_type == "translation" && defined(language)] | order(label asc){
  _id,
  language,
  label,
  entries[]{ from, to }
}`;

/** Global typography settings, with uploaded font files resolved to CDN URLs. */
export const themeSettingsQuery = /* groq */ `
*[_type == "themeSettings"][0]{
  ...,
  "customFonts": customFonts[defined(fontFile.asset)]{
    _key,
    fontName,
    weight,
    style,
    usage,
    "url": fontFile.asset->url,
    "extension": fontFile.asset->extension
  }
}`;

export interface LandingPagePayload {
  page: LandingPage | null;
  translations: TranslationDoc[];
  theme: ThemeSettingsDoc | null;
}

/**
 * Fetch all landing page data plus the language dictionaries in one round trip.
 * Returns an empty payload when Sanity isn't configured.
 */
export async function getLandingPage(): Promise<LandingPagePayload> {
  if (!isSanityConfigured) return { page: null, translations: [], theme: null };
  try {
    return await client.fetch<LandingPagePayload>(
      `{"page": ${landingPageQuery}, "translations": ${translationsQuery}, "theme": ${themeSettingsQuery}}`
    );
  } catch (err) {
    console.error('[sanity] Failed to fetch landing page:', err);
    const message =
      err instanceof Error ? err.message : 'Unknown error while fetching Sanity data.';

    throw new LandingPageFetchError(message);
  }
}
