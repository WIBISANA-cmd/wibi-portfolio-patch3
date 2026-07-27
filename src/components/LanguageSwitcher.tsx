import { useLanguage } from '../lib/i18n';

/** Hidden entirely until the CMS has at least one translation document. */
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, languages } = useLanguage();
  if (languages.length < 2) return null;

  return (
    <div
      role="group"
      aria-label="Change language"
      className={`flex items-center gap-0.5 rounded-lg border border-line/40 p-0.5 ${className}`}
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
            className={`px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wide transition-colors ${
              active ? 'bg-ink-strong text-bg' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {option.code}
          </button>
        );
      })}
    </div>
  );
}
