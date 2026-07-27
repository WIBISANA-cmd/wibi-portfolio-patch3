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

export interface SkillDoc {
  _id: string;
  name: string;
  category: string;
  proficiency?: number;
  order?: number;
}

export interface TranslationDoc {
  _id: string;
  /** ISO code, e.g. "id". */
  language: string;
  label: string;
  entries?: { from: string; to: string }[];
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

export interface SkillsData {
  heading?: string;
  skills?: SkillDoc[];
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

export interface CVEducation {
  degree?: string;
  institution?: string;
  year?: string;
  description?: string;
}

export interface CVCertification {
  name?: string;
  issuer?: string;
  year?: string;
}

export interface CVLanguage {
  language?: string;
  level?: string;
}

export interface CVData {
  fullName?: string;
  jobTitle?: string;
  phone?: string;
  location?: string;
  website?: string;
  summary?: string;
  education?: CVEducation[];
  certifications?: CVCertification[];
  languages?: CVLanguage[];
  showDownloadButton?: boolean;
}

export interface LandingPage {
  branding?: BrandingData;
  preloader?: PreloaderData;
  navigation?: NavigationData;
  hero?: HeroData;
  marquee?: MarqueeData;
  about?: AboutData;
  services?: ServicesData;
  skills?: SkillsData;
  experiences?: ExperiencesData;
  projects?: ProjectsData;
  contact?: ContactData;
  footer?: FooterData;
  cv?: CVData;
  seo?: SEOData;
}
