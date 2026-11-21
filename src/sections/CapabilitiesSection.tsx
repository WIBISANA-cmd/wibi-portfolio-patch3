import type { LucideIcon } from 'lucide-react';
import { Code2, Database, Layers, Lightbulb, Monitor, PenTool, Rocket, Search, Send, Server } from 'lucide-react';
import Reveal from '../components/Reveal';
import { Sparkle } from '../components/ui';
import { useLanguage } from '../lib/i18n';
import type { CVData, QuoteData, ServicesData, SkillDoc, SkillsData } from '../lib/sanity.types';

const ICONS: Record<string, LucideIcon> = {
  search: Search,
  idea: Lightbulb,
  design: PenTool,
  code: Code2,
  launch: Send,
  layers: Layers,
  server: Server,
  database: Database,
  monitor: Monitor,
  rocket: Rocket,
};
/** Used, in order, for steps that have no icon chosen in the Studio. */
const DEFAULT_ICONS = [Search, Lightbulb, PenTool, Code2, Send];

function ColumnTitle({ children }: { children: string }) {
  return (
    <h2 className="font-section-title font-bold uppercase tracking-tight text-ink text-xl sm:text-2xl leading-none mb-7 sm:mb-8">
      {children}
    </h2>
  );
}

function SubLabel({ children }: { children: string }) {
  return <h3 className="font-section-subtitle text-sm font-bold uppercase tracking-[0.04em] text-accent-text mb-4">{children}</h3>;
}

function sortSkills(skills: SkillDoc[]) {
  // Keep categories together (in first-seen order), then by order inside each.
  const firstSeen = new Map<string, number>();
  skills.forEach((s, i) => !firstSeen.has(s.category) && firstSeen.set(s.category, i));
  return [...skills].sort(
    (a, b) =>
      (firstSeen.get(a.category) ?? 0) - (firstSeen.get(b.category) ?? 0) || (a.order ?? 99) - (b.order ?? 99)
  );
}

function EducationSkills({ skills, cv }: { skills: SkillsData; cv?: CVData }) {
  const { t } = useLanguage();
  const education = [
    ...(cv?.education ?? []).map((e) => ({ title: e.degree, org: e.institution, year: e.year, note: e.description })),
    ...(cv?.certifications ?? []).map((c) => ({ title: c.name, org: c.issuer, year: c.year, note: undefined })),
  ].filter((e) => e.title);
  const skillList = sortSkills(skills.skills ?? []);

  if (education.length === 0 && skillList.length === 0) return null;

  return (
    <div className="py-12 lg:py-16 lg:pr-10">
      <ColumnTitle>{skills.heading || t('Skills & Expertise')}</ColumnTitle>

      {education.length > 0 && (
        <div className="pb-7 mb-7 border-b border-accent-line">
          {skills.educationHeading && <SubLabel>{skills.educationHeading}</SubLabel>}
          <ul className="flex flex-col gap-5 font-education-text">
            {education.map((e, i) => (
              <li key={i} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink leading-snug">{e.title}</p>
                  {e.org && <p className="text-[0.8rem] text-muted mt-0.5">{e.org}</p>}
                  {e.note && <p className="text-[0.8rem] text-muted mt-1 leading-relaxed">{e.note}</p>}
                </div>
                {e.year && <span className="text-xs font-medium text-accent-text whitespace-nowrap pt-0.5">{e.year}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {skillList.length > 0 && (
        <div>
          {skills.skillsHeading && <SubLabel>{skills.skillsHeading}</SubLabel>}
          <ul className="flex flex-wrap gap-2 font-skill-tag">
            {skillList.map((s) => (
              <li
                key={s._id}
                title={s.category}
                className="px-3 py-2 border border-line rounded-md text-[10.5px] font-medium uppercase tracking-[0.04em] text-ink-2 hover:border-accent-line hover:text-accent-text transition-colors"
              >
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Process({ data }: { data: ServicesData }) {
  const { t } = useLanguage();
  const steps = data.services ?? [];
  if (steps.length === 0) return null;

  return (
    <div id="services" className="py-12 lg:py-16 lg:px-10 border-t lg:border-t-0 lg:border-l border-accent-line">
      <ColumnTitle>{data.heading || t('Services')}</ColumnTitle>
      <ol className="relative flex flex-col gap-7">
        {steps.map((step, i) => {
          const Icon = (step.icon && ICONS[step.icon]) || DEFAULT_ICONS[i % DEFAULT_ICONS.length];
          const num = String(step.orderNumber ?? i + 1).padStart(2, '0');
          const isLast = i === steps.length - 1;
          return (
            <li key={step._id} className="relative grid grid-cols-[2.25rem_3rem_1fr] sm:grid-cols-[2.75rem_3rem_1fr] gap-x-4">
              <span className="font-service-number text-2xl leading-none text-accent-text pt-3">{num}</span>
              <span className="relative flex justify-center items-start">
                <span className="relative z-10 w-12 h-12 rounded-full border border-accent-line bg-bg inline-flex items-center justify-center text-ink">
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} aria-hidden="true" />
                </span>
                {!isLast && (
                  <span aria-hidden="true" className="absolute top-12 -bottom-7 left-1/2 w-px -translate-x-1/2 bg-accent-line" />
                )}
              </span>
              <div className="pt-1.5 min-w-0">
                <h3 className="font-service-title text-sm font-bold uppercase tracking-[0.02em] text-accent-text leading-snug">{step.title}</h3>
                <p className="font-service-text mt-1 text-[0.8rem] text-ink-2 leading-relaxed">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function QuotePanel({ data }: { data: QuoteData }) {
  if (!data.text) return null;
  return (
    <aside className="accent-panel relative flex flex-col justify-between gap-10 px-7 sm:px-9 py-12 lg:py-16 min-h-[22rem] -mx-4 sm:mx-0">
      <div>
        <svg viewBox="0 0 48 36" aria-hidden="true" className="w-11 h-auto mb-8 opacity-90" fill="currentColor">
          <path d="M0 36V21.6C0 9.6 6 2.4 18 0l2.4 4.8C13.6 6.8 10.4 10.8 10 16.8h9.2V36H0Zm28 0V21.6C28 9.6 34 2.4 46 0l2.4 4.8c-6.8 2-10 6-10.4 12h9.2V36H28Z" />
        </svg>
        <blockquote className="font-quote-text text-xl sm:text-[1.4rem] leading-snug font-normal whitespace-pre-line max-w-[16rem]">
          {data.text}
        </blockquote>
        {data.signature && <p className="font-quote-signature text-5xl leading-none mt-8 -rotate-[4deg]">{data.signature}</p>}
      </div>
      {(data.footnote || data.signature) && (
        <div>
          {data.footnote && (
            <p className="font-quote-footnote text-xs font-medium uppercase tracking-[0.06em] leading-relaxed max-w-[12rem]">{data.footnote}</p>
          )}
          <Sparkle className="w-4 h-4 mt-4" />
        </div>
      )}
    </aside>
  );
}

export default function CapabilitiesSection({
  skills,
  services,
  quote,
  cv,
}: {
  skills: SkillsData;
  services: ServicesData;
  quote: QuoteData;
  cv?: CVData;
}) {
  const hasQuote = Boolean(quote.text);
  const hasProcess = (services.services ?? []).length > 0;
  const hasSkills = (skills.skills ?? []).length > 0 || (cv?.education ?? []).length > 0;
  if (!hasQuote && !hasProcess && !hasSkills) return null;

  const cols = hasQuote ? 'lg:grid-cols-[1fr_1fr_minmax(16rem,0.62fr)]' : 'lg:grid-cols-2';

  return (
    <section id="skills" className="border-b border-accent-line">
      <div className={`max-w-page mx-auto px-4 sm:px-8 lg:pl-12 ${hasQuote ? 'lg:pr-0' : 'lg:pr-12'}`}>
        <Reveal yOffset={24}>
          <div className={`grid grid-cols-1 ${cols}`}>
            <EducationSkills skills={skills} cv={cv} />
            <Process data={services} />
            <QuotePanel data={quote} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
