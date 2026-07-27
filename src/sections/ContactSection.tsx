import Reveal from '../components/Reveal';
import { useLanguage } from '../lib/i18n';
import type { ContactData } from '../lib/sanity.types';

export default function ContactSection({ data }: { data: ContactData }) {
  const { t } = useLanguage();
  const heading = data.heading || "Let's work together";
  const email = data.email || 'hello@example.com';
  const socials = data.socials || [];
  const note = data.note;

  return (
    <section id="contact" className="py-24 sm:py-32 md:py-40 bg-ink text-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          
          {/* Left: Heading & Email */}
          <div className="flex flex-col gap-12">
            <Reveal yOffset={30}>
              <h2 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
                {heading}
              </h2>
            </Reveal>

            <Reveal delay={0.2} yOffset={30}>
              <a 
                href={`mailto:${email}`}
                className="group inline-flex flex-col items-start gap-2"
              >
                <span className="text-muted text-sm uppercase tracking-widest font-medium">
                  {t('Drop a line')}
                </span>
                <span className="font-display text-2xl sm:text-3xl lg:text-4xl hover:text-bg/80 transition-colors relative">
                  {email}
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-bg transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                </span>
              </a>
            </Reveal>
          </div>

          {/* Right: Socials & Note */}
          <div className="flex flex-col justify-end gap-12 lg:pl-12 border-t lg:border-t-0 lg:border-l border-line/20 pt-12 lg:pt-0">
            {socials.length > 0 && (
              <div className="flex flex-col gap-6">
                <Reveal yOffset={20}>
                  <h3 className="text-muted text-sm uppercase tracking-widest font-medium">
                    {t('Socials')}
                  </h3>
                </Reveal>
                <ul className="flex flex-col gap-4">
                  {socials.map((social, i) => (
                    <li key={social.label}>
                      <Reveal delay={0.1 * i} yOffset={20}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-display text-xl md:text-2xl hover:text-bg/70 transition-colors flex items-center justify-between group"
                        >
                          {social.label}
                          <span className="text-muted opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            ↗
                          </span>
                        </a>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {note && (
              <Reveal delay={0.4} yOffset={20}>
                <p className="text-muted font-body text-base md:text-lg max-w-sm leading-relaxed">
                  {note}
                </p>
              </Reveal>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
