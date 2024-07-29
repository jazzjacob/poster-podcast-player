'use client'

import React, { useState } from 'react';
import { EpisodeData, PodcastData } from '../helpers/customTypes';
import useStore from '../helpers/store';
import { fetchEpisode, fetchEpisodes, fetchPodcast } from '../firebase/firestoreOperations';
import { useSearchParams } from 'next/navigation';

interface CreatePodcastComponentProps {
  podcastId: string;
  setEpisodeId: React.Dispatch<React.SetStateAction<string>>;
}

const SelectEpisodeComponent = ({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) => {

  //const currentPodcast = useStore((state) => state.podcast);
  console.log("Search params", searchParams);
  const podcastId = searchParams.podcast || "";
  fetchEpisodes(podcastId);
  const currentEpisode = useStore((state) => state.currentEpisode);
  const setCurrentEpisode = useStore((state) => state.setCurrentEpisode);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  async function handleEpisodeClick(episode: EpisodeData, index: number) {

    console.log(episode.title);
    if (podcastId && podcastId !== '') {
      setSelectedIndex(index);
      const episodeData = await fetchEpisode(podcastId, episode.id);
      if (episodeData) {
        setCurrentEpisode(episodeData);
        console.log("Setting current episode with data: ", episodeData);
      }
    } else {
      console.log("PodcastID missing in params");
    }
  }

  return (
    <p>Hello</p>
  );
};

export default SelectEpisodeComponent;


/*
<div style={{ margin: "2rem 0" }}>
  {podcastId && (
  <>
    <h2>Select episode</h2>
    <div style={{ display: "flex", gap: "1rem" }}>
      {currentPodcast.episodes.map((episode, index) => (
        <button
          key={`${episode.id}-${index}`}
          onClick={() => handleEpisodeClick(episode, index)}
          disabled={currentEpisode !== null && (selectedIndex == index)}
        >
          {episode.title}
        </button>
      ))}
      </div>
    </>
  )}
</div>
*/
