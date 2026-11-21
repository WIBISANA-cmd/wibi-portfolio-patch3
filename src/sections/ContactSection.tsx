import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Github, Globe, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Reveal from '../components/Reveal';
import DownloadCVButton from '../components/DownloadCVButton';
import { Container, IconCircle, Sparkle } from '../components/ui';
import { imageUrl } from '../lib/sanity.client';
import type { LandingPage } from '../lib/sanity.types';

function socialIcon(label: string, url: string) {
  const key = `${label} ${url}`.toLowerCase();
  if (key.includes('github')) return Github;
  if (key.includes('whatsapp') || key.includes('wa.me')) return MessageCircle;
  return ArrowUpRight;
}

function ContactRow({ icon, href, children, external }: { icon: ReactNode; href?: string; children: ReactNode; external?: boolean }) {
  const inner = (
    <>
      <IconCircle className="group-hover:bg-accent group-hover:text-on-accent group-hover:border-accent">{icon}</IconCircle>
      <span className="text-sm text-ink break-all sm:break-normal">{children}</span>
    </>
  );
  const className = 'group flex items-center gap-4 py-3 border-b border-accent-line last:border-b-0';
  return (
    <li>
      {href ? (
        <a
          href={href}
          className={`${className} hover:text-accent-text`}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {inner}
        </a>
      ) : (
        <div className={className}>{inner}</div>
      )}
    </li>
  );
}

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

export default function ContactSection({ page }: { page: LandingPage }) {
  const contact = page.contact ?? {};
  const cv = page.cv ?? {};
  const availability = page.hero?.availability;
  const imgUrl = imageUrl(contact.image, 1100);
  const socials = contact.socials ?? [];
  const showCV = cv.showDownloadButton !== false;

  return (
    <section id="contact" className="py-14 sm:py-20 border-b border-accent-line overflow-hidden">
      <Container>
        <div className={`grid grid-cols-1 gap-12 lg:gap-10 ${imgUrl ? 'lg:grid-cols-[1fr_1fr_1.15fr]' : 'lg:grid-cols-2'}`}>
          {/* Heading + intro + CTAs */}
          <Reveal yOffset={24} className="flex flex-col gap-6 items-start">
            {contact.heading && (
              <h2 className="relative font-contact-heading font-bold uppercase tracking-tight text-ink text-4xl sm:text-5xl leading-[1.05] max-w-[12ch]">
                {contact.heading}
                <Sparkle className="inline-block w-6 h-6 ml-3 -translate-y-1 text-accent-text align-middle" />
              </h2>
            )}
            {contact.note && <p className="font-contact-text text-sm sm:text-[0.95rem] text-ink-2 leading-relaxed max-w-sm whitespace-pre-line">{contact.note}</p>}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
              {availability && contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="group inline-flex items-center gap-3 font-buttons text-xs font-semibold uppercase tracking-[0.1em] text-accent-text"
                >
                  <IconCircle className="group-hover:bg-accent group-hover:text-on-accent group-hover:border-accent">
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </IconCircle>
                  {availability}
                </a>
              )}
              {showCV && <DownloadCVButton data={page} />}
            </div>
          </Reveal>

          {/* Contact details + socials */}
          <Reveal yOffset={24} delay={0.08}>
            <ul className="flex flex-col font-contact-text">
              {contact.email && (
                <ContactRow icon={<Mail className="w-4 h-4" strokeWidth={1.5} />} href={`mailto:${contact.email}`}>
                  {contact.email}
                </ContactRow>
              )}
              {cv.website && (
                <ContactRow icon={<Globe className="w-4 h-4" strokeWidth={1.5} />} href={cv.website} external>
                  {stripProtocol(cv.website)}
                </ContactRow>
              )}
              {cv.phone && (
                <ContactRow icon={<Phone className="w-4 h-4" strokeWidth={1.5} />} href={`tel:${cv.phone.replace(/[^\d+]/g, '')}`}>
                  {cv.phone}
                </ContactRow>
              )}
              {cv.location && <ContactRow icon={<MapPin className="w-4 h-4" strokeWidth={1.5} />}>{cv.location}</ContactRow>}
              {socials.map((s) => {
                const Icon = socialIcon(s.label, s.url);
                return (
                  <ContactRow key={`${s.label}-${s.url}`} icon={<Icon className="w-4 h-4" strokeWidth={1.5} />} href={s.url} external>
                    {s.label}
                  </ContactRow>
                );
              })}
            </ul>
          </Reveal>

          {/* Optional showcase image */}
          {imgUrl && (
            <Reveal yOffset={30} delay={0.15} className="relative">
              <img src={imgUrl} alt={contact.image?.alt || ''} loading="lazy" className="w-full h-auto object-contain" />
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
