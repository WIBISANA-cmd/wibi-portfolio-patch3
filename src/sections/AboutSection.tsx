import Reveal from '../components/Reveal';
import { Container, SectionHeader } from '../components/ui';
import { imageUrl } from '../lib/sanity.client';
import type { AboutData } from '../lib/sanity.types';

/**
 * About copy + portrait. The image has no frame or background of its own, so a
 * transparent PNG stands directly on the page. Both columns share one row
 * height and the portrait sits flush on the section's bottom line, fading into
 * the background exactly like the hero subject. Stats live in the hero.
 */
export default function AboutSection({ data }: { data: AboutData }) {
  const mediaUrl = imageUrl(data.image, 1200);
  if (!data.heading && !data.body && !mediaUrl) return null;

  return (
    <section id="about" className="pt-14 sm:pt-20 border-b border-accent-line">
      <Container>
        <SectionHeader title={data.heading} />

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
          {data.body && (
            <Reveal yOffset={24} className={`flex flex-col justify-center ${mediaUrl ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
              <p className="font-about-body text-ink text-xl sm:text-2xl lg:text-[1.75rem] leading-[1.45] tracking-[-0.01em] whitespace-pre-line pb-10 lg:pb-16">
                {data.body}
              </p>
            </Reveal>
          )}

          {mediaUrl && (
            // The image is absolutely positioned, so the row height comes from the
            // text column (with a floor), and the image fills exactly that height.
            <Reveal
              yOffset={30}
              delay={0.1}
              className="relative min-h-[22rem] sm:min-h-[28rem] lg:min-h-[26rem] lg:col-span-5"
            >
              <img
                src={mediaUrl}
                alt={data.image?.alt || ''}
                loading="lazy"
                className="portrait-fade absolute inset-0 w-full h-full object-contain object-bottom"
              />
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
