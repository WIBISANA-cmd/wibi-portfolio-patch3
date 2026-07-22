import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import Reveal from '../components/Reveal';
import SplitReveal from '../components/SplitReveal';
import ParallaxMedia from '../components/ParallaxMedia';
import { imageUrl } from '../lib/sanity.client';
import type { AboutData } from '../lib/sanity.types';

function StatCounter({ value, label }: { value: string; label: string }) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // If the value ends with a +, extract the number part
  const numericPart = parseInt(value.replace(/\D/g, ''), 10);
  const suffix = value.replace(/[0-9]/g, '');

  useGSAP(() => {
    if (isNaN(numericPart)) return;
    
    const mm = gsap.matchMedia();
    
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const counter = { val: 0 };
      
      gsap.to(counter, {
        val: numericPart,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.innerText = String(Math.round(counter.val));
          }
        },
      });
    });
    
    mm.add('(prefers-reduced-motion: reduce)', () => {
      if (numberRef.current) numberRef.current.innerText = String(numericPart);
    });
    
    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col gap-1 border-l border-line pl-4">
      <div className="font-display font-light text-4xl md:text-5xl tracking-tighter text-ink">
        {isNaN(numericPart) ? (
          value
        ) : (
          <>
            <span ref={numberRef}>0</span>
            {suffix}
          </>
        )}
      </div>
      <div className="text-muted text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function AboutSection({ data }: { data: AboutData }) {
  const heading = data.heading ?? '';
  const body = data.body ?? '';
  const mediaUrl = imageUrl(data.image, 800);
  const mediaAlt = data.image?.alt || 'About media';
  const stats = data.stats ?? [];

  return (
    <section id="about" className="py-24 sm:py-32 md:py-40 bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Text */}
          <div className="lg:col-span-7 flex flex-col gap-8 md:gap-12" data-speed="1.05">
            <Reveal yOffset={20}>
              <h2 className="text-muted font-medium uppercase tracking-widest text-sm md:text-base" data-lag="0.1">
                {heading}
              </h2>
            </Reveal>

            <SplitReveal
              text={body}
              type="lines"
              as="p"
              stagger={0.05}
              duration={1}
              yOffset={40}
              className="text-ink-2 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.2] tracking-tight"
            />
            
            {stats.length > 0 && (
              <Reveal delay={0.4} yOffset={30} className="mt-8 pt-8 border-t border-line grid grid-cols-2 sm:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                  <StatCounter key={i} value={stat.value} label={stat.label} />
                ))}
              </Reveal>
            )}
          </div>

          {/* Right Column: Media */}
          {mediaUrl && (
            <div className="lg:col-span-5 w-full mt-12 lg:mt-0 lg:pt-16" data-speed="0.95">
              <Reveal yOffset={40} duration={1.2} scale={0.94}>
                <div className="rounded-2xl overflow-hidden bg-surface-2 aspect-[4/5] w-full">
                  <ParallaxMedia
                    src={mediaUrl}
                    alt={mediaAlt}
                    speed={0.1}
                    className="w-full h-full"
                    imageClassName="grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                </div>
              </Reveal>
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}
