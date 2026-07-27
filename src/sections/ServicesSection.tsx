import Reveal from '../components/Reveal';
import { useLanguage } from '../lib/i18n';
import type { ServicesData } from '../lib/sanity.types';

export default function ServicesSection({ data }: { data: ServicesData }) {
  const { t } = useLanguage();
  const services = data.services ?? [];

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-24 sm:py-32 md:py-40 bg-surface text-ink">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal yOffset={30}>
          <h2 className="text-muted font-medium uppercase tracking-widest text-sm md:text-base mb-12 sm:mb-20" data-speed="1.1">
            {t('Services')}
          </h2>
        </Reveal>

        <div className="flex flex-col border-t border-line">
          {services.map((service, index) => {
            const numStr = service.orderNumber != null 
              ? String(service.orderNumber).padStart(2, '0') 
              : String(index + 1).padStart(2, '0');
            
            // slight stagger for services parallax
            const speed = 1 + (index * 0.02);

            return (
              <Reveal key={service._id} delay={0} yOffset={40} duration={0.8}>
                <div className="group flex flex-col md:flex-row items-start md:items-center py-8 sm:py-12 border-b border-line gap-6 sm:gap-12 relative overflow-hidden" data-speed={speed}>
                  
                  {/* Number */}
                  <span className="font-display font-light text-2xl sm:text-3xl text-muted md:w-16 flex-shrink-0">
                    {numStr}
                  </span>
                  
                  {/* Title & Description */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4 sm:gap-8">
                    <h3 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight transition-transform duration-500 group-hover:translate-x-2">
                      {service.title}
                    </h3>
                    
                    <p className="text-ink-2 font-body text-base sm:text-lg max-w-md md:text-right leading-relaxed transition-opacity duration-500">
                      {service.description}
                    </p>
                  </div>

                  {/* Optional Hover Image (Desktop only) */}
                  {/* Implementing this as a pure CSS hover effect for simplicity if an image is provided */}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
