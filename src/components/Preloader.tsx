import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import type { PreloaderData } from '../lib/sanity.types';

interface PreloaderProps {
  data?: PreloaderData;
  onComplete: () => void;
}

export default function Preloader({ data, onComplete }: PreloaderProps) {
  const container = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);

  const wordmark = data?.wordmark || 'WIBISANA';
  const durationMs = data?.durationMs ?? 2000;

  useGSAP(() => {
    // Lock scrolling
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const tl = gsap.timeline({
      onComplete: () => {
        html.style.overflow = prevOverflow;
        onComplete();
      },
    });

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Counter tween
      const counter = { val: 0 };
      tl.to(counter, {
        val: 100,
        duration: durationMs / 1000,
        ease: 'power1.inOut',
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.innerText = String(Math.round(counter.val)).padStart(2, '0');
          }
        },
      });

      // 2. Small delay at 100%
      tl.to({}, { duration: 0.3 });

      // 3. Slide up exit
      tl.to(container.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      // Just delay and complete instantly
      tl.to({}, { duration: 0.1 });
    });

    return () => {
      html.style.overflow = prevOverflow;
    };
  }, { scope: container });

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg text-ink overflow-hidden"
    >
      <div className="relative overflow-hidden px-6">
        <h2
          ref={wordRef}
          className="preloader-word text-center font-display font-black uppercase tracking-tight leading-none text-[12vw] sm:text-[9vw] md:text-[7vw]"
        >
          {wordmark}
        </h2>
      </div>

      <span
        ref={countRef}
        className="mt-6 font-light tabular-nums tracking-[0.35em] text-sm sm:text-base text-muted"
      >
        00
      </span>
      <span className="font-light tracking-widest text-xs text-muted">%</span>
    </div>
  );
}
