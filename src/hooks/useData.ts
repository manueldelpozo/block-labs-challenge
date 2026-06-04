import { useState, useEffect, useRef } from 'react';

export function useData<T>(fetcher: (signal?: AbortSignal) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetcherRef.current(controller.signal);
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted && !(err instanceof DOMException && err.name === 'AbortError')) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { data, isLoading, error };
}
