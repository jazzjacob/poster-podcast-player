import React, { useState } from 'react';
import { addEpisode } from '../firebase/firestoreOperations';
import { EpisodeData, PodcastData } from '../helpers/customTypes';
import useStore from '../helpers/store';

interface CreatePodcastComponentProps {
  podcastId: string;
  setEpisodeId: React.Dispatch<React.SetStateAction<string>>;
}

const SelectEpisodeComponent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const podcast = useStore((state) => state.podcast);
  const setEpisode = useStore((state) => state.setCurrentEpisode);

  function handleEpisodeClick(episode: EpisodeData) {
    console.log(episode.title);
    setEpisode(episode);
  }

  return (
    <div style={{ margin: "2rem 0" }}>
      <h2>Select episode</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        {podcast && podcast.episodes && podcast.episodes.map((episode, index) => (
          <button
            key={`${episode.id}-${index}`}
            onClick={() => handleEpisodeClick(episode)}
          >
            {episode.title}
          </button>
        ))}
      </div >
    </div >
  );
};

export default SelectEpisodeComponent;
