import { useRef } from 'react';
import { motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import ContactButton from '../components/ContactButton';
import { imageUrl } from '../lib/sanity.client';
import { useSectionProgress, useParallax } from '../lib/useParallax';
import type { HeroData } from '../lib/sanity.types';

export default function HeroSection({ data }: { data: HeroData }) {
  const navLinks = data.navLinks ?? [];
  const heading = data.heading ?? '';
  const description = data.description ?? '';
  const portraitUrl = imageUrl(data.portrait, 1040);

  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(sectionRef);
  // Heading (background layer) drifts up slowly; portrait (foreground) moves up
  // faster — the speed difference is what reads as depth.
  const headingY = useParallax(progress, -40, 40);
  const portraitY = useParallax(progress, 110, -110);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col"
      style={{ overflowX: 'clip' }}
    >
      {/* Navbar */}
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="relative z-20 flex justify-between px-6 md:px-10 pt-6 md:pt-8"
      >
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] transition-opacity duration-200 hover:opacity-70"
          >
            {link}
          </a>
        ))}
      </FadeIn>

      {/* Heading */}
      <div className="overflow-hidden px-6 md:px-10">
        <FadeIn delay={0.15} y={40}>
          <motion.h1
            style={{ y: headingY }}
            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-5"
          >
            {heading}
          </motion.h1>
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="mt-auto flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          {description}
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* Portrait */}
      {portraitUrl && (
        <FadeIn
          delay={0.6}
          y={30}
          className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
        >
          <motion.div style={{ y: portraitY }}>
            <Magnet
              padding={150}
              strength={3}
              activeTransition="transform 0.3s ease-out"
              inactiveTransition="transform 0.6s ease-in-out"
            >
              <img src={portraitUrl} alt="Portrait" className="w-full" />
            </Magnet>
          </motion.div>
        </FadeIn>
      )}
    </section>
  );
}
