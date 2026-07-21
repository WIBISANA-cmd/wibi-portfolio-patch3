import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../lib/gsap';

interface SplitRevealProps {
  text: string;
  className?: string;
  type?: 'lines' | 'words' | 'chars';
  delay?: number;
  duration?: number;
  stagger?: number;
  yOffset?: number;
  as?: React.ElementType;
}

export default function SplitReveal({
  text,
  className = '',
  type = 'lines',
  delay = 0,
  duration = 0.8,
  stagger = 0.05,
  yOffset = 40,
  as: Component = 'div',
}: SplitRevealProps) {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!container.current) return;

        // Split the text
        const split = new SplitText(container.current, {
          type: type,
          linesClass: 'split-line',
          wordsClass: 'split-word',
          charsClass: 'split-char',
        });

        // Add overflow hidden to lines if we are splitting by lines or words to allow mask reveal
        if (type === 'lines' || type === 'words') {
          split.lines.forEach((line) => {
             const wrapper = document.createElement('div');
             wrapper.style.overflow = 'hidden';
             line.parentNode?.insertBefore(wrapper, line);
             wrapper.appendChild(line);
          });
        }

        const targets = split[type];

        gsap.from(targets, {
          y: yOffset,
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

        return () => split.revert();
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(container.current, { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <Component ref={container} className={className} aria-label={text}>
      {text}
    </Component>
  );
}
