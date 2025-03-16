"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useStore from "./store";

/**
 * Custom hook for managing URL query parameters
 */
export const useQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Add or update a query parameter
   */
  const setQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);

    router.push(`${pathname}?${params.toString()}`);
  };

  /**
   * Remove a query parameter
   */
  const removeQueryParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);

    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  return { setQueryParam, removeQueryParam };
};

/**
 * Hook that syncs the selected podcast from the URL to Zustand state
 */
export const usePodcastFromUrl = () => {
  const searchParams = useSearchParams();
  const setPodcast = useStore((state) => state.setPodcast);
  const podcasts = useStore((state) => state.podcasts);

  useEffect(() => {
    const podcastIdFromUrl = searchParams.get("podcast");

    if (podcastIdFromUrl) {
      const foundPodcast = podcasts.find((p) => p.id === podcastIdFromUrl);
      if (foundPodcast) {
        setPodcast(foundPodcast);
      }
    }
  }, [searchParams, podcasts, setPodcast]);
};
