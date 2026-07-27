import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { buildDict, type Dict } from './translate';
import type { TranslationDoc } from './sanity.types';

/** The language the CMS content is authored in — always available, never a document. */
export const SOURCE_LANGUAGE = { code: 'en', label: 'English' };

const STORAGE_KEY = 'wibi.lang';

export interface LanguageOption {
  code: string;
  label: string;
}

interface LanguageContextValue {
  lang: string;
  setLang: (code: string) => void;
  languages: LanguageOption[];
  dict: Dict;
  /** Translate a hard-coded UI string (same dictionary as the CMS content). */
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: SOURCE_LANGUAGE.code,
  setLang: () => {},
  languages: [SOURCE_LANGUAGE],
  dict: new Map(),
  t: (text) => text,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({
  translations,
  children,
}: {
  translations?: TranslationDoc[];
  children: ReactNode;
}) {
  const [lang, setLang] = useState(
    () => localStorage.getItem(STORAGE_KEY) || SOURCE_LANGUAGE.code
  );

  const docs = translations ?? [];
  const languages = useMemo(
    () => [
      SOURCE_LANGUAGE,
      ...docs.map((d) => ({ code: d.language, label: d.label || d.language })),
    ],
    [docs]
  );

  // A stored language can disappear when its document is unpublished.
  const active = languages.some((l) => l.code === lang) ? lang : SOURCE_LANGUAGE.code;

  const dict = useMemo(
    () => buildDict(docs.find((d) => d.language === active)?.entries),
    [docs, active]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, active);
    document.documentElement.lang = active;
  }, [active]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang: active,
      setLang,
      languages,
      dict,
      t: (text: string) => dict.get(text.trim()) ?? text,
    }),
    [active, languages, dict]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
