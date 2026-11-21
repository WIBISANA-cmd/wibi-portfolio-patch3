import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { imageUrl } from '../lib/sanity.client';
import type { MarqueeData } from '../lib/sanity.types';

/** Endless strip of work screenshots between sections. */
export default function MarqueeSection({ data }: { data: MarqueeData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const items = (data.items ?? [])
    .filter((item) => item.image)
    .map((item) => ({
      id: item._id,
      src: imageUrl(item.image, 720),
      alt: item.image.alt || item.label || '',
    }));

  useGSAP(
    () => {
      if (!rowRef.current || items.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const width = rowRef.current!.scrollWidth / 3;
        const tween = gsap.to(rowRef.current, { x: -width, duration: 40, ease: 'none', repeat: -1 });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const boost = gsap.utils.clamp(0, 3, Math.abs(self.getVelocity()) / 600);
            gsap.to(tween, {
              timeScale: 1 + boost,
              duration: 0.4,
              overwrite: true,
              onComplete: () => {
                gsap.to(tween, { timeScale: 1, duration: 1 });
              },
            });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [items.length] }
  );

  if (items.length === 0) return null;
  const loop = [...items, ...items, ...items];

  return (
    <section ref={sectionRef} aria-label="Work gallery" className="py-8 sm:py-10 overflow-hidden border-b border-accent-line">
      <div ref={rowRef} className="flex w-max">
        {loop.map((item, i) => (
          <div key={`${item.id}-${i}`} className="px-2 sm:px-3" aria-hidden={i >= items.length || undefined}>
            <img
              src={item.src}
              alt={i < items.length ? item.alt : ''}
              loading="lazy"
              className="w-56 sm:w-72 md:w-[340px] aspect-[16/10] object-cover border border-line grayscale hover:grayscale-0 transition-[filter] duration-500"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
