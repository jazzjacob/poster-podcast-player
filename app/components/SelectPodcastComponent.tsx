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
  const podcasts = useStore((state) => state.podcasts);
  const setPodcast = useStore((state) => state.setPodcast);

  function handlePodcastClick(podcast: PodcastData) {
    console.log(podcast.podcastName);
    console.log(podcast.id);
    setPodcastId(podcast.id);
    setPodcast(podcast);
  }

  return (
    <div style={{ margin: "2rem 0" }}>
      <h2>Select podcast</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        {podcasts && podcasts.map((podcast, index) => (
          <button
            key={`${podcast.id}-${index}`}
            onClick={() => handlePodcastClick(podcast)}
          >
            {podcast.podcastName}
          </button>
        ))}
      </div >
    </div >
  );
};

export default SelectPodcastComponent;
