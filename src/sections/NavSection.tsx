import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';
import { Sparkle, normalizeHref } from '../components/ui';
import { useLanguage } from '../lib/i18n';

interface NavSectionProps {
  label?: string;
  sublabel?: string;
  availability?: string;
  links?: { label: string; href: string }[];
  logoUrl?: string;
  ready?: boolean;
}

export default function NavSection({ label, sublabel, availability, links = [], logoUrl, ready = true }: NavSectionProps) {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(headerRef.current, { opacity: 0, y: -16 });
        if (ready) gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 });
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(headerRef.current, { opacity: 1, y: 0 });
      });

      const trigger = ScrollTrigger.create({
        start: 'top -40',
        end: 99999,
        onToggle: (self) => setScrolled(self.isActive),
      });

      return () => {
        trigger.kill();
        mm.revert();
      };
    },
    { scope: headerRef, dependencies: [ready] }
  );

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-bg/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-page mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
        <div className={`flex items-center justify-between gap-4 h-16 sm:h-20 border-b transition-colors ${solid ? 'border-accent-line' : 'border-transparent'}`}>
          <a href="#top" className="flex items-center gap-3 min-w-0">
            {logoUrl && (
              <img src={logoUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-line shrink-0" />
            )}
            <span className="flex flex-col leading-tight min-w-0 font-nav-brand">
              {label && (
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.08em] text-accent-text truncate">{label}</span>
              )}
              {sublabel && (
                <span className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.08em] text-ink truncate">{sublabel}</span>
              )}
            </span>
          </a>

          {links.length > 0 && (
            <nav aria-label="Main" className="hidden lg:flex items-center gap-8 font-nav-menu">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={normalizeHref(link.href)}
                  className="text-xs font-medium uppercase tracking-[0.12em] text-ink-2 hover:text-accent-text transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {availability && (
              <a
                href="#contact"
                className="hidden md:inline-flex items-center gap-3 font-nav-menu text-xs font-medium uppercase tracking-[0.12em] text-ink hover:text-accent-text transition-colors pr-2"
              >
                {availability}
                <Sparkle className="w-4 h-4 text-accent-text" />
              </a>
            )}
            <LanguageSwitcher />
            <ThemeToggle />
            {links.length > 0 && (
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t('Close menu') : t('Menu')}
                className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-full border border-line text-ink hover:border-accent-line transition-colors"
              >
                {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {open && (
          <nav id="mobile-menu" aria-label="Mobile" className="lg:hidden pb-6 pt-2 font-nav-menu">
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={normalizeHref(link.href)}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 border-b border-line text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:text-accent-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {availability && (
                <li>
                  <a
                    href="#contact"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-accent-text"
                  >
                    {availability}
                    <Sparkle className="w-4 h-4" />
                  </a>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
