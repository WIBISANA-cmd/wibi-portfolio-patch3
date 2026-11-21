import { useEffect, useState } from 'react';
import { getLandingPage } from './sanity.queries';
import { applyFontTheme } from './fonts';
import { applyTextSizes } from './textSizes';
import type { LandingPage, ThemeSettingsDoc, TranslationDoc } from './sanity.types';

interface LandingPageState {
  data: LandingPage | null;
  translations: TranslationDoc[];
  theme: ThemeSettingsDoc | null;
  loading: boolean;
  error: string | null;
}

/** Fetches the landingPage document, language dictionaries and theme settings once on mount. */
export function useLandingPage(): LandingPageState {
  const [data, setData] = useState<LandingPage | null>(null);
  const [translations, setTranslations] = useState<TranslationDoc[]>([]);
  const [theme, setTheme] = useState<ThemeSettingsDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getLandingPage()
      .then((result) => {
        if (!active) return;
        // Set the font variables before the first content render — no font swap flash.
        applyFontTheme(result.theme);
        applyTextSizes(result.theme);
        setData(result.page);
        setTranslations(result.translations ?? []);
        setTheme(result.theme ?? null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load content.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { data, translations, theme, loading, error };
}
