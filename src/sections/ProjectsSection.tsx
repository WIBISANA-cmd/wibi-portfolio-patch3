// React imports removed as they are no longer needed
import Reveal from '../components/Reveal';
import ParallaxMedia from '../components/ParallaxMedia';
import { imageUrl } from '../lib/sanity.client';
import type { ProjectsData, ProjectDoc } from '../lib/sanity.types';

function ProjectCard({ project, index }: { project: ProjectDoc; index: number }) {
  const src = imageUrl(project.image, 800);
  const alt = project.image.alt || project.title;

  const speeds = [0.95, 1.05, 1.0];
  const speed = speeds[index % 3];

  return (
    <Reveal delay={index * 0.1} yOffset={30} scale={0.96} className="h-full">
      <div data-speed={speed} className="bg-surface rounded-3xl md:rounded-[2rem] border border-line shadow-sm overflow-hidden flex flex-col h-full group">
        
        {/* Media Container (Top) */}
        {src && (
          <div className="w-full aspect-[4/3] relative overflow-hidden bg-surface-2 border-b border-line">
            <ParallaxMedia
              src={src}
              alt={alt}
              speed={0.1}
              className="w-full h-full"
              imageClassName="grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-105 group-hover:scale-100"
            />
          </div>
        )}

        {/* Info Container (Bottom) */}
        <div className="flex flex-col p-6 sm:p-8 gap-4 flex-grow bg-surface z-10">
          <div className="flex flex-col gap-2">
            <h3 className="font-display font-medium text-2xl md:text-3xl tracking-tight text-ink line-clamp-2">
              {project.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-muted text-xs uppercase tracking-wider font-medium mt-1">
              {project.techstack && project.techstack.length > 0 && (
                <>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techstack.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-surface-2 border border-line text-[10px] lowercase font-mono text-ink/80">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-line" />
                </>
              )}
              <span>{project.year}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 flex-shrink-0">
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center border border-line rounded-full px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-bg transition-colors"
              >
                View Project
              </a>
            ) : (
              <span className="inline-flex w-full items-center justify-center border border-line rounded-full px-5 py-2.5 text-sm font-medium text-muted bg-surface-2">
                Coming Soon
              </span>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function ProjectsSection({ data }: { data: ProjectsData }) {
  const projects = data.projects ?? [];

  if (projects.length === 0) return null;

  // Sort by order
  const sortedProjects = [...projects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <section id="projects" className="py-24 sm:py-32 md:py-40 bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <Reveal yOffset={30} className="mb-10 md:mb-16">
          <h2 className="text-muted font-medium uppercase tracking-widest text-sm md:text-base">
            Selected Projects
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 pb-16 md:pb-24">
          {sortedProjects.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
