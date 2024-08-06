'use client'

import { EpisodeData, nullEpisode, Timestamp } from "../helpers/customTypes";
import useStore from "../helpers/store";
import { useEffect, useState, useCallback } from "react";
import styles from './PosterView.module.css'

const defaultTimestamp: Timestamp = {
  id: "",
  start: -1,
  end: -1,
  images: [],
  createdAt: new Date(),
  updatedAt: new Date()
};


function PosterView({ episode }: { episode: EpisodeData }) {
  const currentTime = useStore((store) => store.currentTime);
  const [currentTimestamp, setCurrentTimestamp] = useState<Timestamp>(defaultTimestamp);

  const resetCurrentData = useCallback(() => {
    setCurrentTimestamp(defaultTimestamp);
  }, []);

  // Helper function to handle timestamps iteration
  const handleTimestampsIteration = useCallback(() => {
    episode && episode.timestamps && episode.timestamps.some((timestamp) => {
      if (timestamp.start <= currentTime && currentTime <= timestamp.end) {
        setCurrentTimestamp(timestamp);
        return true; // Break the loop
      } else {
        if (currentTimestamp.start !== -1 || currentTimestamp.end !== -1 || currentTimestamp?.images.length > 0) {
          resetCurrentData();
        }
        return false; // Continue the loop
      }
    });
  }, [episode, currentTimestamp, resetCurrentData, currentTime]);

  useEffect(() => {
    if (currentTime > -1) {
      if (episode && episode.timestamps.length > 0) {
        // Check if currentTime is outside the currentStart and currentEnd times
        if (currentTime < currentTimestamp.start || currentTimestamp.end < currentTime) {
          handleTimestampsIteration();
        }
      } else {
        console.error("No episode data or timestamps found.");
      }
    } else {
      console.warn("Current time is not set or invalid:", currentTime);
    }
  }, [currentTime, episode, currentTimestamp, handleTimestampsIteration]);

  return (
    <div className={styles.container}>
      {currentTimestamp.images.length > 0 ? (
        currentTimestamp.images.map((image) => (
          <div className={styles.posterContainer} key={image.id}>
          <img
            alt={`${image.image}`}
            className={styles.poster}
            src={image.image}
          />
        </div >
        ))
      ) : (
        <img
          alt={`${episode.episodeImage}`}
          style={{ height: "300px", border: "1px solid #e3e3e3" }}
          src={episode.episodeImage}
        />
      )}
    </div>
  );
};

export default PosterView;
