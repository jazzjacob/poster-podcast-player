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

const containerStyle = {
  minHeight: "300px",
  width: "100%",
  border: '1px solid lightgray',
  padding: '1rem',
  marginBottom: '2rem',
  backgroundColor: '#363636',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '1rem'
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
    <div style={containerStyle}>
      {currentTimestamp.images.length > 0 ? (
        currentTimestamp.images.map((image) => (
          <img
            alt={`${image.image}`}
            key={image.id}
            style={{ height: "500px", border: "1px solid #e3e3e3" }}
            src={image.image}
          />
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
