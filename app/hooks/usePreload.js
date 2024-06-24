// hooks/usePreload.js

import { useState, useEffect } from 'react';

const usePreload = (episodeData) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
  	console.log("Episode data in usePreload:");
		console.log(episodeData);
  
  	if (!episodeData || episodeData.length === 0) {
      return;
    }
  
    const preloadImage = (image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `/images/episode-59/${image}`;
        img.onload = resolve;
        img.onerror = reject;
      });
    };
    
    const preloadAudio = () => {
      return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.src = "/podcasts/posterboys-059-2019inreview.mp3";
        audio.oncanplaythrough = resolve;
        audio.onerror = reject;
      });
    };


		console.log("Episode data in usePreload:");
		console.log(episodeData);
		
    // const promises = episodeData.timestamps.map((timestamp) => preloadImage(timestamp.image));
    
    const imagePromises = episodeData.timestamps.map((timestamp) => preloadImage(timestamp.image));
    const audioPromise = preloadAudio();
    
   Promise.all([...imagePromises, audioPromise])
      .then(() => setLoaded(true))
      .catch((err) => console.error('Failed to preload assets:', err));
  }, [episodeData]);

  return loaded;
};

export default usePreload;