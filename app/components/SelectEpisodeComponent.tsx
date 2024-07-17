import React, { useState } from 'react';
import { EpisodeData, PodcastData } from '../helpers/customTypes';
import useStore from '../helpers/store';
import { fetchEpisode } from '../firebase/firestoreOperations';

interface CreatePodcastComponentProps {
  podcastId: string;
  setEpisodeId: React.Dispatch<React.SetStateAction<string>>;
}

const SelectEpisodeComponent = () => {
  const currentPodcast = useStore((state) => state.podcast);
  const setCurrentEpisode = useStore((state) => state.setCurrentEpisode);

  async function handleEpisodeClick(episode: EpisodeData) {
    console.log(episode.title);
    if (currentPodcast) {
      const episodeData = await fetchEpisode(currentPodcast.id, episode.id);
      if (episodeData) {
        setCurrentEpisode(episodeData);
        console.log("Setting current episode with data: ", episodeData);
      }
    }
  }

  return (
    <div style={{ margin: "2rem 0" }}>
      {currentPodcast && currentPodcast.episodes && (
      <>
        <h2>Select episode</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          {currentPodcast.episodes.map((episode, index) => (
            <button
              key={`${episode.id}-${index}`}
              onClick={() => handleEpisodeClick(episode)}
            >
              {episode.title}
            </button>
          ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SelectEpisodeComponent;
