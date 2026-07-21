import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

interface NavSectionProps {
  wordmark?: string;
  links?: { label: string; href: string }[];
}

export default function NavSection({
  wordmark = 'WIBISANA',
  links = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#projects' },
  ],
}: NavSectionProps) {
  const headerRef = useRef<HTMLElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Toggle solid background and border on scroll
        ScrollTrigger.create({
          start: 'top -50',
          end: 99999,
          onToggle: (self) => {
            if (self.isActive) {
              gsap.to(headerRef.current, { backgroundColor: 'var(--surface)', duration: 0.3 });
              gsap.to(borderRef.current, { opacity: 1, duration: 0.3 });
            } else {
              gsap.to(headerRef.current, { backgroundColor: 'transparent', duration: 0.3 });
              gsap.to(borderRef.current, { opacity: 0, duration: 0.3 });
            }
          },
        });
      });

      return () => mm.revert();
    },
    { scope: headerRef }
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 transition-colors"
      style={{ backgroundColor: 'transparent' }}
    >
      <div
        ref={borderRef}
        className="absolute bottom-0 left-0 w-full h-[1px] bg-line opacity-0"
      />
      
      <div className="text-ink font-display font-bold tracking-tight">
        {wordmark}
      </div>

      <nav className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium text-ink-2 hover:text-ink transition-colors relative group"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-ink transition-all group-hover:w-full" />
          </a>
        ))}
        <a
          href="#contact"
          className="bg-ink-strong text-bg px-5 py-2 rounded-lg text-sm font-medium hover:bg-ink transition-colors"
        >
          Contact
        </a>
      </nav>

      {/* Mobile Menu Button - Placeholder for actual mobile menu implementation */}
      <button className="md:hidden text-ink p-2">
        Menu
      </button>
    </header>
  );
}
