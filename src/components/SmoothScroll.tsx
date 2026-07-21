import { type ReactNode, useRef } from 'react';
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

  return (
    <div ref={wrapper} id="smooth-wrapper">
      <div ref={content} id="smooth-content">
        {children}
      </div>
    </div>
  );
}
