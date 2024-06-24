// hooks/usePreload.js

import { useState, useEffect } from 'react';

const usePreload = (imagePaths) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    };

    const promises = imagePaths.map((src) => preloadImage(src));

    Promise.all(promises)
      .then(() => setLoaded(true))
      .catch((err) => console.error('Failed to preload images:', err));
  }, [imagePaths]);

  return loaded;
};

export default usePreload;