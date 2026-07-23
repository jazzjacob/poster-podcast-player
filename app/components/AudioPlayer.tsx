'use client'

import { useRef, useEffect, useState } from 'react';
import useStore from '../helpers/store';
import styles from './AudioPlayer.module.css';
import { TimeParts } from '../helpers/customTypes';

const PLAYHEAD_DIAMETER = 20;
const SLIDER_PADDING = 7;

const playerTimeStyle: React.CSSProperties = {
  fontSize: '14px',
  width: '75px',
  textAlign: 'center'
};

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);

const Back5Icon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    <text x="12" y="12" fontSize="10" fontFamily="sans-serif" fontWeight="medium" stroke="none" fill="currentColor" textAnchor="middle" dominantBaseline="central">5</text>
  </svg>
);

const Forward5Icon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    <text x="12" y="12" fontSize="10" fontFamily="sans-serif" fontWeight="medium" stroke="none" fill="currentColor" textAnchor="middle" dominantBaseline="central">5</text>
  </svg>
);

type AudioPlayerProps = {
  src: string;
  episodeTitle?: string;
  podcastName?: string;
  artworkUrl?: string;
};

const AudioPlayer = ({ src, episodeTitle, podcastName, artworkUrl }: AudioPlayerProps) => {
  const currentTime = useStore((state) => state.currentTime);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const playFromTime = useStore((state) => state.playFromTime);
  const clearPlayFromTime = useStore((state) => state.clearPlayFromTime);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ensure audioRef is initialized with null
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0});
  const [sliderHover, setSliderHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
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
    if (isDragging) return;
    calculatePlayheadPosition();
  }, [currentTime, duration, sliderWidth, isDragging]);

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

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: episodeTitle || '',
      artist: podcastName || '',
      artwork: artworkUrl ? [{ src: artworkUrl, sizes: '600x600', type: 'image/jpeg' }] : [],
    });

    navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play());
    navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
    navigator.mediaSession.setActionHandler('seekbackward', () => timelineJump(-5));
    navigator.mediaSession.setActionHandler('seekforward', () => timelineJump(5));

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
    };
  }, [episodeTitle, podcastName, artworkUrl]);

  const playFromSpecificTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      audioRef.current.play();
    }
  };

  function timelineJump(addedTime: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = audio.currentTime + addedTime;
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

  function handleSliderPointerEnter(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return;
    setSliderHover(true);
  }

  function handleSliderPointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || isDragging) return;
    setSliderHover(false);
  }

  function updateTrackPointerFromPosition(clientX: number, updatePlayhead: boolean) {
    const slider = sliderRef.current;
    if (!slider) return;

    const bounds = slider.getBoundingClientRect();
    setPointerPosition({ x: clientX - bounds.left, y: 0 });
    if (sliderWidth !== bounds.width) {
      setSliderWidth(bounds.width);
    }

    const audioStartPosition = SLIDER_PADDING + (PLAYHEAD_DIAMETER / 2);
    const audioEndPosition = sliderWidth - SLIDER_PADDING - (PLAYHEAD_DIAMETER / 2);
    const audioAreaWidth = audioEndPosition - audioStartPosition;

    const xPosition = clientX - bounds.left - SLIDER_PADDING - (PLAYHEAD_DIAMETER / 2);
    const fraction = xPosition / audioAreaWidth;
    const placeInAudio = fraction * duration;

    const formattedTime = convertSecondsToFormattedTime(placeInAudio);
    setTrackPointerPosition(formattedTime);

    if (updatePlayhead) {
      setPlayheadPosition(calculatePlayheadPositionFromFraction(fraction));
    }
  }

  function handleSliderPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(true);
    setSliderHover(true);
    updateTrackPointerFromPosition(event.clientX, true);
    positionToTimeConverter(event.clientX);
    ensurePlaybackStarted();
  }

  function handleSliderPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || isDragging) return;
    updateTrackPointerFromPosition(event.clientX, false);
  }

  useEffect(() => {
    if (!isDragging) return;

    function handleWindowPointerMove(event: PointerEvent) {
      updateTrackPointerFromPosition(event.clientX, true);
    }

    function handleWindowPointerUp(event: PointerEvent) {
      setIsDragging(false);
      positionToTimeConverter(event.clientX);
      if (event.pointerType !== 'mouse') {
        setSliderHover(false);
      }
    }

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, [isDragging, duration, sliderWidth]);

  function calculateSquarePosition() {
    if (pointerPosition.x < 17) {
      return 7;
    } else if (sliderWidth - 17 < pointerPosition.x) {
      return sliderWidth - (27);
    } else {
      return pointerPosition.x - (PLAYHEAD_DIAMETER / 2);
    }
  }

  function calculatePlayheadPositionFromFraction(audioFraction: number) {
    const audioStartPosition = SLIDER_PADDING + (PLAYHEAD_DIAMETER / 2);
    const audioEndPosition = sliderWidth - SLIDER_PADDING - (PLAYHEAD_DIAMETER / 2);
    const audioAreaWidth = audioEndPosition - audioStartPosition;

    const audioAreaPosition = audioFraction * audioAreaWidth;
    const pointerPosition = audioAreaPosition + (PLAYHEAD_DIAMETER / 2) + SLIDER_PADDING;

    if (pointerPosition < audioStartPosition) {
      return SLIDER_PADDING;
    } else if (audioEndPosition < pointerPosition) {
      return audioEndPosition - 10;
    } else {
      return pointerPosition - (PLAYHEAD_DIAMETER / 2);
    }
  }

  function calculatePlayheadPosition() {
    const audioTrackProgress = currentTime / duration;
    setPlayheadPosition(calculatePlayheadPositionFromFraction(audioTrackProgress));
  }

  function positionToTimeConverter(clientX: number) {
    if (!duration || sliderWidth <= 0) return;

    const slider = sliderRef.current;
    if (!slider) return;

    const bounds = slider.getBoundingClientRect();
    const clickX = clientX - bounds.left;

    const audioStartPosition = SLIDER_PADDING + (PLAYHEAD_DIAMETER / 2);
    const audioEndPosition = sliderWidth - SLIDER_PADDING - (PLAYHEAD_DIAMETER / 2);
    const audioAreaWidth = audioEndPosition - audioStartPosition;

    const pointerPositionInAudioArea = clickX - PLAYHEAD_DIAMETER - SLIDER_PADDING;

    const audioFraction = (pointerPositionInAudioArea + (PLAYHEAD_DIAMETER / 2)) / audioAreaWidth;
    if (audioRef.current) {
      audioRef.current.currentTime = duration * audioFraction;
    }
  }

  function ensurePlaybackStarted() {
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.play();
    }
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

    if (seconds < 0) return `0:00`;
    if (formattedHours == null) return `${formattedMinutes}:${formattedSeconds}`;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }

  return (
    <>
      <audio
        hidden
        style={{ width: '100%' }}
        ref={audioRef}
        src={src}
        controls
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => {
          setIsPlaying(true);
          if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
        }}
        onPause={() => {
          setIsPlaying(false);
          if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
        }}
      />
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, .8)',
      backdropFilter: 'saturate(180%) blur(20px)',
      padding: '1rem',
      paddingTop: '0.2rem',
      width: '100vw',
      position: 'fixed',
      bottom: '0',
      left: '0',
      borderTop: '1px solid rgba(201, 201, 201, 0.8)',
      boxShadow: 'rgba(50, 50, 93, 0.1) 0px -6px 12px 4px, rgba(0, 0, 0, 0.1) 0px -3px 7px -3px',
      zIndex: 999
    }}>
      <div style={{ margin: '1rem 0', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => timelineJump(-5)}
            aria-label="Back 5 seconds"
            title="Back 5 seconds"
          >
            <Back5Icon />
          </button>
          <button
            type="button"
            className={`${styles.controlButton} ${styles.playButton}`}
            onClick={() => handlePlayPause()}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => timelineJump(5)}
            aria-label="Skip 5 seconds"
            title="Skip 5 seconds"
          >
            <Forward5Icon />
          </button>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between'
      }}>
        <p style={playerTimeStyle}>{formatTime(convertSecondsToFormattedTime(currentTime))}</p>
        <div
          ref={sliderRef}
          className={styles.slider}
          onPointerEnter={handleSliderPointerEnter}
          onPointerLeave={handleSliderPointerLeave}
          onPointerMove={handleSliderPointerMove}
          onPointerDown={handleSliderPointerDown}
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
          <span
            hidden={!sliderHover}
            style={{
              position: 'absolute',
              left: `${pointerPosition.x}px`,
              top: '-30px',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              color: 'white',
              backgroundColor: 'black',
              padding: '0 4px',
              zIndex: 101
          }}>{formatTime({hours: trackPointerPosition.hours, minutes: trackPointerPosition.minutes, seconds: trackPointerPosition.seconds})}</span>
        </div>
        <p style={playerTimeStyle}>{formatTime(convertSecondsToFormattedTime(duration))}</p>
      </div>
    </div>
    </>
  );
};

export default AudioPlayer;
