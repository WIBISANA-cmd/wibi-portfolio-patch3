import { useLanguage } from '../lib/i18n';

/** Hidden entirely until the CMS has at least one translation document. */
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, languages } = useLanguage();
  if (languages.length < 2) return null;

  return (
    <div
      role="group"
      aria-label="Change language"
      className={`flex items-center gap-0.5 h-10 rounded-full border border-line p-1 font-buttons ${className}`}
    >
      {languages.map((option) => {
        const active = option.code === lang;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLang(option.code)}
            title={option.label}
            aria-pressed={active}
            className={`h-full px-2.5 rounded-full fs-[11px] font-semibold uppercase tracking-wide transition-colors ${
              active ? 'bg-accent text-on-accent' : 'text-ink-2 hover:text-accent-text'
            }`}
          >
            {option.code}
          </button>
        );
      })}
    </div>
  );
}
