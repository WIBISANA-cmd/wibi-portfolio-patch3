import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
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
      className="h-screen flex items-center justify-center px-6 text-center"
      style={{ background: '#0C0C0C' }}
    >
      <div className="max-w-2xl space-y-4">
        <p className="text-[#D7E2EA] font-light uppercase tracking-widest text-sm">
          {message}
        </p>
        {details ? (
          <p className="text-[#8C99A3] font-light text-xs tracking-[0.18em] uppercase">
            {details}
          </p>
        ) : null}
      </div>
    </main>
  );
}

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
  const showPreloader = data.preloader?.isEnabled !== false && !preloaderDone;

  return (
    <>
      <AnimatePresence>
        {showPreloader && (
          <Preloader
            data={data.preloader}
            onComplete={() => setPreloaderDone(true)}
          />
        )}
      </AnimatePresence>

      <SmoothScroll>
        <main style={{ background: '#0C0C0C', overflowX: 'clip' }}>
          <HeroSection data={data.hero ?? {}} />
          <MarqueeSection data={data.marquee ?? {}} />
          <AboutSection data={data.about ?? {}} />
          <ServicesSection data={data.services ?? {}} />
          <ProjectsSection data={data.projects ?? {}} />
        </main>
      </SmoothScroll>
    </>
  );
}
