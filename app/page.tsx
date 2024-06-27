"use client"; // This is a client component 👈🏽

import styles from "./page.module.css";
import usePreload from "./hooks/usePreload";
import { useEffect, useState, useRef } from "react";
import xml2js from "xml2js";
import Image from "next/image";
import PosterGallery from "./components/PosterGallery";
import EditModePosterGallery from "./components/edit-mode/EditModePosterGallery";
import EditModePosterView from "./components/edit-mode/EditModePosterView";

interface Timestamp {
  start: number;
  end: number;
  image: string;
};

interface UploadedImage {
  id: string;
  image: string;
  used: boolean;
  timestampIds: string[];
};


interface EpisodeData {
  episodeNumber: number;
  url: string;
  localPath: string;
  podcastName: string,
  title: string;
  episodeImage: string;
  timestamps: Timestamp[];
  uploadedImages: UploadedImage[];
};

const nullEpisode: EpisodeData = {
  episodeNumber: 0,
  url: "",
  localPath: "",
  podcastName: "",
  title: "",
  episodeImage: "",
  timestamps: [],
  uploadedImages: []
};


export default function Home() {
  const [rssFeed, setRssFeed] = useState(null);
  const [currentTime, setCurrentTime] = useState(-1);
  const [currentStartTime, setCurrentStartTime] = useState(-1);
  const [currentEndTime, setCurrentEndTime] = useState(-1);
  const [lowestTime, setLowestTime] = useState(-1);
  const [highestTime, setHighestTime] = useState(-1);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [episodeData, setEpisodeData] = useState<EpisodeData>(nullEpisode);
  const [editMode, setEditMode] = useState(false);
  const [currentImagesInEditMode, setCurrentImagesInEditMode] = useState<string[]>([]);
  // const loaded = usePreload(episodeData);
  // const loaded = usePreload(episodeData ? episodeData : []);
  // const loaded = true;

  const audioRef = useRef<HTMLAudioElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
          }
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
        const audioElementTime = Math.floor(audioElement.currentTime);
        if (currentTime !== audioElementTime) {
          setCurrentTime(audioElementTime);
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

  useEffect(() => {
    console.log("Current images in edit mode")
    console.log(currentImagesInEditMode)
  }, [currentImagesInEditMode]);

  function timelineJump(addedTime: number) {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime + addedTime;
      audioRef.current.play();
    }
  }

  function addEditModeImage(image: string) {
    setCurrentImagesInEditMode(prevItems => [...prevItems, image]);
  }

  function removeEditModeImage(image: string) {
    setCurrentImagesInEditMode(currentImagesInEditMode.filter(img => img !== image)); // will return ['A', 'C']);
  }

  return (
    <main className={styles.main}>
      <p className={styles.greetingText}>
        Hello, this is <b>Poster Podcast Player</b>.
      </p>
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Turn off edit mode" : "Turn on edit mode"}
      </button>
      {episodeData.timestamps.length > 0 && (
        <section className={styles.titleSection}>
          <h2>{episodeData.title}</h2>
          <p>{episodeData.podcastName}</p>
        </section>
      )}
      <audio
        ref={audioRef}
        controls
        src={episodeData.url}
        preload="auto"
      ></audio>
      <div className={styles.audioButtonContainer}>
        <button className={styles.skipButton} onClick={() => timelineJump(-5)}>Back 5 seconds</button>
        <button className={styles.skipButton} onClick={() => timelineJump(5)}>Skip 5 seconds</button>
      </div>

      {!editMode ? (
        <div>
          {/*<button onClick={() => playFromSpecificTime(62)}>Play from 1:02</button>*/}
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
            {episodeData.timestamps.length > 0 ? (
              <section>
                <div>
                  {currentImage ? (
                    <img className={styles.imageStyle} src={currentImage} />
                  ) : (
                    episodeData.episodeImage != "" ? (
                        <img className={styles.imageStyle} src={episodeData.episodeImage} />
                      ) : (
                        <div className={styles.posterPlaceholder}></div>
                      )
                  )}
                </div>
                <PosterGallery episodeData={episodeData} playFromSpecificTime={playFromSpecificTime} />
              </section>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.editModeContainer}>
          <h2>EDIT MODE</h2>
          <div>
            <h3>Poster view</h3>
            <EditModePosterView episodeData={episodeData} currentImages={currentImagesInEditMode} />
          </div>
          <div>
            <h3>Timestamps</h3>
          </div>
          <div>
            <h3>Gallery</h3>
            <EditModePosterGallery
              episodeData={episodeData}
              setCurrentImagesInEditMode={setCurrentImagesInEditMode}
              currentImages={currentImagesInEditMode}
              addImage={addEditModeImage}
              removeImage={removeEditModeImage}
            />
          </div>
        </div>
      )}


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
