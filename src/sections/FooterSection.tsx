import Reveal from '../components/Reveal';
import type { FooterData } from '../lib/sanity.types';

export default function FooterSection({ data }: { data: FooterData }) {
  const tagline = data.tagline || 'Wibisana';
  const copyright = data.copyright || '© 2026 Wibisana. All rights reserved.';
  const links = data.links || [];

  return (
    <footer className="bg-ink text-bg pb-12 pt-8 sm:pb-16 px-6 md:px-12 border-t border-line/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        <Reveal yOffset={20}>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-muted text-sm font-medium">
            <span className="font-display uppercase tracking-widest text-bg">{tagline}</span>
            <span className="hidden md:inline text-line/20">|</span>
            <span>{copyright}</span>
          </div>
        </Reveal>

        {links.length > 0 && (
          <Reveal yOffset={20} delay={0.2}>
            <ul className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
              {links.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.url}
                    className="text-muted hover:text-bg transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

      </div>
    </footer>
  );
}
