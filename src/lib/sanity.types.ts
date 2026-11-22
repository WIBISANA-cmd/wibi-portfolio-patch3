import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/** A raw Sanity image object (asset reference + optional hotspot/crop). */
export type SanityImage = SanityImageSource & { alt?: string };

/* ----------------------------------------------------- referenced documents */

export interface ServiceDoc {
  _id: string;
  orderNumber?: number;
  title: string;
  description: string;
  icon?: string;
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
  category?: string;
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

export interface CustomFontDoc {
  _key: string;
  fontName?: string;
  weight?: number;
  style?: 'normal' | 'italic';
  /** Roles this font is applied to: body | heading | display | script. */
  usage?: string[];
  /** Resolved Sanity CDN URL of the uploaded file. */
  url?: string;
  extension?: string;
}

export interface ResponsiveSizeValue {
  desktop?: number;
  tablet?: number;
  mobile?: number;
}

export interface ThemeSettingsDoc {
  bodyFont?: string;
  headingFont?: string;
  displayFont?: string;
  scriptFont?: string;
  customFonts?: CustomFontDoc[];
  /** Custom screen breakpoints (px) */
  screenMobile?: number;
  screenTablet?: number;
  maxPageWidth?: number;
  /** Global text size scaling (%) per screen size */
  globalScaleDesktop?: number;
  globalScaleTablet?: number;
  globalScaleMobile?: number;
  /** Per-slot text sizes (number or responsive object) */
  [key: string]: unknown;
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
  label?: string;
  sublabel?: string;
  links?: { label: string; url: string }[];
}

export interface HeroData {
  backgroundWord?: string;
  /** Script greeting line shown above the name. */
  headline?: string;
  name?: string;
  /** Accent role/title under the name. */
  eyebrow?: string;
  subheadline?: string;
  locationNote?: string;
  tagline?: string;
  availability?: string;
  /** Portrait (field name kept for existing content). */
  backgroundImage?: SanityImage;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface QuoteData {
  text?: string;
  signature?: string;
  footnote?: string;
}

export interface AboutData {
  heading?: string;
  body?: string;
  image?: SanityImage;
  stats?: { value: string; label: string }[];
}

export interface ServicesData {
  heading?: string;
  services?: ServiceDoc[];
}

export interface ExperiencesData {
  heading?: string;
  experiences?: ExperienceDoc[];
}

export interface ProjectsData {
  heading?: string;
  featuredCount?: number;
  viewAllLabel?: string;
  showLessLabel?: string;
  projects?: ProjectDoc[];
}

export interface MarqueeData {
  items?: MarqueeImageDoc[];
}

export interface SkillsData {
  heading?: string;
  educationHeading?: string;
  skillsHeading?: string;
  skills?: SkillDoc[];
}

export interface ContactData {
  heading?: string;
  email?: string;
  socials?: { label: string; url: string }[];
  note?: string;
  image?: SanityImage;
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
  buttonLabel?: string;
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
  quote?: QuoteData;
  contact?: ContactData;
  footer?: FooterData;
  cv?: CVData;
  seo?: SEOData;
}
