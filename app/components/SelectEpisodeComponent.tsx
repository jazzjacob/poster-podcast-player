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
  const currentEpisode = useStore((state) => state.currentEpisode);
  const setCurrentEpisode = useStore((state) => state.setCurrentEpisode);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  async function handleEpisodeClick(episode: EpisodeData, index: number) {

    console.log(episode.title);
    if (currentPodcast) {
      setSelectedIndex(index);
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
  );
};

export default SelectEpisodeComponent;
