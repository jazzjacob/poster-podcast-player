"use client"; // This is a client component 👈🏽

import styles from "./page.module.css";
import usePreload from "./hooks/usePreload";
import { useEffect, useState, useRef } from "react";
import xml2js from "xml2js";
import Image from "next/image";
import PosterGallery from "./components/PosterGallery";

export default function Home() {
  const [rssFeed, setRssFeed] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const [currentTime, setCurrentTime] = useState(-1);
  const [previousStartTime, setPreviousStartTime] = useState(-1);
  const [previousEndTime, setPreviousEndTime] = useState(-1);
  const [currentStartTime, setCurrentStartTime] = useState(-1);
  const [currentEndTime, setCurrentEndTime] = useState(-1);
  const [lowestTime, setLowestTime] = useState(-1);
  const [highestTime, setHighestTime] = useState(-1);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [episodeData, setEpisodeData] = useState<any>(null);
  const [images, setImages] = useState(null);
  // const loaded = usePreload(episodeData);
  // const loaded = usePreload(episodeData ? episodeData : []);
  const loaded = true;

  const audioRef = useRef<HTMLAudioElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const assets = [
    "/images/image1.jpg",
    "/images/image2.jpg",
    "/images/image3.jpg",
    "/audio/sample.mp3",
  ];

  useEffect(() => {
    async function fetchData() {
      const url = "https://feeds.libsyn.com/61238/rss";
      const response = await fetch(url);
      const xml = await response.text();

      const parsedData: any = await new Promise((resolve, reject) => {
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
      console.log(items);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const imageElement = imageRef.current;

    if (-1 < currentTime) {
      console.log(`Current time in state: ${currentTime}`);
      console.log(`Current startTime in state: ${currentStartTime}`);
      console.log(`Current endTime in state: ${currentEndTime}`);
      console.log(`Current image in state: ${currentImage}`);

      if (imageElement) {
        if (episodeData) {
          console.log(`Lowest: ${lowestTime}`);
          console.log(`Highest: ${highestTime}`);

          // Don't iterate before the first or after the last image
          //if (lowestTime <= currentTime && currentTime <= highestTime) {

          // Check if currentTime is outside the currentStart and currentEnd times
          if (currentTime < currentStartTime || currentEndTime < currentTime) {
            console.log(
              "This should be logged every second that an image is not viewed",
            );

            // Iterate timestamp list on every second
            episodeData.timestamps.every(
              (timestamp: { start: number; end: number; image: string }) => {
                if (
                  timestamp.start <= currentTime &&
                  currentTime <= timestamp.end
                ) {
                  console.log("We have a match!");
                  console.log(
                    `Timestamp start: ${timestamp.start} = current time: ${currentTime}`,
                  );
                  setCurrentImage(`/images/episode-59/${timestamp.image}`);
                  setCurrentStartTime(timestamp.start);
                  setCurrentEndTime(timestamp.end);
                  // Return false to end every-loop
                  return false;
                } else {
                  console.log("We do not have a match...");
                  setCurrentImage("");
                  setCurrentEndTime(-1);
                  setCurrentStartTime(-1);
                  // Return true to make every-loop keep iterating
                  return true;
                }
              },
            );

            /*
							episodeData.timestamps.forEach((timestamp, index) => {
								console.log(timestamp);

								// Check if there is a match in list
								if (timestamp.start <= currentTime && currentTime <= timestamp.end) {
									console.log("We have a match!");
									console.log(`Timestamp start: ${timestamp.start} = current time: ${currentTime}`);
									setCurrentImage(`/images/episode-59/${timestamp.image}`);
									setCurrentStartTime(timestamp.start);
									setCurrentEndTime(timestamp.end);
								} else {
									console.log("We do not have a match...");
									setCurrentImage(null);
									setCurrentEndTime(-1);
									setCurrentStartTime(-1);
								}
							});
							*/
          }
          /*} else {
  					setCurrentEndTime(-1);
  					setCurrentStartTime(-1);
  					setCurrentImage(null);
  				}*/
        } else {
          console.error("No episode data saved.");
        }

        if (currentTime <= 5) {
          imageElement.classList.add(styles.blueExampleImage);
        } else if (currentTime <= 10) {
          console.log("Hello");
          imageElement.className = "";
          imageElement.classList.add(styles.goldExampleImage);
        } else {
          imageElement.className = "";
          imageElement.classList.add(styles.exampleImage);
        }
      }
    }
  }, [currentTime]);

  useEffect(() => {
    const audioElement = audioRef.current;
    const imageElement = imageRef.current;

    const handleTimeUpdate = () => {
      if (audioElement) {
        // console.log(`Current time: ${Math.floor(audioElement.currentTime)}`);
        const audioElementTime = Math.floor(audioElement.currentTime);
        // console.log(`AudioElementTime: ${audioElementTime}`);
        // console.log(`State currentTime: ${currentTime}`)
        if (currentTime !== audioElementTime) {
          // console.log("SETTING CURRENT TIME TO STATE...")
          setCurrentTime(audioElementTime);

          // setCurrentTime(audioElementTime => audioElementTime);
        }
      }
    };

    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [audioRef.current, currentTime]);

  const playFromSpecificTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    async function fetchEpisodeData() {
      try {
        const response = await fetch("/episodes.json");
        const data = await response.json();
        console.log("Data from the new fetch:");
        console.log(data);
        setEpisodeData(data.episodes[0]);

        const timestamps = data.episodes[0].timestamps;
        setLowestTime(data.episodes[0].timestamps[0].start);
        setHighestTime(timestamps[Object.keys(timestamps)[Object.keys(timestamps).length - 1]].end);

      } catch (error) {
        console.error("Failed to fetch episode data:", error);
      }
    }

    fetchEpisodeData();
  }, []);

  useEffect(() => {
    if (episodeData) {
      console.log("Episode data:");
      console.log(episodeData);
    }
  }, [episodeData]);

  return (
    <main className={styles.main}>
      <p className={styles.greetingText}>
        Hello, this is <b>Poster Podcast Player</b>.
      </p>
      <div>
        <button onClick={() => playFromSpecificTime(62)}>Play from 1:02</button>
        <div className={styles.exampleImageContainer}>
          <p hidden>
            The image will be blue for the first five seconds, gold for the next
            five, and then be gray again.
          </p>
          <div hidden ref={imageRef} className={styles.exampleImage}></div>
          <img
            hidden
            className={styles.imageStyle}
            src="/images/episode-59/last-black-man-1.jpg"
          />
          {episodeData ? (
            <section>
              <audio
                ref={audioRef}
                controls
                src={episodeData.url}
                preload="auto"
              ></audio>
              <div>
                {currentImage ? (
                  <img className={styles.imageStyle} src={currentImage} />
                ) : (
                  <div className={styles.posterPlaceholder}></div>
                )}
              </div>
              <PosterGallery episodeData={episodeData} playFromSpecificTime={playFromSpecificTime} />
            </section>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      {/*rssFeed && (
        <div>
          <p>{rssFeed[0].title}</p>
          <audio
            ref={audioRef}
            controls
            src={rssFeed[0].enclosure[0].$.url}
          ></audio>
          <button onClick={handlePlayFromSpecificTime}>Play from 1:02</button>
          <div className={styles.exampleImageContainer}>
            <p>
              The image will be blue for the first five seconds, gold for the
              next five, and then be gray again.
            </p>
            <div ref={imageRef} className={styles.exampleImage}></div>
          </div>
        </div>
      )*/}
    </main>
  );
}
