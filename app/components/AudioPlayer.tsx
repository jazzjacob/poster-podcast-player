'use client'

import { useRef, useEffect } from 'react';
import useStore from '../helpers/store';

const AudioPlayer = ({ src }: { src: string }) => {
  const currentTime = useStore((state) => state.currentTime);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const playFromTime = useStore((state) => state.playFromTime);
  const clearPlayFromTime = useStore((state) => state.clearPlayFromTime);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ensure audioRef is initialized with null

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    const updatedTime = Math.floor(event.currentTarget.currentTime);
    if (currentTime !== updatedTime) {
      console.log("Current time", updatedTime);
      setCurrentTime(updatedTime);
    }
  };

  useEffect(() => {
    if (-1 < playFromTime) {
      playFromSpecificTime(playFromTime);
      clearPlayFromTime();
    }
  }, [playFromTime, clearPlayFromTime]);

  const playFromSpecificTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      audioRef.current.play();
    }
  };

  function timelineJump(addedTime: number) {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime + addedTime;
      audioRef.current.play();
    }
  }

  return (
    <div>
      <audio
        style={{ width: '100%' }}
        ref={audioRef}
        src={src}
        controls
        onTimeUpdate={handleTimeUpdate}
      />
      <div style={{ margin: '1rem 0', width: '100%', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button>Play</button>
        <button onClick={() => timelineJump(-5)}>
          Back 5 seconds
        </button>
        <button onClick={() => timelineJump(5)}>
          Skip 5 seconds
        </button >
      </div >
    </div>
  );
};

export default AudioPlayer;
