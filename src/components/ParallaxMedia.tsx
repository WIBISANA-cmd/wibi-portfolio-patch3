import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

interface ParallaxMediaProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  speed?: number; // 0 to 1, where 1 is fastest parallax (default 0.15 for 15% parallax)
}

export default function ParallaxMedia({
  src,
  alt,
  className = '',
  imageClassName = '',
  speed = 0.15,
}: ParallaxMediaProps) {
  const container = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!container.current || !image.current) return;

        // Image needs to be taller than container to parallax inside it
        // We set the y position to start from the top edge relative to its own extra height
        gsap.to(image.current, {
          yPercent: speed * 100, // Move down by speed percentage
          ease: 'none',
          scrollTrigger: {
            trigger: container.current,
            start: 'top bottom', // Start when container top hits viewport bottom
            end: 'bottom top',   // End when container bottom hits viewport top
            scrub: true,
          },
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(image.current, { yPercent: 0 });
      });

      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <div ref={container} className={`relative overflow-hidden ${className}`}>
      <img
        ref={image}
        src={src}
        alt={alt}
        className={`absolute top-0 left-0 w-full h-[120%] object-cover object-center origin-top ${imageClassName}`}
        style={{
          // We start shifted up so that we have room to parallax down.
          // By default it shifts up by the speed percentage of the image height.
          transform: `translateY(-${speed * 50}%)`,
        }}
        loading="lazy"
      />
    </div>
  );
}
