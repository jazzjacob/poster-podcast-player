import React, { useState, useCallback, useEffect } from 'react';
import { addEpisode } from '../firebase/firestoreOperations';
import { EpisodeData, PodcastData } from '../helpers/customTypes';
import useStore from '../helpers/store';
import Link from 'next/link';
import Button from './Button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams()

  useEffect(() => {
    const podcastIdFromUrl = searchParams.get("podcast"); // Retrieve podcast ID from URL

    if (podcastIdFromUrl) {
      const foundPodcast = podcasts.find((p) => p.id === podcastIdFromUrl);
      if (foundPodcast) {
        setPodcast(foundPodcast); // Update Zustand store
      }
    }
  }, [searchParams, podcasts, setPodcast]);

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  function handlePodcastClick(podcast: PodcastData) {
    console.log(`Current episode: ${currentEpisode}`);
    console.log(`Podcast ID: ${podcast.id}`);
    if (currentEpisode) {
      clearCurrentEpisode();
    }
    console.log(podcast.podcastName);
    console.log(podcast.id);
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
                router.push(pathname + '?' + createQueryString('podcast', podcast.id));
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
