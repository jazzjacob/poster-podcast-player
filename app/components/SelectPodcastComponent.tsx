import React, { useState } from 'react';
import { addEpisode } from '../firebase/firestoreOperations';
import { EpisodeData, PodcastData } from '../helpers/customTypes';
import useStore from '../helpers/store';

interface CreatePodcastComponentProps {
  setPodcastId: React.Dispatch<React.SetStateAction<string>>;
  setEpisodeId: React.Dispatch<React.SetStateAction<string>>
}

const SelectPodcastComponent: React.FC<CreatePodcastComponentProps> = ({ setPodcastId, setEpisodeId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const currentEpisode = useStore((state) => state.currentEpisode);
  const clearCurrentEpisode = useStore((state) => state.clearCurrentEpisode);
  const podcasts = useStore((state) => state.podcasts);
  const setPodcast = useStore((state) => state.setPodcast);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  function handlePodcastClick(podcast: PodcastData, index: number) {
    if (currentEpisode) {
      clearCurrentEpisode();
    }
    console.log(podcast.podcastName);
    console.log(podcast.id);
    setPodcast(podcast);
    setSelectedIndex(index);
  }

  return (
    <div style={{ margin: "2rem 0" }}>
      <h2>Select podcast</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        {podcasts && podcasts.map((podcast, index) => (
          <button
            key={`${podcast.id}-${index}`}
            onClick={() => handlePodcastClick(podcast, index)}
            disabled={selectedIndex == index}
          >
            {podcast.podcastName}
          </button>
        ))}
      </div >
    </div >
  );
};

export default SelectPodcastComponent;
