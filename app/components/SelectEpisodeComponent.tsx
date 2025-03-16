import React, { useState } from 'react';
import { EpisodeData, PodcastData, exampleEpisodeData } from '../helpers/customTypes';
import useStore from '../helpers/store';
import { fetchEpisode } from '../firebase/firestoreOperations';
import AddEpisodeComponent from './AddEpisodeComponent';
import Button from './Button';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface CreatePodcastComponentProps {
  podcastId: string;
  setEpisodeId: React.Dispatch<React.SetStateAction<string>>;
}

const SelectEpisodeComponent = () => {
  const currentPodcast = useStore((state) => state.podcast);
  const currentEpisode = useStore((state) => state.currentEpisode);
  const setCurrentEpisode = useStore((state) => state.setCurrentEpisode);
  const clearPodcast = useStore((state) => state.clearPodcast);
  const clearCurrentEpisode = useStore((state) => state.clearCurrentEpisode);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  async function handleEpisodeClick(episode: EpisodeData, index: number) {
    console.log(episode.title);
    if (currentPodcast) {
      const episodeData = await fetchEpisode(currentPodcast.id, episode.id);
      if (episodeData) {
        setCurrentEpisode(episodeData);
        console.log("Setting current episode with data: ", episodeData);
      }
    }
  }

  const removeQueryParam = (param: string) => {
    const params = new URLSearchParams(searchParams.toString()); // Copy current search params
    params.delete(param); // Remove the specified parameter

    router.push(pathname + (params.toString() ? `?${params.toString()}` : ""));
  };

  function handleBackButton() {
    console.log("YOYO");
    clearPodcast();
    removeQueryParam("podcast");
  };


  return (
    <div>
      {currentPodcast && currentPodcast.episodes && !currentEpisode && (
      <>
        <h2 style={{ marginBottom: "0.3rem" }}><span style={{ color: "darkgray" }}><a href="#" onClick={handleBackButton}>Podcasts</a> /</span> {currentPodcast.podcastName}</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          {currentPodcast.episodes.map((episode, index) => (
            <Button
              key={`${episode.id}-${index}`}
              onClick={() => handleEpisodeClick(episode, index)}
            >
              {episode.title}
            </Button>
          ))}
          </div>
          <div style={{ marginTop: "1rem" }}>
            <AddEpisodeComponent
              podcastId={currentPodcast.id}
              episodeData={exampleEpisodeData}
            />
          </div>
        </>
      )}
      {currentEpisode && (
        <h2 style={{ marginBottom: "0.3rem" }}>
          <span style={{ color: "darkgray" }}><a href="#" onClick={handleBackButton}>Podcasts</a> / <a onClick={clearCurrentEpisode} href="#">{currentPodcast?.podcastName}</a> / </span>{currentEpisode.title}</h2>
      )}
    </div>
  );
};

export default SelectEpisodeComponent;
