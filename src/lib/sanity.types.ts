import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/** A raw Sanity image object (asset reference + optional hotspot/crop). */
export type SanityImage = SanityImageSource & { alt?: string };

/* ----------------------------------------------------- referenced documents */

export interface ServiceDoc {
  _id: string;
  orderNumber?: number;
  title: string;
  description: string;
  image?: SanityImage;
}

export interface ExperienceDoc {
  _id: string;
  role: string;
  company: string;
  duration: string;
  description?: string;
  order?: number;
}

export interface ProjectDoc {
  _id: string;
  title: string;
  techstack?: string[];
  year: string;
  image: SanityImage;
  url?: string;
  description?: string;
  order?: number;
}

export interface MarqueeImageDoc {
  _id: string;
  image: SanityImage;
  label?: string;
}

/* ------------------------------------------------ landingPage singleton shape */

export interface PreloaderData {
  enabled?: boolean;
  wordmark?: string;
  durationMs?: number;
}

export interface BrandingData {
  logo?: SanityImage;
  favicon?: SanityImage;
}

export interface NavigationData {
  links?: { label: string; url: string }[];
}

export interface HeroData {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  backgroundImage?: SanityImage;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface AboutData {
  heading?: string;
  body?: string;
  image?: SanityImage;
  stats?: { value: string; label: string }[];
}

export interface ServicesData {
  services?: ServiceDoc[];
}

export interface ExperiencesData {
  heading?: string;
  experiences?: ExperienceDoc[];
}

export interface ProjectsData {
  projects?: ProjectDoc[];
}

export interface MarqueeData {
  items?: MarqueeImageDoc[];
}

export interface ContactData {
  heading?: string;
  email?: string;
  socials?: { label: string; url: string }[];
  note?: string;
}

export interface FooterData {
  tagline?: string;
  copyright?: string;
  links?: { label: string; url: string }[];
}

export interface SEOData {
  title?: string;
  description?: string;
  ogImage?: SanityImage;
}

export interface LandingPage {
  branding?: BrandingData;
  preloader?: PreloaderData;
  navigation?: NavigationData;
  hero?: HeroData;
  marquee?: MarqueeData;
  about?: AboutData;
  services?: ServicesData;
  experiences?: ExperiencesData;
  projects?: ProjectsData;
  contact?: ContactData;
  footer?: FooterData;
  seo?: SEOData;
}
