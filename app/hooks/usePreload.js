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

		console.log("Episode data in usePreload:");
		console.log(episodeData);
    const promises = episodeData.timestamps.map((timestamp) => preloadImage(timestamp.image));

    Promise.all(promises)
      .then(() => setLoaded(true))
      .catch((err) => console.error('Failed to preload images:', err));
  }, [episodeData]);

  return loaded;
};

export default usePreload;