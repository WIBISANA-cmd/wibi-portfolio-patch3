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

function StatusScreen({ message }: { message: string }) {
  return (
    <main
      className="h-screen flex items-center justify-center px-6 text-center"
      style={{ background: '#0C0C0C' }}
    >
      <span className="text-[#D7E2EA] font-light uppercase tracking-widest text-sm">
        {message}
      </span>
    </main>
  );
}

export default function App() {
  // Every section renders exclusively from Sanity — no bundled fallback content.
  const { data, loading, error } = useLandingPage();
  const [preloaderDone, setPreloaderDone] = useState(false);

  if (loading) return <StatusScreen message="Loading…" />;
  if (error) {
    const isCorsError = /cors/i.test(error) || /origin/i.test(error);
    return (
      <StatusScreen
        message={
          isCorsError
            ? 'Sanity blocked localhost. Add this site to CORS origins in your Sanity project settings.'
            : `Failed to load Sanity content. ${error}`
        }
      />
    );
  }
  if (!data) {
    return (
      <StatusScreen message='Content not found. Publish the "Landing Page" document in Sanity Studio.' />
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
