import { useRef } from 'react';
import { motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import { useSectionProgress, useParallax } from '../lib/useParallax';
import type { ServicesData, ServiceDoc } from '../lib/sanity.types';

function ServiceRow({ service, index }: { service: ServiceDoc; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useSectionProgress(ref);
  // Subtle reveal drift — the row eases upward as it passes through view.
  const y = useParallax(progress, 60, -60);

  return (
    <div ref={ref} style={{ borderTop: '1px solid rgba(12, 12, 12, 0.15)' }}>
      <FadeIn delay={index * 0.1}>
        <motion.div
          style={{ y }}
          className="flex items-start gap-6 sm:gap-10 py-8 sm:py-10 md:py-12"
        >
          <span
            className="font-black flex-shrink-0"
            style={{ color: '#0C0C0C', fontSize: 'clamp(3rem, 10vw, 140px)', lineHeight: 1 }}
          >
            {service.number}
          </span>
          <div className="flex flex-col gap-3 pt-1">
            <h3
              className="font-medium uppercase"
              style={{ color: '#0C0C0C', fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
            >
              {service.name}
            </h3>
            <p
              className="font-light leading-relaxed max-w-2xl"
              style={{ color: '#0C0C0C', opacity: 0.6, fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
            >
              {service.description}
            </p>
          </div>
        </motion.div>
      </FadeIn>
    </div>
  );
}

export default function ServicesSection({ data }: { data: ServicesData }) {
  const title = data.title ?? '';
  const services = data.items ?? [];

  return (
    <section
      id="price"
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: '#FFFFFF' }}
    >
      <h2
        className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ color: '#0C0C0C', fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        {title}
      </h2>

      <div className="max-w-5xl mx-auto">
        {services.map((service, i) => (
          <ServiceRow key={service._id} service={service} index={i} />
        ))}
      </div>
    </section>
  );
}
