'use client'

import { fetchEpisode } from "../firebase/firestoreOperations";
import { EpisodeData, nullEpisode, Timestamp } from "../helpers/customTypes";
import useStore from "../helpers/store";
import { useEffect, useState, useCallback } from "react";

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
    <div style={{ minHeight: "25rem" }}>
      <p>This is PosterView</p>
      <p>Current time: {currentTime}</p>
      {currentTimestamp.images.length > 0 ? (
        currentTimestamp.images.map((image) => (
          <img
            alt={`${image.image}`}
            key={image.id}
            style={{ height: "200px" }}
            src={image.image}
          />
        ))
      ) : (
        <img
          alt={`${episode.episodeImage}`}
          style={{ height: "200px" }}
          src={episode.episodeImage}
        />
      )}
    </div>
  );
};

export default PosterView;
