import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';
import { imageUrl } from '../lib/sanity.client';
import { IconCircle, Sparkle, normalizeHref } from '../components/ui';
import type { HeroData } from '../lib/sanity.types';

interface HeroSectionProps {
  data: HeroData;
  stats?: { value: string; label: string }[];
  /** Used when the hero has no display name of its own (CV → Full Name). */
  fallbackName?: string;
  ready?: boolean;
}

/** Scale a single-line word so it spans its container's full width. */
function useFitText(text: string | undefined, max = 420) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const el = textRef.current;
    if (!box || !el || !text) return;

    // Text width scales linearly with font-size, so one measurement is enough.
    const fit = () => {
      const current = parseFloat(getComputedStyle(el).fontSize);
      const width = el.scrollWidth;
      if (!current || !width) return;
      setSize(Math.min(max, Math.floor((current * box.clientWidth) / width)));
    };

    fit();
    document.fonts?.ready.then(fit).catch(() => {});
    // The display font may arrive later (Sanity theme fonts load on demand).
    document.fonts?.addEventListener('loadingdone', fit);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => {
      ro.disconnect();
      document.fonts?.removeEventListener('loadingdone', fit);
    };
  }, [text, max]);

  return { boxRef, textRef, size };
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-4 sm:gap-5 py-4 lg:py-5 border-b border-accent-line last:border-b-0">
      <span className="font-hero-stat-number text-4xl sm:text-5xl leading-none text-accent-text tracking-tight min-w-[3.25rem]">
        {value}
      </span>
      <span className="font-hero-stat-label text-[11px] sm:text-xs font-medium uppercase tracking-[0.08em] text-ink-2 leading-snug max-w-[9rem]">
        {label}
      </span>
    </div>
  );
}

export default function HeroSection({ data, stats = [], fallbackName, ready = true }: HeroSectionProps) {
  const word = data.backgroundWord?.trim();
  const greeting = data.headline;
  const name = data.name?.trim() || fallbackName;
  const role = data.eyebrow;
  const intro = data.subheadline;
  const portraitUrl = imageUrl(data.backgroundImage, 1400);
  const portraitAlt = data.backgroundImage?.alt || name || '';
  const ctaHref = data.ctaHref ? normalizeHref(data.ctaHref) : undefined;

  const sectionRef = useRef<HTMLElement>(null);
  const { boxRef, textRef, size } = useFitText(word);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(sectionRef);
        gsap.set(q('[data-hero-word]'), { opacity: 0, yPercent: 12 });
        gsap.set(q('[data-hero-portrait]'), { opacity: 0, y: 40 });
        gsap.set(q('[data-hero-item]'), { opacity: 0, y: 24 });
        if (!ready) return;

        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .to(q('[data-hero-word]'), { opacity: 1, yPercent: 0, duration: 1.2 })
          .to(q('[data-hero-portrait]'), { opacity: 1, y: 0, duration: 1.1 }, '-=0.85')
          .to(q('[data-hero-item]'), { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 }, '-=0.8');
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(sectionRef.current!.querySelectorAll('[data-hero-word],[data-hero-portrait],[data-hero-item]'), {
          opacity: 1,
          y: 0,
          yPercent: 0,
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [ready] }
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label={name || undefined}
      className="relative overflow-hidden border-b border-accent-line"
      style={{ backgroundImage: 'var(--hero-glow)' }}
    >
      <div className="relative max-w-page mx-auto px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24 lg:min-h-[max(100svh,820px)]">
        {/* Background word */}
        {word && (
          <div ref={boxRef} aria-hidden="true" className="relative w-full pointer-events-none select-none" data-hero-word>
            <span
              ref={textRef}
              className="hero-word block w-max mx-auto font-hero-word uppercase leading-[0.82] tracking-[-0.01em] whitespace-nowrap"
              style={{ fontSize: size ? `${size}px` : '22vw', visibility: size ? 'visible' : 'hidden' }}
            >
              {word}
            </span>
          </div>
        )}

        {/* Content — stacked on mobile; on desktop the portrait and both text
            columns are pinned to the bottom of a full-height stage. */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-x-6 lg:absolute lg:inset-x-12 lg:bottom-0 lg:top-20 lg:items-end ${
            word ? '-mt-[14vw] sm:-mt-[12vw] lg:mt-0' : 'pt-8 lg:pt-0'
          }`}
        >
          {/* Portrait */}
          {portraitUrl && (
            <div
              data-hero-portrait
              className="relative z-0 order-1 lg:order-none lg:col-start-4 lg:col-span-6 lg:row-start-1 lg:self-stretch lg:min-h-0 flex justify-center items-end"
            >
              <img
                src={portraitUrl}
                alt={portraitAlt}
                fetchPriority="high"
                className="hero-portrait w-[80%] sm:w-[62%] lg:w-auto lg:max-w-full h-auto lg:h-[88%] object-contain object-bottom"
              />
            </div>
          )}

          {/* Left: greeting, name, role, intro */}
          <div className="relative z-10 order-2 lg:order-none lg:col-start-1 lg:col-span-4 lg:row-start-1 flex flex-col items-start gap-4 sm:gap-5 pt-8 lg:pt-0 pb-10 lg:pb-14">
            {greeting && (
              <p data-hero-item className="font-hero-greeting text-ink text-5xl sm:text-6xl leading-none -rotate-[4deg] -mb-1 lg:-mb-2">
                {greeting}
              </p>
            )}
            {name && (
              <h1
                data-hero-item
                className="font-hero-name uppercase text-ink leading-[0.9] tracking-[-0.005em] text-[3.6rem] sm:text-7xl xl:text-[6.25rem] whitespace-pre-line break-words max-w-full"
              >
                {name}
              </h1>
            )}
            {role && (
              <p data-hero-item className="font-hero-role font-semibold uppercase text-accent-text text-lg sm:text-xl leading-tight max-w-xs">
                {role}
              </p>
            )}
            {intro && (
              <p data-hero-item className="font-hero-intro text-ink-2 text-sm sm:text-[0.95rem] leading-relaxed max-w-sm">
                {intro}
              </p>
            )}
            {data.ctaLabel && ctaHref && (
              <a
                data-hero-item
                href={ctaHref}
                className="group inline-flex items-center gap-3 font-buttons text-xs font-semibold uppercase tracking-[0.12em] text-accent-text"
              >
                <IconCircle size="md" className="group-hover:bg-accent group-hover:text-on-accent group-hover:border-accent">
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </IconCircle>
                {data.ctaLabel}
              </a>
            )}
            {data.locationNote && (
              <p data-hero-item className="inline-flex items-center gap-2.5 font-hero-tagline text-[11px] sm:text-xs font-medium uppercase tracking-[0.1em] text-ink">
                <Globe className="w-4 h-4 text-accent-text" strokeWidth={1.5} aria-hidden="true" />
                {data.locationNote}
              </p>
            )}
          </div>

          {/* Right: tagline + stats */}
          {(data.tagline || stats.length > 0) && (
            <div className="relative z-10 order-3 lg:order-none lg:col-start-10 lg:col-span-3 lg:row-start-1 flex flex-col gap-8 lg:gap-14 pb-10 lg:pb-14">
              {data.tagline && (
                <div data-hero-item className="flex items-center gap-4">
                  <IconCircle size="lg" className="text-accent-text bg-transparent">
                    <Sparkle className="w-5 h-5" />
                  </IconCircle>
                  <p className="font-hero-tagline text-sm text-ink-2 leading-snug max-w-[13rem] whitespace-pre-line">{data.tagline}</p>
                </div>
              )}
              {stats.length > 0 && (
                <div data-hero-item className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 sm:gap-x-6 lg:max-w-[16rem]">
                  {stats.map((s) => (
                    <Stat key={`${s.value}-${s.label}`} value={s.value} label={s.label} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
