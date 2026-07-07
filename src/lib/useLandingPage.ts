import { useEffect, useState } from 'react';
import { getLandingPage } from './sanity.queries';
import type { LandingPage } from './sanity.types';

interface LandingPageState {
  data: LandingPage | null;
  loading: boolean;
  error: string | null;
}

/** Fetches the landingPage document once on mount. */
export function useLandingPage(): LandingPageState {
  const [data, setData] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getLandingPage()
      .then((result) => {
        if (active) setData(result);
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

  return { data, loading, error };
}
