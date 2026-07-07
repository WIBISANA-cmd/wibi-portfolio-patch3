import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LiveProjectButton from '../components/LiveProjectButton';
import { imageUrl } from '../lib/sanity.client';
import { useSectionProgress, useParallax } from '../lib/useParallax';
import type { ProjectsData, ProjectDoc } from '../lib/sanity.types';

/** Shape the card actually renders — image sources already resolved to URLs. */
interface RenderProject {
  id: string;
  number: string;
  category: string;
  name: string;
  link?: string;
  col1: [string?, string?];
  col2?: string;
}

const CARD_RADIUS = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';

/** Convert a CMS project document into the render-ready shape. */
function toRenderProject(doc: ProjectDoc): RenderProject {
  return {
    id: doc._id,
    number: doc.number,
    category: doc.projectType,
    name: doc.title,
    link: doc.linkButton,
    col1: [
      imageUrl(doc.images?.col1_image1, 1280),
      imageUrl(doc.images?.col1_image2, 1280),
    ],
    col2: imageUrl(doc.images?.col2_image, 1280),
  };
}

/**
 * Image tile with an in-frame parallax: the frame (wrapper) stays put while the
 * image drifts slowly inside it. The image is scaled up a touch so the drift
 * never exposes an empty edge. Degrades to a neutral placeholder if src is
 * missing. `wrapperClassName` styles the visible frame (radius / size).
 */
function ParallaxImage({
  src,
  alt,
  wrapperClassName,
  style,
}: {
  src?: string;
  alt: string;
  wrapperClassName: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useSectionProgress(ref);
  const y = useParallax(progress, -22, 22);

  if (!src) {
    return (
      <div ref={ref} className={`${wrapperClassName} bg-[#1a1a1a]`} style={style} aria-hidden />
    );
  }

  return (
    <div ref={ref} className={`${wrapperClassName} overflow-hidden`} style={style}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover"
        style={{ y, scale: 1.2 }}
      />
    </div>
  );
}

function ProjectCard({
  project,
  index,
  totalCards,
}: {
  project: RenderProject;
  index: number;
  totalCards: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="h-[85vh] flex items-start justify-center sticky top-24 md:top-32"
      style={{ top: `${index * 28}px` }}
    >
      <motion.div
        style={{ scale, background: '#0C0C0C' }}
        className={`${CARD_RADIUS} border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8 w-full`}
      >
        {/* Top row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <span
              className="font-black text-[#D7E2EA]"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)', lineHeight: 1 }}
            >
              {project.number}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-[#D7E2EA]/60 font-light uppercase tracking-widest text-xs sm:text-sm">
                {project.category}
              </span>
              <span
                className="text-[#D7E2EA] font-medium uppercase"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {project.name}
              </span>
            </div>
          </div>
          {project.link ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <LiveProjectButton />
            </a>
          ) : (
            <LiveProjectButton />
          )}
        </div>

        {/* Bottom row: image grid */}
        <div className="flex gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4" style={{ width: '40%' }}>
            <ParallaxImage
              src={project.col1[0]}
              alt={`${project.name} preview 1`}
              wrapperClassName={`${CARD_RADIUS} w-full`}
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <ParallaxImage
              src={project.col1[1]}
              alt={`${project.name} preview 2`}
              wrapperClassName={`${CARD_RADIUS} w-full`}
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>
          <div style={{ width: '60%' }}>
            <ParallaxImage
              src={project.col2}
              alt={`${project.name} preview 3`}
              wrapperClassName={`${CARD_RADIUS} w-full h-full`}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection({ data }: { data: ProjectsData }) {
  const title = data.title ?? '';
  const projects: RenderProject[] = (data.items ?? []).map(toRenderProject);

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: '#0C0C0C' }}
    >
      <h2
        className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        {title}
      </h2>

      <div className="max-w-6xl mx-auto">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            totalCards={projects.length}
          />
        ))}
      </div>
    </section>
  );
}
