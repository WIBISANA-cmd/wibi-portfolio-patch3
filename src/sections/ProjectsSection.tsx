import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import { ArrowAction, Container, SectionHeader } from '../components/ui';
import { ScrollTrigger } from '../lib/gsap';
import { imageUrl } from '../lib/sanity.client';
import { useLanguage } from '../lib/i18n';
import type { ProjectsData, ProjectDoc } from '../lib/sanity.types';

function ProjectCard({ project, index }: { project: ProjectDoc; index: number }) {
  const src = imageUrl(project.image, 900);
  const alt = project.image?.alt || project.title;
  const subtitle = project.category || project.techstack?.slice(0, 3).join(' · ');
  const number = String(index + 1).padStart(2, '0');
  const stack = project.techstack ?? [];
  const hasOverlay = Boolean(project.description) || (project.category && stack.length > 0);

  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden border border-line bg-surface-2 group-hover:border-accent-line transition-colors">
        {src && (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        {hasOverlay && (
          <div className="font-project-meta absolute inset-0 flex flex-col justify-end gap-3 p-4 sm:p-5 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
            {project.description && <p className="text-xs sm:text-sm leading-relaxed line-clamp-3">{project.description}</p>}
            {project.category && stack.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {stack.map((tech) => (
                  <li key={tech} className="px-2 py-0.5 border border-white/40 fs-[10px] uppercase tracking-wider">
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 pt-4">
        <span className="font-project-number text-4xl sm:fs-[2.6rem] leading-none text-accent-text">{number}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-project-title text-sm sm:fs-[0.95rem] font-semibold uppercase tracking-tight text-ink leading-tight line-clamp-2">
            {project.title}
          </h3>
          {subtitle && (
            <p className="font-project-meta mt-1 fs-[11px] sm:text-xs uppercase tracking-[0.06em] text-muted truncate">{subtitle}</p>
          )}
        </div>
        {project.url && (
          <ArrowRight
            aria-hidden="true"
            className="w-6 h-6 shrink-0 text-ink transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent-text"
            strokeWidth={1.25}
          />
        )}
      </div>
    </>
  );

  return (
    <Reveal delay={(index % 3) * 0.08} yOffset={24} className="h-full">
      {project.url ? (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="group block h-full focus-visible:outline-offset-4">
          {body}
        </a>
      ) : (
        <div className="group h-full">{body}</div>
      )}
    </Reveal>
  );
}

export default function ProjectsSection({ data }: { data: ProjectsData }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const projects = data.projects ?? [];

  // Card heights change the page length — let ScrollTrigger re-measure.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [expanded]);

  if (projects.length === 0) return null;

  const sorted = [...projects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const featured = Math.max(1, data.featuredCount ?? 3);
  const visible = expanded ? sorted : sorted.slice(0, featured);
  const canExpand = sorted.length > featured;

  const viewAll = data.viewAllLabel || t('View all projects');
  const showLess = data.showLessLabel || t('Show less');

  return (
    <section id="projects" className="py-14 sm:py-20 border-b border-accent-line">
      <Container>
        <SectionHeader
          title={data.heading || t('Selected Projects')}
          action={
            canExpand ? (
              <ArrowAction
                label={expanded ? showLess : `${viewAll} (${sorted.length})`}
                expanded={expanded}
                onClick={() => setExpanded((v) => !v)}
              />
            ) : undefined
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-y-12">
          {visible.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
