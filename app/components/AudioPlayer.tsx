'use client'

import { useRef } from 'react';
import useStore from '../helpers/store';

const AudioPlayer = ({ src }: { src: string }) => {
  const currentTime = useStore((state) => state.currentTime);
  const setCurrentTime = useStore((state) => state.setCurrentTime);

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    const updatedTime = Math.floor(event.currentTarget.currentTime);
    if (currentTime !== updatedTime) {
      console.log("Current time", updatedTime);
      setCurrentTime(updatedTime);
    }
  };

  return (
    <div>
      <audio
        src={src}
        controls
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};

export default AudioPlayer;
