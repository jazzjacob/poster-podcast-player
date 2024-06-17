"use client"; // This is a client component 👈🏽

import styles from "./page.module.css";
import { useEffect, useState, useRef } from 'react';
import xml2js from 'xml2js';

export default function Home() {
  const [rssFeed, setRssFeed] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const url = "https://feeds.libsyn.com/61238/rss";
      const response = await fetch(url);
      const xml = await response.text();

      const parsedData = await new Promise((resolve, reject) => {
        xml2js.parseString(xml, { trim: true }, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      const items = parsedData.rss.channel[0].item;
      setRssFeed(items);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleTimeUpdate = () => {
      if (audioElement) {
        console.log(`Current time: ${Math.floor(audioElement.currentTime)}`);
      }
    };

    if (audioElement) {
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [audioRef.current]);

  const handlePlayFromSpecificTime = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 62; // 1 minute and 2 seconds
      audioRef.current.play();
    }
  };

  return (
    <main className={styles.main}>
      <p className={styles.greetingText}>Hello, this is <b>Poster Podcast Player</b>.</p>
      {rssFeed && (
        <div>
          <p>{rssFeed[0].title}</p>
          <audio ref={audioRef} controls src={rssFeed[0].enclosure[0].$.url}></audio>
          <button onClick={handlePlayFromSpecificTime}>Play from 1:02</button>
        </div>
      )}
    </main>
  );
}
