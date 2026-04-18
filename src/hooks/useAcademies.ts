import { useCallback, useEffect, useState } from 'react';
import { academiesApi, type AcademySummary } from '../lib/academies';

interface AcademiesState {
  academies: AcademySummary[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useAcademies(): AcademiesState {
  const [academies, setAcademies] = useState<AcademySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch — effect syncs state from the API, no synchronous setState.
  useEffect(() => {
    let cancelled = false;
    academiesApi
      .list()
      .then((data) => {
        if (!cancelled) setAcademies(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load academies');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setAcademies(await academiesApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load academies');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { academies, isLoading, error, reload };
}
