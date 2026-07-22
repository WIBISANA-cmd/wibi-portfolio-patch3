import { useState } from 'react';
import NavSection from './sections/NavSection';
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import ExperienceSection from './sections/ExperienceSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactSection from './sections/ContactSection';
import FooterSection from './sections/FooterSection';
import SmoothScroll from './components/SmoothScroll';
import Preloader from './components/Preloader';
import { useLandingPage } from './lib/useLandingPage';
import { isSanityConfigured, sanityConfig } from './lib/sanity.client';

function StatusScreen({
  message,
  details,
}: {
  message: string;
  details?: string;
}) {
  return (
    <main
      className="h-screen flex items-center justify-center px-6 text-center bg-bg text-ink"
    >
      <div className="max-w-2xl space-y-4">
        <p className="text-muted font-light uppercase tracking-widest text-sm">
          {message}
        </p>
        {details ? (
          <p className="text-ink-2 font-light text-xs tracking-[0.18em] uppercase">
            {details}
          </p>
        ) : null}
      </div>
    </main>
  );
}

import SEOHead from './components/SEOHead';

export default function App() {
  // Every section renders exclusively from Sanity — no bundled fallback content.
  const { data, loading, error } = useLandingPage();
  const [preloaderDone, setPreloaderDone] = useState(false);
  const sanityDetails = `project=${sanityConfig.projectId || 'missing'} dataset=${sanityConfig.dataset} api=${sanityConfig.apiVersion}`;

  if (loading) return <StatusScreen message="Loading…" />;
  if (!isSanityConfigured) {
    return (
      <StatusScreen
        message='Sanity is not configured in this build. Set VITE_SANITY_PROJECT_ID in Dokploy build args, then redeploy.'
        details={sanityDetails}
      />
    );
  }
  if (error) {
    const isCorsError = /cors/i.test(error) || /origin/i.test(error);
    return (
      <StatusScreen
        message={
          isCorsError
            ? 'Sanity blocked localhost. Add this site to CORS origins in your Sanity project settings.'
            : `Failed to load Sanity content. ${error}`
        }
        details={sanityDetails}
      />
    );
  }
  if (!data) {
    return (
      <StatusScreen
        message='Sanity connected, but the published "Landing Page" document was not found in this dataset.'
        details={sanityDetails}
      />
    );
  }

  // Preloader is on unless the CMS explicitly disables it.
  const showPreloader = data.preloader?.enabled !== false && !preloaderDone;

  return (
    <>
      <SEOHead seo={data?.seo} wordmark={data?.preloader?.wordmark} />
      {showPreloader && (
        <Preloader
          data={data.preloader}
          onComplete={() => setPreloaderDone(true)}
        />
      )}

      <SmoothScroll>
        <NavSection
          wordmark={data.preloader?.wordmark}
          links={data.navigation?.links?.map(l => ({ label: l.label, href: l.url }))}
        />
        <main className="bg-bg text-ink overflow-x-clip font-body">
          <HeroSection data={data.hero ?? {}} />
          <MarqueeSection data={data.marquee ?? {}} />
          <AboutSection data={data.about ?? {}} />
          <ServicesSection data={data.services ?? {}} />
          <ExperienceSection data={data.experiences ?? {}} />
          <ProjectsSection data={data.projects ?? {}} />
          <ContactSection data={data.contact ?? {}} />
          <FooterSection data={data.footer ?? {}} />
        </main>
      </SmoothScroll>
    </>
  );
}
