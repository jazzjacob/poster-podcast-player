//'use client' // remove this later!!!

import React, { useState } from 'react';
import { addEpisode, fetchAllPodcasts } from '../firebase/firestoreOperations';
import SelectPodcastButton from './SelectPodcastButton';

async function NewSelectPodcastComponent() {
  /*
  const currentEpisode = useStore((state) => state.currentEpisode);
  const clearCurrentEpisode = useStore((state) => state.clearCurrentEpisode);
  //const podcasts = useStore((state) => state.podcasts);
  const setPodcast = useStore((state) => state.setPodcast);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  */

  const podcasts = await fetchAllPodcasts();

  /*
  function handlePodcastClick(podcast: PodcastData, index: number) {
    if (currentEpisode) {
      clearCurrentEpisode();
    }
    console.log(podcast.podcastName);
    console.log(podcast.id);
    setPodcast(podcast);
    setSelectedIndex(index);
  }
  */

  return (
    <div style={{ margin: "2rem 0" }}>
      <h2>New Select podcast</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        {podcasts && podcasts.map((podcast, index) => (
          <>
            <SelectPodcastButton podcast={podcast} />
          </>
        ))}
        {/*podcasts && podcasts.map((podcast, index) => (
          <button
            key={`${podcast.id}-${index}`}
            onClick={() => handlePodcastClick(podcast, index)}
            disabled={selectedIndex == index}
          >
            {podcast.podcastName}
          </button>
        ))*/}
      </div >
    </div >
  );
};

export default NewSelectPodcastComponent;
