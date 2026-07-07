import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { imageUrl } from '../lib/sanity.client';
import { useSectionProgress, useParallax } from '../lib/useParallax';
import type { MarqueeData } from '../lib/sanity.types';

const tripled = (arr: string[]) => [...arr, ...arr, ...arr];

function Tile({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      className="rounded-2xl object-cover flex-shrink-0"
      style={{ width: 420, height: 270 }}
    />
  );
}

export default function MarqueeSection({ data }: { data: MarqueeData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  // Gentle vertical drift for the whole band, layered on top of the existing
  // horizontal scroll animation, so the section feels like it floats in.
  const progress = useSectionProgress(sectionRef);
  const bandY = useParallax(progress, 80, -80);

  const rowOne = (data.row1 ?? [])
    .map((m) => imageUrl(m.image, 840))
    .filter((url): url is string => Boolean(url));
  const rowTwo = (data.row2 ?? [])
    .map((m) => imageUrl(m.image, 840))
    .filter((url): url is string => Boolean(url));

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const next = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(next);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const rowOneX = offset - 200;
  const rowTwoX = -(offset - 200);

  return (
    <section
      ref={sectionRef}
      className="pt-24 sm:pt-32 md:pt-40 pb-10"
      style={{ background: '#0C0C0C', overflowX: 'clip' }}
    >
      <motion.div className="flex flex-col gap-3" style={{ y: bandY }}>
        {rowOne.length > 0 && (
          <div
            className="flex gap-3 w-max"
            style={{ willChange: 'transform', transform: `translateX(${rowOneX}px)` }}
          >
            {tripled(rowOne).map((src, i) => (
              <Tile key={`r1-${i}`} src={src} />
            ))}
          </div>
        )}
        {rowTwo.length > 0 && (
          <div
            className="flex gap-3 w-max"
            style={{ willChange: 'transform', transform: `translateX(${rowTwoX}px)` }}
          >
            {tripled(rowTwo).map((src, i) => (
              <Tile key={`r2-${i}`} src={src} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
