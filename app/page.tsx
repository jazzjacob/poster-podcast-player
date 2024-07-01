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

import { Timestamp, TimestampImage, EpisodeData, EditModeData, EditModeTime, defaultEditModeTime, defaultEditModeData, nullEpisode } from "@/app/helpers/customTypes";

export default function Home() {
  // const [rssFeed, setRssFeed] = useState(null); Save for possible future use
  const [currentTime, setCurrentTime] = useState(-1);
  const [currentStartTime, setCurrentStartTime] = useState(-1);
  const [currentEndTime, setCurrentEndTime] = useState(-1);
  const [lowestTime, setLowestTime] = useState(-1);
  const [highestTime, setHighestTime] = useState(-1);
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

  // FETCH DATA FROM POSTER BOYS RSS FEED
  // Save for possible future use
  /*
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
      //setRssFeed(items);
      //console.log(items);
    }

    fetchData();
  }, []);
  */

  // ON CURRENT TIME UPDATE - EVERY SECOND AUDIO IS PLAYING
  useEffect(() => {

    if (-1 < currentTime) {
      console.log(`Current time in state: ${currentTime}`);
      console.log(`Current startTime in state: ${currentStartTime}`);
      console.log(`Current endTime in state: ${currentEndTime}`);

      if (!userIsEditing) {
        updateEditModeTime(currentTime);
      }

      if (episodeData) {
        console.log(`Lowest: ${lowestTime}`);
        console.log(`Highest: ${highestTime}`);

        // Don't iterate before the first or after the last image
        //if (lowestTime <= currentTime && currentTime <= highestTime) {

        // Check if currentTime is outside the currentStart and currentEnd times
        if (currentTime < currentStartTime || currentEndTime < currentTime) {

          // Iterate timestamps on every second
          episodeData.timestamps.every((timestamp: Timestamp) => {

              // Check if currentTime matches timestamp in iteration
              if (timestamp.start <= currentTime && currentTime <= timestamp.end) {
                console.log(`Timestamp start: ${timestamp.start} = current time: ${currentTime}`);
                setCurrentImages(timestamp.images);
                setCurrentStartTime(timestamp.start);
                setCurrentEndTime(timestamp.end);

                // Return false to end every-loop
                return false;

              } else {
                // CurrentTime does not match any timestamps
                // SET CURRENT DATA TO DEFAULT VALUES
                if (currentEndTime != -1 || currentStartTime != -1) {
                  setCurrentEndTime(-1);
                  setCurrentStartTime(-1);
                }
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
  }, [currentTime]);

  useEffect(() => {
    const audioElement = audioRef.current;

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




  // USE EFFECTS FOR HELP IN DEVELOPMENT

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




  // FUNCTIONS

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

  // Save new timestamp in Edit Mode
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

      {/* NORMAL MODE */}
      {!editMode ? (
        <div>
          {/*<button onClick={() => playFromSpecificTime(62)}>Play from 1:02</button>*/}
          <div className={styles.exampleImageContainer}>
            {episodeData.timestamps.length > 0 ? (
              <section>
                <div>
                  {currentImages.length > 0 ? (
                    currentImages.map((image) => <img key={image.id} className={styles.imageStyle} src={`/images/episode-59/${image.image}`} />)
                  ) : (
                    <img className={styles.imageStyle} src={episodeData.episodeImage} />
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
          {/* EDIT MODE */}
          <h2>EDIT MODE</h2>
          <div>
            <h3>Poster view</h3>
            <EditModePosterView episodeData={episodeData} currentImages={currentEditModeData.images} />
            <div>
              <p>Start time {currentEditModeData.images.length > 0 && "✅"}</p>
              <EditModeTimeForm editModeTime={editModeTime} currentTime={currentTime} setEditModeTime={setEditModeTime} setUserIsEditing={setUserIsEditing} />
            </div>
            <button disabled={!(currentEditModeData.images.length > 0)} onClick={handleSave}>
              Save
            </button>
          </div>
          <div>
            <h3>Timestamps</h3>
          </div>
          <div>
            <h3>Gallery</h3>
            <EditModePosterGallery episodeData={episodeData} setCurrentImagesInEditMode={setCurrentImagesInEditMode} currentImages={currentImagesInEditMode} addImage={addEditModeImage} removeImage={removeEditModeImage} currentTime={currentTime} />
          </div>
        </div>
      )}
    </main>
  );
}
