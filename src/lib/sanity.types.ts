import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/** A raw Sanity image object (asset reference + optional hotspot/crop). */
export type SanityImage = SanityImageSource;

/* ----------------------------------------------------- referenced documents */

export interface ServiceDoc {
  _id: string;
  number: string;
  name: string;
  description: string;
}

export interface ProjectDoc {
  _id: string;
  number: string;
  projectType: 'Client' | 'Personal';
  title: string;
  linkButton?: string;
  images?: {
    col1_image1?: SanityImage;
    col1_image2?: SanityImage;
    col2_image?: SanityImage;
  };
}

export interface MarqueeImageDoc {
  _id: string;
  image: SanityImage;
}

/* ------------------------------------------------ landingPage singleton shape */

export interface PreloaderData {
  isEnabled?: boolean;
  loadingWords?: string[];
  /** Milliseconds each word stays on screen. */
  animationDuration?: number;
  preloaderBgColor?: string;
  preloaderTextColor?: string;
}

export interface HeroData {
  navLinks?: string[];
  heading?: string;
  description?: string;
  portrait?: SanityImage;
}

export interface AboutData {
  title?: string;
  paragraph?: string;
  moonIcon?: SanityImage;
  legoIcon?: SanityImage;
  object1?: SanityImage;
  group1?: SanityImage;
}

export interface ServicesData {
  title?: string;
  items?: ServiceDoc[];
}

export interface ProjectsData {
  title?: string;
  items?: ProjectDoc[];
}

export interface MarqueeData {
  row1?: MarqueeImageDoc[];
  row2?: MarqueeImageDoc[];
}

export interface LandingPage {
  preloader?: PreloaderData;
  hero?: HeroData;
  about?: AboutData;
  services?: ServicesData;
  projects?: ProjectsData;
  marquee?: MarqueeData;
}
