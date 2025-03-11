import React, { useState } from 'react';
import { EpisodeData, PodcastData, exampleEpisodeData } from '../helpers/customTypes';
import useStore from '../helpers/store';
import { fetchEpisode } from '../firebase/firestoreOperations';
import AddEpisodeComponent from './AddEpisodeComponent';

interface CreatePodcastComponentProps {
  podcastId: string;
  setEpisodeId: React.Dispatch<React.SetStateAction<string>>;
}

const SelectEpisodeComponent = () => {
  const currentPodcast = useStore((state) => state.podcast);
  const currentEpisode = useStore((state) => state.currentEpisode);
  const setCurrentEpisode = useStore((state) => state.setCurrentEpisode);
  const clearPodcast = useStore((state) => state.clearPodcast);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const clearCurrentEpisode = useStore((state) => state.clearCurrentEpisode);

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

  function handleBackButton() {
    console.log("YOYO");
    clearPodcast();
  };

  return (
    <div>
      {currentPodcast && currentPodcast.episodes && !currentEpisode && (
      <>
        <h2 style={{ marginBottom: "0.3rem" }}><span style={{ color: "darkgray" }}><a href="#" onClick={handleBackButton}>Podcasts</a> /</span> {currentPodcast.podcastName}</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          {currentPodcast.episodes.map((episode, index) => (
            <button
              key={`${episode.id}-${index}`}
              onClick={() => handleEpisodeClick(episode, index)}
              disabled={currentEpisode !== null && (selectedIndex == index)}
              style={{
                border: "none",
                backgroundColor: "orange",
                color: "white",
                padding: "0.5rem 0.8rem",
                fontFamily: "inherit"
              }}
            >
              {episode.title}
            </button>
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
