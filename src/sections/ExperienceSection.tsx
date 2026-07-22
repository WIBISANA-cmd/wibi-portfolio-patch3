import Reveal from '../components/Reveal';
import type { ExperiencesData } from '../lib/sanity.types';

export default function ExperienceSection({ data }: { data: ExperiencesData }) {
  const experiences = data.experiences ?? [];

  if (experiences.length === 0) return null;

  // Sort by order
  const sortedExperiences = [...experiences].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <section id="experience" className="py-24 sm:py-32 md:py-40 bg-bg text-ink">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal yOffset={30}>
          <h2 className="text-muted font-medium uppercase tracking-widest text-sm md:text-base mb-12 sm:mb-20" data-speed="1.1">
            {data.heading || 'Work Experience'}
          </h2>
        </Reveal>

        <div className="flex flex-col border-t border-line">
          {sortedExperiences.map((exp, index) => {
            const speed = 1 + (index * 0.02);

            return (
              <Reveal key={exp._id} delay={0} yOffset={40} duration={0.8}>
                <div className="group flex flex-col md:flex-row items-start py-8 sm:py-12 border-b border-line gap-4 sm:gap-8 lg:gap-12 relative overflow-hidden" data-speed={speed}>
                  
                  {/* Duration */}
                  <div className="md:w-1/4 lg:w-1/5 flex-shrink-0 pt-1 md:pt-2">
                    <span className="font-display font-light text-xl sm:text-2xl text-muted group-hover:text-ink transition-colors duration-500">
                      {exp.duration}
                    </span>
                  </div>
                  
                  {/* Role, Company, Description */}
                  <div className="flex flex-col flex-grow gap-3 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <h3 className="font-display font-medium text-2xl sm:text-3xl md:text-4xl tracking-tight transition-transform duration-500 group-hover:translate-x-2">
                        {exp.role}
                      </h3>
                      <span className="font-body text-lg sm:text-xl text-ink-2">
                        at {exp.company}
                      </span>
                    </div>
                    
                    {exp.description && (
                      <p className="text-ink-2 font-body text-base sm:text-lg max-w-2xl leading-relaxed transition-opacity duration-500 mt-2">
                        {exp.description}
                      </p>
                    )}
                  </div>

                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
