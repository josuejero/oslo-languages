// src/lib/hooks/useDataFetching.ts
import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseDataFetchingOptions {
  retryCount?: number;
  retryDelay?: number;
}

export function useDataFetching<T>(
  fetchFn: () => Promise<T>,
  options: UseDataFetchingOptions = {}
) {
  const { retryCount = 3, retryDelay = 1000 } = options;
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async (attempt = 0) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fetchFn();
      setState({ data, loading: false, error: null });
    } catch (error) {
      logger.error('Data fetching error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        attempt,
      });

      if (attempt < retryCount) {
        setTimeout(() => {
          fetchData(attempt + 1);
        }, retryDelay * Math.pow(2, attempt)); // Exponential backoff
      } else {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch data'),
        });
      }
    }
  }, [fetchFn, retryCount, retryDelay]);

  const retry = useCallback(() => {
    fetchData(0);
  }, [fetchData]);

  useEffect(() => {
    fetchData(0);
  }, [fetchData]);

  return { ...state, retry };
}