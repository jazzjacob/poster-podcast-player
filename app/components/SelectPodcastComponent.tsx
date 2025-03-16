import React from 'react';
import Link from 'next/link';

import { PodcastData } from '../helpers/customTypes';
import useStore from '../helpers/store';
import Button from './Button';
import { useQueryParams, usePodcastFromUrl } from "../helpers/urlHelpers";

const SelectPodcastComponent = () => {
  const currentEpisode = useStore((state) => state.currentEpisode);
  const clearCurrentEpisode = useStore((state) => state.clearCurrentEpisode);
  const podcasts = useStore((state) => state.podcasts);
  const setPodcast = useStore((state) => state.setPodcast);
  const currentPodcast = useStore((state) => state.podcast);

  const { setQueryParam } = useQueryParams();
  usePodcastFromUrl();

  function handlePodcastClick(podcast: PodcastData) {
    if (currentEpisode) {
      clearCurrentEpisode();
    }
    setPodcast(podcast);
  }

  return (
    !currentPodcast && (
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ marginBottom: "0.3rem" }}>Podcasts</h2>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          {podcasts && podcasts.map((podcast, index) => (
              <Button
                key={`${podcast.id}-${index}`}
              onClick={() => {
                handlePodcastClick(podcast)
                setQueryParam('podcast', podcast.id);
              }}
              >
                {podcast.podcastName}
              </Button>
          ))}
        </div>
        <Link style={{ width: 'fit-content', textDecoration: 'underline' }} href='/admin/add-podcast'>Add podcast</Link>
      </div >
    )
  );
};

export default SelectPodcastComponent;
