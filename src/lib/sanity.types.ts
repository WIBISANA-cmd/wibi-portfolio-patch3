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

export interface ProjectDoc {
  _id: string;
  title: string;
  category: string;
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
  preloader?: PreloaderData;
  hero?: HeroData;
  marquee?: MarqueeData;
  about?: AboutData;
  services?: ServicesData;
  projects?: ProjectsData;
  contact?: ContactData;
  footer?: FooterData;
  seo?: SEOData;
}
