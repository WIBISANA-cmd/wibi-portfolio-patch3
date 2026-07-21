import Reveal from '../components/Reveal';
import SplitReveal from '../components/SplitReveal';
import ParallaxMedia from '../components/ParallaxMedia';
import { imageUrl } from '../lib/sanity.client';
import type { HeroData } from '../lib/sanity.types';

export default function HeroSection({ data }: { data: HeroData }) {
  const eyebrow = data.eyebrow ?? '';
  const heading = data.headline ?? '';
  const subheadline = data.subheadline ?? '';
  const bgUrl = imageUrl(data.backgroundImage, 1920);
  const bgAlt = data.backgroundImage?.alt || 'Background';
  const ctaLabel = data.ctaLabel ?? '';
  const ctaHref = data.ctaHref ?? '';

  return (
    <section className="relative h-screen flex flex-col justify-center overflow-hidden">
      {/* Background layer */}
      {bgUrl && (
        <div className="absolute inset-0 z-0 opacity-40">
          <ParallaxMedia
            src={bgUrl}
            alt={bgAlt}
            className="w-full h-full"
            speed={0.15}
            imageClassName="grayscale"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 w-full max-w-7xl mx-auto flex flex-col">
        {eyebrow && (
          <Reveal delay={0.2} yOffset={20}>
            <p className="text-muted uppercase tracking-widest text-sm md:text-base mb-4 md:mb-6 font-medium">
              {eyebrow}
            </p>
          </Reveal>
        )}

        <SplitReveal
          as="h1"
          text={heading}
          type="chars"
          delay={0.4}
          stagger={0.03}
          className="hero-heading font-display font-black uppercase tracking-tighter leading-[0.9] text-[13vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw]"
        />

        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-start sm:items-end justify-between max-w-4xl gap-8">
          {subheadline && (
            <Reveal delay={1.2} yOffset={20}>
              <p className="text-ink-2 font-body text-lg md:text-xl lg:text-2xl max-w-md leading-relaxed">
                {subheadline}
              </p>
            </Reveal>
          )}

          {ctaLabel && ctaHref && (
            <Reveal delay={1.4} yOffset={20}>
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center bg-ink-strong text-bg px-8 py-4 rounded-xl font-medium text-lg hover:bg-ink transition-colors whitespace-nowrap"
              >
                {ctaLabel}
              </a>
            </Reveal>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <Reveal delay={2.0} yOffset={0} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-muted text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-line overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-ink-2 animate-bounce origin-top" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
