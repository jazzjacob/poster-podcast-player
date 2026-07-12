'use client'

import { useRef, useEffect, useState } from 'react';
import useStore from '../helpers/store';
import styles from './AudioPlayer.module.css';

const DOT_OFFSET = 13;

const AudioPlayer = ({ src }: { src: string }) => {
  const currentTime = useStore((state) => state.currentTime);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const playFromTime = useStore((state) => state.playFromTime);
  const clearPlayFromTime = useStore((state) => state.clearPlayFromTime);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ensure audioRef is initialized with null
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0});
  const [sliderHover, setSliderHover] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playheadPosition, setPlayheadPosition] = useState(0);

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    const updatedTime = Math.floor(event.currentTarget.currentTime);
    if (currentTime !== updatedTime) {
      setCurrentTime(updatedTime);
    }
  };

  const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    setDuration(event.currentTarget.duration);
    setCurrentTime(event.currentTarget.currentTime);
  };

  useEffect(() => {
    calculatePlayheadPosition();
  }, [currentTime, duration, sliderWidth]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    setSliderWidth(slider.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) => {
      setSliderWidth(entry.contentRect.width);
    });
    observer.observe(slider);

    return () => observer.disconnect();
  }, []);

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
    }
  }
  
  function handlePlayPause() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  function handleSliderMouseEnter() {
    console.log("hovering!");
    setSliderHover(true);
  }

  function handleSliderMouseLeave() {
    console.log("mouse left slider!");
    setSliderHover(false);
  }

  function handleSliderMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointerPosition({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
    if (sliderWidth !== bounds.width) {
      setSliderWidth(bounds.width);
    }
  }

  function calculateSquarePosition() {
    if (pointerPosition.x < 14) {
      return 0;
    } else if (sliderWidth - 7 < pointerPosition.x) {
      return sliderWidth - (20);
    } else {
      return pointerPosition.x - DOT_OFFSET;
    }
  }

  function calculatePlayheadPosition() {
    const fraction = currentTime / duration;
    const timeX = fraction * sliderWidth;

    let placeInSlider;
    if (timeX < 14) {
      placeInSlider = 0;
    } else if (sliderWidth - 7 < timeX) {
      placeInSlider = sliderWidth - 20;
    } else {
      placeInSlider = timeX - DOT_OFFSET;
    }
    setPlayheadPosition(placeInSlider);
  }

  function positionToTimeConverter() {
    if (!duration || sliderWidth <= 0) return;

    let fraction;
    if (pointerPosition.x < 14) {
      fraction = 0;
    } else if (sliderWidth - 7 < pointerPosition.x) {
      fraction = 1;
    } else {
      fraction = pointerPosition.x / sliderWidth;
    }

    const time = duration * fraction;
    playFromSpecificTime(time);
  }

  return (
    <div>
      <audio
        style={{ width: '100%' }}
        ref={audioRef}
        src={src}
        controls
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div style={{ margin: '1rem 0', width: '100%', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={() => handlePlayPause()}>
          	play/pause
          </button>
          <button onClick={() => timelineJump(-5)}>
            Back 5 seconds
          </button>
          <button onClick={() => timelineJump(5)}>
            Skip 5 seconds
          </button>
          <button onClick={() => calculatePlayheadPosition()}>
            Calculate
          </button>
      </div>
      <div
        ref={sliderRef}
        className={styles.slider}
        onMouseEnter={handleSliderMouseEnter}
        onMouseLeave={handleSliderMouseLeave}
        onMouseMove={handleSliderMouseMove}
        onClick={() => positionToTimeConverter()}
      >
        <div
          hidden={!sliderHover}
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '10px',
            backgroundColor: 'gold',
            position: 'absolute',
            top: '5px',
            transform: `translate(${calculateSquarePosition()}px, 0px)`,
          }}>
        </div>
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '10px',
            backgroundColor: 'red',
            position: 'absolute',
            top: '5px',
            transform: `translate(${playheadPosition}px, 0px)`,
          }}>
        </div>
      </div>
      <span
        hidden={!sliderHover}
        style={{
          position: 'absolute',
          transform: `translate(${pointerPosition.x}px, ${pointerPosition.y}px)`,
          color: 'white',
          backgroundColor: 'black',
          padding: '0 4px'
      }}>{pointerPosition.x}</span>
      <p>Current time: {currentTime}</p>
      <p>Length: {duration}</p>
    </div>
  );
};

export default AudioPlayer;
