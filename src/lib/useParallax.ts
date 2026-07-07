import { type RefObject } from 'react';
import {
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

/**
 * Shared spring config — wrapping every parallax transform in this makes the
 * motion feel damped/organic and keeps drifting smoothly after the wheel stops.
 */
export const PARALLAX_SPRING = {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
} as const;

/**
 * Scroll progress (0 → 1) for a section as it travels through the viewport.
 * `offset: ['start end', 'end start']` means:
 *   0   → section's top just enters from the bottom of the viewport
 *   0.5 → section is centered in the viewport (natural "neutral" point)
 *   1   → section's bottom just leaves past the top of the viewport
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement | null>
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  return scrollYProgress;
}

/**
 * Maps a scroll progress value to a spring-damped translate range.
 * Using symmetric ranges (e.g. `from = 60, to = -60`) keeps the element at its
 * natural position when the section is centered, so nothing looks pre-shifted.
 */
export function useParallax(
  progress: MotionValue<number>,
  from: number,
  to: number
): MotionValue<number> {
  const raw = useTransform(progress, [0, 1], [from, to]);
  return useSpring(raw, PARALLAX_SPRING);
}
