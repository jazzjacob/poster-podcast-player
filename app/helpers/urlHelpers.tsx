"use client";

import { useEffect } from "react";
import { notFound, usePathname, useRouter, useSearchParams } from "next/navigation";
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

  const removeQueryParams = (keys: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove each specified key from the search params
    keys.forEach((key) => params.delete(key));

    // Update the URL: If no params remain, remove "?"
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };


  return { setQueryParam, removeQueryParam, removeQueryParams };
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

/**
 * Hook that syncs the selected podcast and episode from the URL to Zustand state
 */
export const usePodcastAndEpisodeFromUrl = () => {
  const searchParams = useSearchParams();
  const setPodcast = useStore((state) => state.setPodcast);
  const podcasts = useStore((state) => state.podcasts);
  const setEpisode = useStore((state) => state.setCurrentEpisode);
  const episodes = useStore((state) => state.podcast?.episodes);
  const clearPodcast = useStore((state) => state.clearPodcast);
  const clearEpisode = useStore((state) => state.clearCurrentEpisode);

  useEffect(() => {
    const podcastIdFromUrl = searchParams.get("podcast");
    const episodeIdFromUrl = searchParams.get("episode");

    if (podcastIdFromUrl) {
      const foundPodcast = podcasts.find((p) => p.id === podcastIdFromUrl);
      if (foundPodcast) {
        setPodcast(foundPodcast);
      }
    } else {
      clearPodcast(); // Clear Zustand state if no podcast param
    }

    if (episodeIdFromUrl) {
      const foundEpisode = episodes?.find((e) => e.id === episodeIdFromUrl);
      if (foundEpisode) setEpisode(foundEpisode);
    } else {
      clearEpisode(); // Clear Zustand state if no episode param
    }
  }, [searchParams, podcasts, episodes, setPodcast, setEpisode, clearPodcast, clearEpisode]);
};
