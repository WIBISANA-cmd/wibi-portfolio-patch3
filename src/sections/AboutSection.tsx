import { useRef } from 'react';
import { motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';
import { imageUrl } from '../lib/sanity.client';
import { useSectionProgress, useParallax } from '../lib/useParallax';
import type { AboutData } from '../lib/sanity.types';

export default function AboutSection({ data }: { data: AboutData }) {
  const title = data.title ?? '';
  const paragraph = data.paragraph ?? '';
  const moon = imageUrl(data.moonIcon, 420);
  const lego = imageUrl(data.legoIcon, 420);
  const object1 = imageUrl(data.object1, 360);
  const group1 = imageUrl(data.group1, 440);

  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(sectionRef);
  // Each corner floats at a different speed AND direction so the four 3D props
  // feel like they drift independently in space as you scroll.
  const moonY = useParallax(progress, -50, 50); // top-left: slow, drifts down
  const legoY = useParallax(progress, 40, -40); // top-right: slow, drifts up
  const objectY = useParallax(progress, -110, 110); // bottom-left: fast, down
  const groupY = useParallax(progress, 140, -140); // bottom-right: fastest, up

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20"
      style={{ background: '#0C0C0C', overflowX: 'clip' }}
    >
      {/* Decorative corner images */}
      {moon && (
        <FadeIn
          delay={0.1}
          duration={0.9}
          x={-80}
          y={0}
          className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none"
        >
          <motion.img src={moon} alt="" className="w-full" style={{ y: moonY }} />
        </FadeIn>
      )}
      {lego && (
        <FadeIn
          delay={0.15}
          duration={0.9}
          x={80}
          y={0}
          className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none"
        >
          <motion.img src={lego} alt="" className="w-full" style={{ y: legoY }} />
        </FadeIn>
      )}
      {object1 && (
        <FadeIn
          delay={0.25}
          duration={0.9}
          x={-80}
          y={0}
          className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] pointer-events-none"
        >
          <motion.img src={object1} alt="" className="w-full" style={{ y: objectY }} />
        </FadeIn>
      )}
      {group1 && (
        <FadeIn
          delay={0.3}
          duration={0.9}
          x={80}
          y={0}
          className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] pointer-events-none"
        >
          <motion.img src={group1} alt="" className="w-full" style={{ y: groupY }} />
        </FadeIn>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn
            as="h2"
            delay={0}
            y={40}
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            {title}
          </FadeIn>

          <AnimatedText
            text={paragraph}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>

        <FadeIn delay={0.1} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
