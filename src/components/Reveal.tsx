import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  stagger?: number;
  scale?: number;
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  yOffset = 30,
  duration = 0.8,
  stagger = 0,
  scale = 1,
}: RevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect reduced motion
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(container.current, {
          y: yOffset,
          scale: scale,
          opacity: 0,
          duration: duration,
          delay: delay,
          stagger: stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(container.current, { opacity: 1, y: 0, scale: 1 });
      });

      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  );
}
