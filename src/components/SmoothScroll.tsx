import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { frame, cancelFrame } from 'framer-motion';

/**
 * Global smooth-scroll provider.
 *
 * Lenis replaces the browser's stiff native scroll with an inertia/damped feel.
 * We drive Lenis from Framer Motion's own `frame` loop (instead of a separate
 * requestAnimationFrame) so both share one clock — this keeps every `useScroll`
 * reading in the sections perfectly in sync with the smoothed scroll position.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const update = (data: { timestamp: number }) => {
      lenis.raf(data.timestamp);
    };

    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
