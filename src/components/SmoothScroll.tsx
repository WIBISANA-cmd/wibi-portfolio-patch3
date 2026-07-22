import { type ReactNode, useRef, useEffect } from 'react';
import { gsap, ScrollSmoother, useGSAP } from '../lib/gsap';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        ScrollSmoother.create({
          wrapper: wrapper.current,
          content: content.current,
          smooth: 1.2,
          effects: true,
          smoothTouch: 0.1,
        });
      });

      return () => mm.revert();
    },
    { scope: wrapper }
  );

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      // Determine target hash (e.g. '#about' or 'about' pointing to #about)
      let hash = '';
      if (rawHref.startsWith('#')) {
        hash = rawHref;
      } else if (
        !rawHref.startsWith('http://') &&
        !rawHref.startsWith('https://') &&
        !rawHref.startsWith('/') &&
        !rawHref.startsWith('mailto:') &&
        !rawHref.startsWith('tel:')
      ) {
        if (document.querySelector(`#${rawHref}`)) {
          hash = `#${rawHref}`;
        }
      }

      if (hash && hash.length > 1) {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          e.preventDefault();
          const smoother = ScrollSmoother.get();
          if (smoother) {
            smoother.scrollTo(hash, true);
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
          window.history.pushState(null, '', hash);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div ref={wrapper} id="smooth-wrapper">
      <div ref={content} id="smooth-content">
        {children}
      </div>
    </div>
  );
}

