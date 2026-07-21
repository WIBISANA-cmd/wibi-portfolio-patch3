import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { imageUrl } from '../lib/sanity.client';
import type { MarqueeData } from '../lib/sanity.types';

export default function MarqueeSection({ data }: { data: MarqueeData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const items = data.items ?? [];
  const validItems = items
    .filter((item) => item.image)
    .map((item) => ({
      id: item._id,
      src: imageUrl(item.image, 840),
      alt: item.image.alt || item.label || 'Marquee image',
    }));

  if (validItems.length === 0) return null;

  // Split into two rows for visual interest
  const half = Math.ceil(validItems.length / 2);
  const row1Items = validItems.slice(0, half);
  const row2Items = validItems.slice(half);

  // We need enough items to loop seamlessly. We duplicate the items 3 times.
  const row1Content = [...row1Items, ...row1Items, ...row1Items];
  const row2Content = row2Items.length ? [...row2Items, ...row2Items, ...row2Items] : row1Content;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!row1Ref.current || !row2Ref.current) return;

        const row1Width = row1Ref.current.scrollWidth / 3;
        const row2Width = row2Ref.current.scrollWidth / 3;

        // Base tweens
        const tl1 = gsap.to(row1Ref.current, {
          x: -row1Width,
          duration: 30,
          ease: 'none',
          repeat: -1,
        });

        // Row 2 starts offset and moves the other way
        gsap.set(row2Ref.current, { x: -row2Width });
        const tl2 = gsap.to(row2Ref.current, {
          x: 0,
          duration: 35,
          ease: 'none',
          repeat: -1,
        });

        // React to scroll velocity
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            // Nudge timeScale based on velocity (clamped)
            let speedDelta = velocity / 500;
            const clampedDelta = gsap.utils.clamp(-3, 3, speedDelta);
            
            // Apply speed bump
            gsap.to([tl1, tl2], {
              timeScale: 1 + Math.abs(clampedDelta),
              duration: 0.5,
              ease: 'power2.out',
              overwrite: true,
              onComplete: () => {
                // Return to normal speed
                gsap.to([tl1, tl2], { timeScale: 1, duration: 1, ease: 'power2.out' });
              }
            });
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 overflow-hidden bg-bg"
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex w-max" ref={row1Ref}>
          {row1Content.map((item, i) => (
            <div key={`r1-${i}-${item.id}`} className="px-2 sm:px-3">
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-60 sm:w-80 md:w-[420px] aspect-[16/10] object-cover rounded-xl sm:rounded-2xl flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-400 ease-out"
              />
            </div>
          ))}
        </div>
        
        <div className="flex w-max" ref={row2Ref}>
          {row2Content.map((item, i) => (
            <div key={`r2-${i}-${item.id}`} className="px-2 sm:px-3">
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-60 sm:w-80 md:w-[420px] aspect-[16/10] object-cover rounded-xl sm:rounded-2xl flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-400 ease-out"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
