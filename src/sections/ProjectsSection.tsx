import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import Reveal from '../components/Reveal';
import ParallaxMedia from '../components/ParallaxMedia';
import { imageUrl } from '../lib/sanity.client';
import type { ProjectsData, ProjectDoc } from '../lib/sanity.types';

function ProjectCard({ project, index, total }: { project: ProjectDoc; index: number; total: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const src = imageUrl(project.image, 1280);
  const alt = project.image.alt || project.title;

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Stack effect: scale down slightly as it reaches the top, based on its index relative to total
      // But a simpler stack is just stick position which we use sticky for.
      // We can add a slight scale down when the *next* card covers it.
      
      const targetScale = 1 - ((total - 1 - index) * 0.02);
      
      gsap.to(cardRef.current, {
        scale: targetScale,
        opacity: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 15%',
          end: `+=${window.innerHeight}`,
          scrub: true,
        }
      });
    });

    return () => mm.revert();
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className="sticky top-24 md:top-32 w-full flex flex-col pt-8 md:pt-12"
      style={{ zIndex: index, transformOrigin: 'top center' }}
    >
      <div className="bg-surface rounded-3xl md:rounded-[40px] border border-line shadow-sm overflow-hidden flex flex-col relative group">
        
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 md:p-10 gap-4 sm:gap-8 bg-surface z-10">
          <div className="flex flex-col gap-1">
            <h3 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink">
              {project.title}
            </h3>
            <div className="flex items-center gap-3 text-muted text-sm uppercase tracking-wider font-medium mt-2">
              <span>{project.category}</span>
              <span className="w-1 h-1 rounded-full bg-line" />
              <span>{project.year}</span>
            </div>
          </div>

          <div className="flex-shrink-0 mt-4 sm:mt-0">
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-line rounded-full px-6 py-3 font-medium text-ink hover:bg-ink hover:text-bg transition-colors"
              >
                View Project
              </a>
            ) : (
              <span className="inline-flex items-center justify-center border border-line rounded-full px-6 py-3 font-medium text-muted bg-surface-2">
                Coming Soon
              </span>
            )}
          </div>
        </div>

        {/* Media Container */}
        {src && (
          <div className="w-full aspect-[4/3] md:aspect-[16/9] relative overflow-hidden bg-surface-2 border-t border-line">
            <ParallaxMedia
              src={src}
              alt={alt}
              speed={0.15}
              className="w-full h-full"
              imageClassName="grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-105 group-hover:scale-100"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectsSection({ data }: { data: ProjectsData }) {
  const projects = data.projects ?? [];

  if (projects.length === 0) return null;

  // Sort by order
  const sortedProjects = [...projects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <section id="projects" className="py-24 sm:py-32 md:py-40 bg-surface">
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative">
        <Reveal yOffset={30} className="mb-12 md:mb-20">
          <h2 className="text-muted font-medium uppercase tracking-widest text-sm md:text-base">
            Selected Projects
          </h2>
        </Reveal>

        <div className="flex flex-col relative pb-32">
          {sortedProjects.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} total={sortedProjects.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
