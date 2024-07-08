"use client"; // This is a client component 👈🏽

import styles from "./page.module.css";
// import usePreload from "./hooks/usePreload";
import { useEffect, useState, useRef } from "react";
//import xml2js from "xml2js";
//import Image from "next/image";

import PosterGallery from "./components/PosterGallery";
import EditModePosterGallery from "./components/edit-mode/EditModePosterGallery";
import EditModePosterView from "./components/edit-mode/EditModePosterView";
import EditModeTimeForm from "./components/edit-mode/EditModeTimeForm";
import EditModeTimestamps from "./components/edit-mode/EditModeTimestamps";

import { Timestamp, TimestampImage, EpisodeData, EditModeData, EditModeTime, OverlapDetails, defaultEditModeTime, defaultEditModeData, nullEpisode, defaultExampleTimestamps } from "@/app/helpers/customTypes";
import { generateId, checkOverlap } from "@/app/helpers/functions";

export default function Home() {
  // const [rssFeed, setRssFeed] = useState(null); Save for possible future use
  const [currentTime, setCurrentTime] = useState(-1);
  const [currentStartTime, setCurrentStartTime] = useState(-1);
  const [currentEndTime, setCurrentEndTime] = useState(-1);
  const [currentImages, setCurrentImages] = useState<TimestampImage[]>([]);
  const [episodeData, setEpisodeData] = useState<EpisodeData>(nullEpisode);
  const [editMode, setEditMode] = useState(false);
  const [currentEditModeData, setCurrentEditModeData] = useState<EditModeData>(defaultEditModeData);
  const [userIsEditing, setUserIsEditing] = useState(false);
  const [editModeTime, setEditModeTime] = useState(defaultEditModeTime);

  const [exampleTimestamps, setExampleTimestamps] = useState(defaultExampleTimestamps);
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

      if (!currentEditModeData.startTimeSaved) {
        updateEditModeTime("startTime", currentTime);
        updateEditModeTime("endTime", currentTime);
      }

      if (!currentEditModeData.endTimeSaved) {
        updateEditModeTime('endTime', currentTime);
      }

      if (episodeData) {
        // Check if currentTime is outside the currentStart and currentEnd times
        if (currentTime < currentStartTime || currentEndTime < currentTime) {
          // Iterate timestamps on every second
          episodeData.timestamps.every((timestamp: Timestamp) => {
            console.log("Iterating timestamps every second");

            // Check if currentTime matches timestamp in iteration
            if (
              timestamp.start <= currentTime &&
              currentTime <= timestamp.end
            ) {
              console.log(
                `Timestamp start: ${timestamp.start} = current time: ${currentTime}`,
              );
              setCurrentImages(timestamp.images);
              setCurrentStartTime(timestamp.start);
              setCurrentEndTime(timestamp.end);

              // Return false to end every-loop
              return false;
            } else {
              // CurrentTime does not match any timestamps
              // SET CURRENT DATA TO DEFAULT VALUES
              if (
                currentEndTime != -1 ||
                currentStartTime != -1 ||
                currentImages.length > 0
              ) {
                console.log("ReSetting end and start times");
                setCurrentEndTime(-1);
                setCurrentStartTime(-1);
                setCurrentImages([]);
                return false;
              }

              // Return true to make every-loop keep iterating
              return true;
            }
          });
        }
      } else {
        console.error("No episode data saved.");
      }
    }
  }, [
    currentTime,
    currentEndTime,
    currentImages.length,
    currentStartTime,
    episodeData,
    userIsEditing,
    currentEditModeData.startTimeSaved,
    currentEditModeData.endTimeSaved
  ]);

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
  }, [currentTime]);

  useEffect(() => {
    async function fetchEpisodeData() {
      try {
        const response = await fetch("/episodes.json");
        const data = await response.json();
        console.log("Data from the new fetch:");
        console.log(data);
        setEpisodeData(data.episodes[0]);
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
    console.log("Current images in edit mode");
    console.log(currentEditModeData.images);

    if (currentEditModeData.images.length > 0) {
      if (!currentEditModeData.startTimeSaved) {
        console.log("EDIT MODE START TIME SHOULD BE SAVED NOW");
        updateEditModeData("startTimeSaved", true);
        updateEditModeTime("endTime", currentTime);
      }
    } else {
      if (currentEditModeData.startTimeSaved) {
        console.log(
          "EDIT MODE START TIME SHOULD BE RESETTED NOW (STARTS TICKING AGAIN)",
        );
        updateEditModeData("startTimeSaved", false);
        updateEditModeTime("startTime", currentTime);
        updateEditModeTime("endTime", currentTime);
      }
    }
  }, [
    currentEditModeData.images,
    currentEditModeData.startTimeSaved,
    currentTime,
  ]);

  useEffect(() => {
    console.log("Current edit mode data:");
    console.log(currentEditModeData);
  }, [currentEditModeData]);

  useEffect(() => {
    console.log("editModeTime: ");
    console.log(editModeTime);
  }, [editModeTime]);

  // FUNCTIONS

  const playFromSpecificTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      audioRef.current.play();
    }
  };

  function pauseAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
    } else {
      console.error("Can not pause audio: Audioref not found!");
    }
  }

  function convertEditModeTimeToSeconds(time: {
    hours: number;
    minutes: number;
    seconds: number;
  }) {
    return time.hours * 60 * 60 + time.minutes * 60 + time.seconds;
  }

  function timelineJump(addedTime: number) {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime + addedTime;
      audioRef.current.play();
    }
  }

  function addEditModeImage(image: string) {
    if (currentEditModeData.images.length == 0) {
      updateEditModeData("startTime", currentTime);
    }
    updateEditModeData("images", {
      id: generateId(),
      image: image,
      description: "",
    });
  }

  function removeEditModeImage(image: string) {
    removeEditModeData(image);
  }

  // Save new timestamp in Edit Mode
  function handleSave() {
    const startTime = convertEditModeTimeToSeconds(editModeTime.startTime);
    const endTime = convertEditModeTimeToSeconds(editModeTime.endTime);

    const overlapResults = checkOverlap(startTime, endTime, exampleTimestamps);
    console.log("OVERLAP RESULTS");
    console.log(overlapResults);

    if (overlapResults.isOverlap) {
      console.log("NOT SAVED! OVERLAPPING");
    }

    if (!overlapResults.isOverlap) {
      if (startTime == endTime) {
        console.log("Did not save! Start time and end time can't be the same.");
      } else if (startTime > endTime) {
        console.log("End time can't be less than start time");
      } else if (startTime < endTime) {
        // SAVE NEW TIMESTAMP

        // Check if updating a timestamp
        // Handle save accordingly
        if (currentEditModeData.timestampId !== "") {
          console.log("CURRENTLY UPDATING A TIMESTAMP");
          const updatedTimestamp: Timestamp = {
            id: currentEditModeData.timestampId,
            start: startTime,
            //start: currentEditModeData.startTime,
            end: endTime,
            images: [...currentEditModeData.images],
          }

          const updatedExampleTimestamps = exampleTimestamps.filter(item => item.id !== updatedTimestamp.id);

          setExampleTimestamps([...updatedExampleTimestamps, updatedTimestamp]);

        } else {
          // Creating a new timestamp
          const newTimestamp: Timestamp = {
            id: generateId(),
            start: startTime,
            //start: currentEditModeData.startTime,
            end: endTime,
            images: [...currentEditModeData.images],
          };
          console.log("newTimestamp:")
          console.log(newTimestamp);
          setExampleTimestamps([...exampleTimestamps, newTimestamp]);
          // Real save should happen here... only logging for now...

          console.log(convertEditModeTimeToSeconds(editModeTime.startTime));
        }

        pauseAudio();



        // Reset relevant states
        setCurrentEditModeData(defaultEditModeData);
        updateEditModeTime("startTime", currentTime);
        updateEditModeTime("endTime", currentTime);
        /*setCurrentImagesInEditMode([]);*/
      } else {
        console.error("Something went wrong with saving!");
      }
    }
  }

  // Function to update a specific field in the currentEditModeData object
  const updateEditModeData = (
    field: keyof EditModeData,
    value: string | number | TimestampImage | boolean,
  ) => {
    if (field == "images") {
      // Type assertion to ensure value is of type TimestampImage
      const newImage = value as TimestampImage;

      setCurrentEditModeData((prevData) => ({
        ...prevData,
        images: [...prevData.images, newImage],
      }));
    } else {
      setCurrentEditModeData((prevData) => ({ ...prevData, [field]: value }));
    }
  };

  // Function to remove a tag from the tags array
  const removeEditModeData = (image: string) => {
    setCurrentEditModeData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((img) => img.image !== image),
    }));
  };

  function updateEditModeTime(
    field: keyof EditModeTime,
    timeInSeconds: number,
  ) {
    setEditModeTime((prevData) => ({
      ...prevData,
      [field]: {
        hours: Math.floor(timeInSeconds / 60 / 60) % 24,
        minutes: Math.floor(timeInSeconds / 60) % 60,
        seconds: timeInSeconds % 60,
      },
    }));
  }

  function handleCancel() {
    updateEditModeTime('startTime', currentTime);
    updateEditModeTime('endTime', currentTime);
    setCurrentEditModeData(defaultEditModeData);
  };

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
        <button className={styles.skipButton} onClick={() => timelineJump(-5)}>
          Back 5 seconds
        </button>
        <button className={styles.skipButton} onClick={() => timelineJump(5)}>
          Skip 5 seconds
        </button>
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
                    currentImages.map((image) => (
                      <img
                        alt={`${image.image}`}
                        key={image.id}
                        className={styles.imageStyle}
                        src={`/images/episode-59/${image.image}`}
                      />
                    ))
                  ) : (
                    <img
                      alt={`${episodeData.episodeImage}`}
                      className={styles.imageStyle}
                      src={episodeData.episodeImage}
                    />
                  )}
                </div>
                <PosterGallery
                  episodeData={episodeData}
                  playFromSpecificTime={playFromSpecificTime}
                />
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
            <EditModePosterView
              episodeData={episodeData}
              currentImages={currentEditModeData.images}
            />
            <div>
              <EditModeTimeForm
                timeType="startTime"
                currentEditModeData={currentEditModeData}
                editModeTime={editModeTime}
                currentTime={currentTime}
                setEditModeTime={setEditModeTime}
                setUserIsEditing={setUserIsEditing}
              />
              <EditModeTimeForm
                timeType="endTime"
                currentEditModeData={currentEditModeData}
                editModeTime={editModeTime}
                currentTime={currentTime}
                setEditModeTime={setEditModeTime}
                setUserIsEditing={setUserIsEditing}
              />
            </div>
            <div className={styles.editModeButtonContainer}>
              <button
                disabled={!(currentEditModeData.images.length > 0)}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                disabled={!(currentEditModeData.images.length > 0)}
                onClick={() => updateEditModeTime("startTime", currentTime)}
              >
                Update start time
              </button>
              <button
                disabled={!(currentEditModeData.images.length > 0)}
                onClick={() => handleCancel()}
              >
                Cancel
              </button>
            </div>
          </div>
          <div>
            <h3>Timestamps</h3>
              <EditModeTimestamps updateEditModeTime={updateEditModeTime} setCurrentEditModeData={setCurrentEditModeData} timestamps={exampleTimestamps}  />
          </div>
          <div>
            <h3>Gallery</h3>
            <EditModePosterGallery
              episodeData={episodeData}
              currentImages={currentEditModeData.images}
              addImage={addEditModeImage}
              removeImage={removeEditModeImage}
              currentTime={currentTime}
            />
          </div>
        </div>
      )}
    </main>
  );
}
