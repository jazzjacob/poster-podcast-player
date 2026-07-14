'use client'

import { useRef, useEffect, useState } from 'react';
import useStore from '../helpers/store';
import styles from './AudioPlayer.module.css';
import { TimeParts } from '../helpers/customTypes';

const PLAYHEAD_DIAMETER = 20;
const SLIDER_PADDING = 7;

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
  const [trackPointerPosition, setTrackPointerPosition] = useState({ hours: 0, minutes: 0, seconds: 0 });

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
    setSliderHover(true);
  }

  function handleSliderMouseLeave() {
    setSliderHover(false);
  }

  function handleSliderMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointerPosition({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
    if (sliderWidth !== bounds.width) {
      setSliderWidth(bounds.width);
    }

    const audioStartPosition = SLIDER_PADDING + (PLAYHEAD_DIAMETER / 2);
    const audioEndPosition = sliderWidth - SLIDER_PADDING - (PLAYHEAD_DIAMETER / 2);
    const audioAreaWidth = audioEndPosition - audioStartPosition;

    const xPosition = event.clientX - bounds.left - SLIDER_PADDING - (PLAYHEAD_DIAMETER / 2);
    console.log("x position in timeline: ", xPosition);
    const fraction = xPosition / audioAreaWidth;
    const placeInAudio = fraction * duration;

    const formattedTime = convertSecondsToFormattedTime(placeInAudio);
    console.log("formatted Time: ", formattedTime);
    setTrackPointerPosition(formattedTime);
  }

  function calculateSquarePosition() {
    if (pointerPosition.x < 17) {
      return 7;
    } else if (sliderWidth - 17 < pointerPosition.x) {
      return sliderWidth - (27);
    } else {
      return pointerPosition.x - (PLAYHEAD_DIAMETER / 2);
    }
  }

  function calculatePlayheadPosition() {

    const audioStartPosition = SLIDER_PADDING + (PLAYHEAD_DIAMETER / 2);
    const audioEndPosition = sliderWidth - SLIDER_PADDING - (PLAYHEAD_DIAMETER / 2);
    const audioAreaWidth = audioEndPosition - audioStartPosition;
    
    const audioTrackProgress = currentTime / duration;
    const audioAreaPosition = audioTrackProgress * audioAreaWidth;
    const pointerPosition = audioAreaPosition + (PLAYHEAD_DIAMETER / 2) + SLIDER_PADDING;

    let newPlayheadPosition;
    if (pointerPosition < audioStartPosition) {
      newPlayheadPosition = SLIDER_PADDING;
    } else if (audioEndPosition < pointerPosition) {
      newPlayheadPosition = audioEndPosition - 10;
    } else {
      newPlayheadPosition = pointerPosition - (PLAYHEAD_DIAMETER / 2);
    }
    setPlayheadPosition(newPlayheadPosition);
  }

  function positionToTimeConverter() {
    if (!duration || sliderWidth <= 0) return;

    const audioStartPosition = SLIDER_PADDING + (PLAYHEAD_DIAMETER / 2);
    const audioEndPosition = sliderWidth - SLIDER_PADDING - (PLAYHEAD_DIAMETER / 2);
    const audioAreaWidth = audioEndPosition - audioStartPosition;

    const pointerPositionInAudioArea = pointerPosition.x - PLAYHEAD_DIAMETER - SLIDER_PADDING;

    const audioFraction = (pointerPositionInAudioArea + (PLAYHEAD_DIAMETER / 2)) / audioAreaWidth;
    playFromSpecificTime(duration * audioFraction);
  }

  function convertSecondsToFormattedTime(seconds: number) {
    // 60 s = 1 m
    // 3600 s = 1 h

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);
    console.log("hours: ", hours);
    console.log("minutes: ", minutes);
    console.log("seconds: ", s);

    return {
      hours: hours,
      minutes: minutes,
      seconds: s
    };
  }

function formatTime({ hours, minutes, seconds }: TimeParts) {
    let formattedHours = null;
    let formattedMinutes = null;
    let formattedSeconds = null;

    // Format hours
    if (0 < hours && hours < 10) {
      formattedHours = `${hours}`;
    } else if (10 <= hours) {
      formattedHours = `${hours}`;
    }

    // Format minutes
    if (minutes < 10 && 0 < hours) {
      formattedMinutes = `0${minutes}`
    } else {
      formattedMinutes = `${minutes}`
    }


    // Format seconds
    if (seconds < 10) {
      formattedSeconds = `0${seconds}`;
    } else {
      formattedSeconds = `${seconds}`;
    }

    if (seconds < 0) return `00:00`;
    if (formattedHours == null) return `${formattedMinutes}:${formattedSeconds}`;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }

  return (
    <>
      <audio
        style={{ width: '100%' }}
        ref={audioRef}
        src={src}
        controls
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    <div style={{
      backgroundColor: 'lightblue',
      padding: '1rem',
      paddingTop: '0.2rem',
      width: '100vw',
      position: 'fixed',
      bottom: '0',
      left: '0',
      zIndex: 999
    }}>
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
          style={{
            width: `${playheadPosition}px`,
            height: '7px',
            backgroundColor: 'black',
            position: 'absolute',
            left: '14px',
            borderRadius: '30px 0 0 30px',
            zIndex: 99
          }}
        >
        </div>
        <div
          style={{
            width: `${sliderWidth - 30}px`,
            height: '7px',
            backgroundColor: 'darkgray',
            position: 'absolute',
            left: '14px',
            borderRadius: '30px'
          }}
        >
        </div>
        <div
          hidden={true}
          style={{
            width: `${PLAYHEAD_DIAMETER}px`,
            height: `${PLAYHEAD_DIAMETER}px`,
            borderRadius: `${PLAYHEAD_DIAMETER / 2}px`,
            backgroundColor: 'gold',
            position: 'absolute',
            top: '5px',
            transform: `translate(${calculateSquarePosition()}px, 0px)`,
          }}>
        </div>
        <div
          style={{
            width: `${PLAYHEAD_DIAMETER}px`,
            height: `${PLAYHEAD_DIAMETER}px`,
            borderRadius: `${PLAYHEAD_DIAMETER / 2}px`,
            backgroundColor: 'black',
            position: 'absolute',
            top: '5px',
            transform: `translate(${playheadPosition}px, 0px)`,
            zIndex: 100
          }}>
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between'
      }}>
        <p style={{
        }}>{formatTime(convertSecondsToFormattedTime(currentTime))}</p>
        <p>{formatTime(convertSecondsToFormattedTime(duration))}</p>
      </div>
      <span
        hidden={!sliderHover}
        style={{
          position: 'absolute',
          transform: `translate(${pointerPosition.x - 25}px, ${-73}px)`,
          color: 'white',
          backgroundColor: 'black',
          padding: '0 4px'
      }}>{formatTime({hours: trackPointerPosition.hours, minutes: trackPointerPosition.minutes, seconds: trackPointerPosition.seconds})}</span>
    </div>
    </>
  );
};

export default AudioPlayer;
