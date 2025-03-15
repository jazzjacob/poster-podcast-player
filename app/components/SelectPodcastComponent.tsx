import React, { useState } from 'react';
import { addEpisode } from '../firebase/firestoreOperations';
import { EpisodeData, PodcastData } from '../helpers/customTypes';
import useStore from '../helpers/store';
import Link from 'next/link';
import Button from './Button';

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
  const currentPodcast = useStore((state) => state.podcast);

  function handlePodcastClick(podcast: PodcastData, index: number) {
    console.log(`Current episode: ${currentEpisode}`);
    console.log(`Podcast ID: ${podcast.id}`);
    if (currentEpisode) {
      clearCurrentEpisode();
    }
    console.log(podcast.podcastName);
    console.log(podcast.id);
    setPodcast(podcast);
    setSelectedIndex(index);
  }

  return (
    !currentPodcast && (
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ marginBottom: "0.3rem" }}>Podcasts</h2>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          {podcasts && podcasts.map((podcast, index) => (
            <Button
              key={`${podcast.id}-${index}`}
              onClick={() => handlePodcastClick(podcast, index)}
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
