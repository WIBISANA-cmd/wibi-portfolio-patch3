import { useEffect, useState } from 'react';
import { getLandingPage } from './sanity.queries';
import type { LandingPage, TranslationDoc } from './sanity.types';

interface LandingPageState {
  data: LandingPage | null;
  translations: TranslationDoc[];
  loading: boolean;
  error: string | null;
}

/** Fetches the landingPage document and the language dictionaries once on mount. */
export function useLandingPage(): LandingPageState {
  const [data, setData] = useState<LandingPage | null>(null);
  const [translations, setTranslations] = useState<TranslationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getLandingPage()
      .then((result) => {
        if (!active) return;
        setData(result.page);
        setTranslations(result.translations ?? []);
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

  return { data, translations, loading, error };
}
