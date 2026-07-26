import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import Reveal from '../components/Reveal';
import type { SkillsData, SkillDoc } from '../lib/sanity.types';

/** Group skills by category and sort within each group. */
function groupByCategory(skills: SkillDoc[]): { category: string; items: SkillDoc[] }[] {
  const map = new Map<string, SkillDoc[]>();
  for (const s of skills) {
    const cat = s.category || 'Other';
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(s);
  }
  return Array.from(map.entries())
    .map(([category, items]) => ({
      category,
      items: items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)),
    }))
    .sort((a, b) => (a.items[0]?.order ?? 99) - (b.items[0]?.order ?? 99));
}

function SkillBar({ skill, index }: { skill: SkillDoc; index: number }) {
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!barRef.current || !skill.proficiency) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          barRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power3.out',
            delay: index * 0.05,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(barRef.current, { scaleX: 1 });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-ink font-body text-sm sm:text-base font-medium group-hover:text-ink transition-colors">
          {skill.name}
        </span>
        {skill.proficiency != null && (
          <span className="text-muted text-xs font-mono">{skill.proficiency}%</span>
        )}
      </div>
      {skill.proficiency != null && (
        <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
          <div
            ref={barRef}
            className="h-full rounded-full origin-left"
            style={{
              width: `${skill.proficiency}%`,
              background: 'linear-gradient(90deg, var(--ink) 0%, var(--ink-2) 100%)',
              transformOrigin: 'left center',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function SkillsSection({ data }: { data: SkillsData }) {
  const skills = data.skills ?? [];

  if (skills.length === 0) return null;

  const groups = groupByCategory(skills);

  return (
    <section id="skills" className="py-24 sm:py-32 md:py-40 bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal yOffset={30}>
          <h2 className="text-muted font-medium uppercase tracking-widest text-sm md:text-base mb-12 sm:mb-20" data-speed="1.1">
            {data.heading || 'Skills & Expertise'}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {groups.map((group) => (
            <Reveal key={group.category} yOffset={30} duration={0.8}>
              <div className="flex flex-col gap-6">
                <h3 className="font-display font-medium text-xl sm:text-2xl tracking-tight text-ink border-b border-line pb-3">
                  {group.category}
                </h3>
                <div className="flex flex-col gap-5">
                  {group.items.map((skill, i) => (
                    <SkillBar key={skill._id} skill={skill} index={i} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
