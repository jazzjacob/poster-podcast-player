"use client"; // This is a client component 👈🏽

import styles from "./page.module.css";
import usePreload from "./hooks/usePreload";
import { useEffect, useState, useRef } from "react";
import xml2js from "xml2js";
import Image from "next/image";

import PosterGallery from "./components/PosterGallery";
import EditModePosterGallery from "./components/edit-mode/EditModePosterGallery";
import EditModePosterView from "./components/edit-mode/EditModePosterView";
import EditModeTimeForm from "./components/edit-mode/EditModeTimeForm";

import { Timestamp, TimestampImage, EpisodeData, EditModeData, EditModeTime } from "@/app/helpers/customTypes";

// Default value for editModeData
const defaultEditModeData: EditModeData = {
  startTime: -1,
  endTime: -1,
  images: [],
};

// Default value for episodeData
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

const defaultEditModeTime: EditModeTime = {
  startTime: {
    hours: -1,
    minutes: -1,
    seconds: -1
  },
  endTime: {
    hours: -1,
    minutes: -1,
    seconds: -1
  }
};

export default function Home() {
  const [rssFeed, setRssFeed] = useState(null);
  const [currentTime, setCurrentTime] = useState(-1);
  const [currentStartTime, setCurrentStartTime] = useState(-1);
  const [currentEndTime, setCurrentEndTime] = useState(-1);
  const [lowestTime, setLowestTime] = useState(-1);
  const [highestTime, setHighestTime] = useState(-1);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [currentImages, setCurrentImages] = useState<TimestampImage[]>([]);
  const [episodeData, setEpisodeData] = useState<EpisodeData>(nullEpisode);
  const [editMode, setEditMode] = useState(false);
  const [currentImagesInEditMode, setCurrentImagesInEditMode] = useState<string[]>([]);
  const [currentEditModeData, setCurrentEditModeData] = useState<EditModeData>(defaultEditModeData);
  const [userIsEditing, setUserIsEditing] = useState(false);
  const [editModeTime, setEditModeTime] = useState(defaultEditModeTime);
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

  // EVERY SECOND AUDIO IS PLAYING
  useEffect(() => {
    const imageElement = imageRef.current;

    if (-1 < currentTime) {
      console.log(`Current time in state: ${currentTime}`);
      console.log(`Current startTime in state: ${currentStartTime}`);
      console.log(`Current endTime in state: ${currentEndTime}`);
      console.log(`Current image in state: ${currentImage}`);

      if (!userIsEditing) {
        updateEditModeTime(currentTime);
      }

      if (true || imageElement) {
        if (episodeData) {
          console.log(`Lowest: ${lowestTime}`);
          console.log(`Highest: ${highestTime}`);

          // Don't iterate before the first or after the last image
          //if (lowestTime <= currentTime && currentTime <= highestTime) {

          // Check if currentTime is outside the currentStart and currentEnd times
          if (currentTime < currentStartTime || currentEndTime < currentTime) {

            // Iterate timestamp list on every second
            episodeData.timestamps.every(
              (timestamp: Timestamp) => {
                if (
                  timestamp.start <= currentTime &&
                  currentTime <= timestamp.end
                ) {
                  console.log("We have a match!");
                  console.log(
                    `Timestamp start: ${timestamp.start} = current time: ${currentTime}`,
                  );
                  setCurrentImage(`/images/episode-59/${timestamp.images[0]}`);
                  console.log("Images: ");
                  console.log(timestamp.images);
                  setCurrentImages(timestamp.images);
                  setCurrentStartTime(timestamp.start);
                  setCurrentEndTime(timestamp.end);
                  // Return false to end every-loop
                  return false;
                } else {
                  setCurrentImage("");
                  setCurrentEndTime(-1);
                  setCurrentStartTime(-1);
                  if (currentImages.length > 0) {
                    setCurrentImages([]);
                  }
                  // Return true to make every-loop keep iterating
                  return true;
                }
              },
            );
          }
        } else {
          console.error("No episode data saved.");
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

  useEffect(() => {
    console.log("Current edit mode data:");
    console.log(currentEditModeData);
  }, [currentEditModeData]);

  function timelineJump(addedTime: number) {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime + addedTime;
      audioRef.current.play();
    }
  }

  function addEditModeImage(image: string) {
    if (currentEditModeData.images.length == 0) {
      updateEditModeData('startTime', currentTime);
    }
    updateEditModeData('images', {
      id: "123",
      image: image,
      description: ""
    });
    setCurrentImagesInEditMode(prevItems => [...prevItems, image]);
  }

  function removeEditModeImage(image: string) {
    setCurrentImagesInEditMode(currentImagesInEditMode.filter(img => img !== image)); // will return ['A', 'C']);
    removeEditModeData(image);
  }

  // Saving new timestamp in Edit Mode
  function handleSave() {
    console.log("Gonna try and save new timestamp...");
    if (currentEditModeData.startTime == currentTime) {
      console.log("Did not save! Start time and end time can't be the same.");
    } else if (currentTime < currentEditModeData.startTime) {
      console.log("End time can't be less than start time");
    } else if (currentEditModeData.startTime < currentTime) {
      const newTimestamp: Timestamp = {
        id: "123",
        start: currentEditModeData.startTime,
        end: currentTime,
        images: [...currentEditModeData.images]
      };
      console.log(newTimestamp);
      setCurrentEditModeData(defaultEditModeData);
    } else {
      console.error("Something went wrong with saving!");
    }
  }

  // Function to update a specific field in the currentEditModeData object
  const updateEditModeData = (field: keyof EditModeData, value: string | number | TimestampImage) => {
    if (field == "images") {
      // Type assertion to ensure value is of type TimestampImage
      const newImage = value as TimestampImage;

      setCurrentEditModeData(prevData => ({
        ...prevData,
        images: [...prevData.images, newImage],
      }));
    } else {
      setCurrentEditModeData(prevData => ({ ...prevData, [field]: value }));
    }
  };

  // Function to remove a tag from the tags array
  const removeEditModeData = (image: string) => {
    setCurrentEditModeData(prevData => ({
      ...prevData,
      images: prevData.images.filter(img => img.image !== image),
    }));
  };

  function updateEditModeTime(timeInSeconds: number) {
    setEditModeTime({
      startTime: {
        hours: Math.floor(timeInSeconds / 60 / 60) % 24,
        minutes: Math.floor(timeInSeconds / 60) % 60,
        seconds: timeInSeconds % 60
      },
      endTime: {
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    });
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
            {episodeData.timestamps.length > 0 ? (
              <section>
                <div>
                  {
                    currentImages.length > 0 ? (
                      currentImages.map((image) => <img key={image.id} className={styles.imageStyle} src={`/images/episode-59/${image.image}`} />)
                      ) : (
                        <img className={styles.imageStyle} src={episodeData.episodeImage} />
                      )
                  }
                  {/*currentImage ? (
                    <img className={styles.imageStyle} src={currentImage} />
                  ) : (
                    episodeData.episodeImage != "" ? (
                        <img className={styles.imageStyle} src={episodeData.episodeImage} />
                      ) : (
                        <div className={styles.posterPlaceholder}></div>
                      )
                  )*/}
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
            <EditModePosterView episodeData={episodeData} currentImages={currentEditModeData.images} />
            <div>
              <p>start time {currentEditModeData.images.length > 0 && "✅"}</p>
              <EditModeTimeForm
                editModeTime={editModeTime}
                currentTime={currentTime}
                setEditModeTime={setEditModeTime}
                setUserIsEditing={setUserIsEditing}
              />
            </div>
            <button
              disabled={!(currentEditModeData.images.length > 0)}
              onClick={handleSave}
            >
              Save
            </button>
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
              currentTime={currentTime}
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
