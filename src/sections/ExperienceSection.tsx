import Reveal from '../components/Reveal';
import { Container, SectionHeader } from '../components/ui';
import type { ExperiencesData } from '../lib/sanity.types';

export default function ExperienceSection({ data }: { data: ExperiencesData }) {
  const experiences = data.experiences ?? [];
  if (experiences.length === 0) return null;

  const sorted = [...experiences].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <section id="experience" className="py-14 sm:py-20 border-b border-accent-line">
      <Container>
        <SectionHeader title={data.heading} />
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-accent-line border border-accent-line">
          {sorted.map((exp, i) => (
            <li key={exp._id} className="bg-bg">
              <Reveal yOffset={20} delay={(i % 3) * 0.06} className="h-full">
                <article className="font-experience-text h-full flex flex-col gap-3 p-6 sm:p-7 hover:bg-surface transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-experience-number text-4xl leading-none text-accent-text">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-medium text-accent-text text-right pt-1">{exp.duration}</span>
                  </div>
                  <h3 className="font-experience-role mt-2 text-base font-bold uppercase tracking-tight text-ink leading-snug">{exp.role}</h3>
                  <p className="text-sm text-muted">{exp.company}</p>
                  {exp.description && <p className="fs-[0.85rem] text-ink-2 leading-relaxed">{exp.description}</p>}
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
