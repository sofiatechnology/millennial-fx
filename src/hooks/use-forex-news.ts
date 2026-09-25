import { useCallback, useEffect, useState } from 'react';

import {
  fetchForexNews,
  fetchNewsStories,
  type ForexEvent,
  type NewsStory,
} from '@/utils/forex-news';

interface ForexNewsState {
  events: ForexEvent[];
  stories: NewsStory[];
  storiesError: string | null;
  storiesLoading: boolean;
  loadedAt: number | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => void;
}

export function useForexNews(): ForexNewsState {
  const [events, setEvents] = useState<ForexEvent[]>([]);
  const [stories, setStories] = useState<NewsStory[]>([]);
  const [storiesError, setStoriesError] = useState<string | null>(null);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [loadedAt, setLoadedAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setStoriesLoading(true);
    setRequestId((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchForexNews(controller.signal)
      .then((next) => {
        if (controller.signal.aborted) return;
        setEvents(next);
        setLoadedAt(Date.now());
        setError(null);
      })
      .catch((caught: unknown) => {
        if (caught instanceof Error && caught.name === 'AbortError') return;
        const message = caught instanceof Error ? caught.message : 'Unable to load news.';
        setError(message);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      });

    fetchNewsStories(controller.signal)
      .then((next) => {
        if (controller.signal.aborted) return;
        setStories(next);
        setStoriesError(null);
      })
      .catch((caught: unknown) => {
        if (caught instanceof Error && caught.name === 'AbortError') return;
        const message = caught instanceof Error ? caught.message : 'Unable to load stories.';
        setStoriesError(message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setStoriesLoading(false);
      });

    return () => controller.abort();
  }, [requestId]);

  return {
    events,
    stories,
    storiesError,
    storiesLoading,
    loadedAt,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
}
