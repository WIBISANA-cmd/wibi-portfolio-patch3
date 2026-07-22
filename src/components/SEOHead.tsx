import { useEffect } from 'react';
import type { SEOData } from '../lib/sanity.types';
import { imageUrl } from '../lib/sanity.client';

interface SEOHeadProps {
  seo?: SEOData;
  wordmark?: string;
  faviconUrl?: string;
}

export default function SEOHead({ seo, wordmark = 'WIBISANA', faviconUrl }: SEOHeadProps) {
  useEffect(() => {
    const title = seo?.title || `${wordmark} — Portfolio & Web Solutions`;
    const description =
      seo?.description ||
      'Portfolio & Professional Web Development Services by Wibisana.';

    let ogImageUrl = '/wblogo.jpg';
    if (seo?.ogImage) {
      ogImageUrl = imageUrl(seo.ogImage, 1200) || '/wblogo.jpg';
    } else if (typeof window !== 'undefined') {
      ogImageUrl = `${window.location.origin}/wblogo.jpg`;
    }

    document.title = title;

    if (faviconUrl) {
      ['icon', 'shortcut icon', 'apple-touch-icon'].forEach((rel) => {
        let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', rel);
          document.head.appendChild(link);
        }
        link.setAttribute('href', faviconUrl);
      });
    }

    // Helper function to update or create meta tags
    const setMetaTag = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('[name=')) {
          const nameMatch = selector.match(/\[name="([^"]+)"\]/);
          if (nameMatch) element.setAttribute('name', nameMatch[1]);
        } else if (selector.includes('[property=')) {
          const propMatch = selector.match(/\[property="([^"]+)"\]/);
          if (propMatch) element.setAttribute('property', propMatch[1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // Primary Meta
    setMetaTag('meta[name="description"]', 'content', description);
    setMetaTag('meta[name="title"]', 'content', title);

    // Open Graph / WhatsApp / Facebook / LinkedIn
    setMetaTag('meta[property="og:title"]', 'content', title);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:image"]', 'content', ogImageUrl);
    setMetaTag('meta[property="og:url"]', 'content', window.location.href);

    // Twitter Card
    setMetaTag('meta[name="twitter:title"]', 'content', title);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', ogImageUrl);
  }, [seo, wordmark, faviconUrl]);

  return null;
}
