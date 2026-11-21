import { Container, Sparkle, normalizeHref } from '../components/ui';
import type { FooterData } from '../lib/sanity.types';

export default function FooterSection({ data, logoUrl }: { data: FooterData; logoUrl?: string }) {
  const links = data.links ?? [];
  if (!data.tagline && !data.copyright && links.length === 0) return null;

  return (
    <footer className="py-8 font-footer-text">
      <Container className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5">
          {(logoUrl || data.tagline) && (
            <span className="inline-flex items-center gap-2.5">
              {logoUrl && <img src={logoUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-line" />}
              {data.tagline && (
                <span className="font-semibold uppercase tracking-[0.14em] text-ink">{data.tagline}</span>
              )}
              <Sparkle className="w-3 h-3 text-accent-text" />
            </span>
          )}
          {data.copyright && <span>{data.copyright}</span>}
        </div>

        {links.length > 0 && (
          <ul className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) => (
              <li key={link.label}>
                <a href={normalizeHref(link.url)} className="uppercase tracking-[0.1em] hover:text-accent-text transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </footer>
  );
}
