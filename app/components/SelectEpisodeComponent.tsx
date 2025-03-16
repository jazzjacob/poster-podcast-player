import React from 'react';
import { EpisodeData, exampleEpisodeData } from '../helpers/customTypes';
import useStore from '../helpers/store';
import { fetchEpisode } from '../firebase/firestoreOperations';
import AddEpisodeComponent from './AddEpisodeComponent';
import Button from './Button';
import { useQueryParams } from '../helpers/urlHelpers';

const SelectEpisodeComponent = () => {
  const currentPodcast = useStore((state) => state.podcast);
  const currentEpisode = useStore((state) => state.currentEpisode);
  const setCurrentEpisode = useStore((state) => state.setCurrentEpisode);
  const clearPodcast = useStore((state) => state.clearPodcast);
  const clearCurrentEpisode = useStore((state) => state.clearCurrentEpisode);
  const { removeQueryParam, setQueryParam, removeQueryParams } = useQueryParams();

  async function handleEpisodeClick(episode: EpisodeData, index: number) {
    console.log(episode.title);
    if (currentPodcast) {
      const episodeData = await fetchEpisode(currentPodcast.id, episode.id);
      if (episodeData) {
        setCurrentEpisode(episodeData);
        setQueryParam("episode", episode.id);
      }
    }
  }

  function backToPodcasts() {
    clearCurrentEpisode();
    clearPodcast();
    removeQueryParams(["episode", "podcast"]);
    console.log("This should be first");
  };

  function backToEpisodes() {
    removeQueryParam("episode");
    clearCurrentEpisode();
  }


  return (
    <div>
      {currentPodcast && currentPodcast.episodes && !currentEpisode && (
      <>
        <h2 style={{ marginBottom: "0.3rem" }}><span style={{ color: "darkgray" }}><a href="#" onClick={backToPodcasts}>Podcasts</a> /</span> {currentPodcast.podcastName}</h2>
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
          <span style={{ color: "darkgray" }}><a href="#" onClick={backToPodcasts}>Podcasts</a> / <a onClick={backToEpisodes} href="#">{currentPodcast?.podcastName}</a> / </span>{currentEpisode.title}</h2>
      )}
    </div>
  );
};

export default SelectEpisodeComponent;
