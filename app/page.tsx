"use client"; // This is a client component 👈🏽

import styles from "./page.module.css";
// import usePreload from "./hooks/usePreload";
import { useEffect, useState, useRef, useCallback } from "react";
//import xml2js from "xml2js";
//import Image from "next/image";

import PosterGallery from "./components/PosterGallery";
import EditModePosterGallery from "./components/edit-mode/EditModePosterGallery";
import EditModePosterView from "./components/edit-mode/EditModePosterView";
import EditModeTimeForm from "./components/edit-mode/EditModeTimeForm";
import EditModeTimestamps from "./components/edit-mode/EditModeTimestamps";
import ReadDocumentComponent from "./components/ReadDocumentComponent";
import ImageUploadComponent from "./components/edit-mode/ImageUploadComponent";

import { Timestamp, TimestampImage, EpisodeData, EditModeData, EditModeTime, OverlapDetails, defaultEditModeTime, defaultEditModeData, nullEpisode, defaultExampleTimestamps, examplePodcastData, exampleEpisodeData } from "@/app/helpers/customTypes";
import { generateId, checkOverlap, removeObjectFromArrayByKey, setGlobalStateFromFirebase } from "@/app/helpers/functions";
import CreateDocumentComponent from "./components/CreateDocumentComponent";
import CreatePodcastComponent from "./components/CreatePodcastComponent";
import AddEpisodeComponent from "./components/AddEpisodeComponent";
import AuthComponent from "./components/AuthComponent";
import AddTimestampComponent from "./components/AddTimestampComponent";
import useStore from "./helpers/store";
import { updateTimestamp, addTimestampToEpisode, deleteTimestamp } from "./firebase/firestoreOperations";
import SelectPodcastComponent from "./components/SelectPodcastComponent";
import SelectEpisodeComponent from "./components/SelectEpisodeComponent";

export default function Home() {
  // const [rssFeed, setRssFeed] = useState(null); Save for possible future use
  const [currentTime, setCurrentTime] = useState(-1);
  const [currentStartTime, setCurrentStartTime] = useState(-1);
  const [currentEndTime, setCurrentEndTime] = useState(-1);
  const [currentImages, setCurrentImages] = useState<TimestampImage[]>([]);
  // const [episodeData, setEpisodeData] = useState<EpisodeData>(nullEpisode);
  const [editMode, setEditMode] = useState(false);
  const [currentEditModeData, setCurrentEditModeData] = useState<EditModeData>(defaultEditModeData);
  const [userIsEditing, setUserIsEditing] = useState(false);
  const [editModeTime, setEditModeTime] = useState(defaultEditModeTime);

  const [exampleTimestamps, setExampleTimestamps] = useState(defaultExampleTimestamps);

  const [loading, setLoading] = useState(false);
  const [podcastId, setPodcastId] = useState<string>("");
  const [episodeId, setEpisodeId] = useState<string>("");

  const PODCAST_ID = "Or17ZeOG5b1VkWZz2mMc";
  const EPISODE_ID = "DC1zdnuSW9Y7VVSFeDyP";

  const episodeData = useStore((state) => state.currentEpisode);
  const setEpisodeData = useStore((state) => state.setCurrentEpisode);
  const podcastData = useStore((state) => state.podcast);
  const globalState = useStore((state) => state);


  // const loaded = usePreload(episodeData);
  // const loaded = usePreload(episodeData ? episodeData : []);
  // const loaded = true;

  const audioRef = useRef<HTMLAudioElement>(null);

  const updatePodcastState = useStore((state) => state.setPodcasts);
  const setCurrentEpisode = useStore((state) => state.setCurrentEpisode);
  const currentEpisode = useStore((state) => state.currentEpisode);
  const user = useStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // podcastId, episodeId
        setGlobalStateFromFirebase(podcastId, episodeId);
      } catch (error) {
        console.error("Error setting global :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [podcastId, episodeId]);

  useEffect(() => {
    if (episodeData) {
      setEpisodeId(episodeData.id);
    }
  }, [episodeData])

  useEffect(() => {
    if (podcastData) {
      setPodcastId(podcastData.id);
    }
  }, [podcastData]);

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

  /*async function fetchData() {
    const data = await GET();
    console.log(data);
  }

  useEffect(() => {
    fetchData();
  }, []);*/

  const updateEditModeTime = useCallback((
    field: keyof EditModeTime,
    timeInSeconds: number,
    ) => {
    setEditModeTime((prevData) => ({
      ...prevData,
      [field]: {
        hours: Math.floor(timeInSeconds / 60 / 60) % 24,
        minutes: Math.floor(timeInSeconds / 60) % 60,
        seconds: timeInSeconds % 60,
      },
    }));
  }, [])

  // Helper function to handle updating edit mode times
  const handleEditModeTimes = useCallback((currentTime: number) => {
    if (!currentEditModeData.startTimeSaved) {
      updateEditModeTime("startTime", currentTime);
      updateEditModeTime("endTime", currentTime);
    }
    if (!currentEditModeData.endTimeSaved) {
      updateEditModeTime('endTime', currentTime);
    }
  }, [currentEditModeData, updateEditModeTime]);

  // Helper function to reset current data to default values
  const resetCurrentData = useCallback(() => {
    setCurrentEndTime(-1);
    setCurrentStartTime(-1);
    setCurrentImages([]);
  }, [setCurrentEndTime, setCurrentStartTime, setCurrentImages]);

  // Helper function to handle timestamps iteration
  const handleTimestampsIteration = useCallback((currentTime: number) => {
    episodeData && episodeData.timestamps && episodeData.timestamps.every((timestamp) => {
      //console.log("timestamp check:");
      //console.log(timestamp);
      if (timestamp.start <= currentTime && currentTime <= timestamp.end) {
        setCurrentImages(timestamp.images);
        setCurrentStartTime(timestamp.start);
        setCurrentEndTime(timestamp.end);
        return false; // Break the loop
      } else {
        if (currentEndTime !== -1 || currentStartTime !== -1 || currentImages.length > 0) {
          resetCurrentData();
          return false; // Break the loop
        }
        return true; // Continue the loop
      }
    });
  }, [episodeData, currentEndTime, currentStartTime, currentImages.length, resetCurrentData]);

  // ON CURRENT TIME UPDATE - EVERY SECOND AUDIO IS PLAYING
  useEffect(() => {
    //console.log("current time");
    //console.log(currentTime);
    if (-1 < currentTime) {

      handleEditModeTimes(currentTime);

      if (episodeData) {
        // Check if currentTime is outside the currentStart and currentEnd times
        if (currentTime < currentStartTime || currentEndTime < currentTime) {
          handleTimestampsIteration(currentTime);
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
    currentEditModeData.endTimeSaved,
    handleEditModeTimes,
    handleTimestampsIteration
  ]);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleTimeUpdate = () => {
      //console.log("Updating time");
      if (audioElement) {
        const audioElementTime = Math.floor(audioElement.currentTime);
        if (currentTime !== audioElementTime) {
          setCurrentTime(audioElementTime);
        }
      }
    };

    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
    } else {
      console.log("No audio element found");
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
        //console.log("Data from the new fetch:");
        //console.log(data);

        //setEpisodeData(data.episodes[0]);

        // Set timestamps from edit mode to episodeData
      } catch (error) {
        console.error("Failed to fetch episode data:", error);
      }
    }

    fetchEpisodeData();

  }, []);

  /*useEffect(() => {
    if (episodeData && episodeData.timestamps.length > 0 && episodeData.timestamps !== exampleTimestamps) {
      console.log("EPISODE DATA: LOOK HERE");
      setEpisodeData((prevEpisodeData) => ({
        ...prevEpisodeData,
        timestamps: exampleTimestamps
      }));
    }
  }, [exampleTimestamps, episodeData.timestamps]);*/

  // USE EFFECTS FOR HELP IN DEVELOPMENT

  useEffect(() => {
    if (episodeData) {
      //console.log("Episode data:");
      //console.log(episodeData);
    }
  }, [episodeData]);

  useEffect(() => {
    if (currentEditModeData.images.length > 0) {
      if (!currentEditModeData.startTimeSaved) {
        updateEditModeData("startTimeSaved", true);
        updateEditModeTime("endTime", currentTime);
      }
    } else {
      if (currentEditModeData.startTimeSaved) {
        updateEditModeData("startTimeSaved", false);
        updateEditModeTime("startTime", currentTime);
        updateEditModeTime("endTime", currentTime);
      }
    }
  }, [
    currentEditModeData.images,
    currentEditModeData.startTimeSaved,
    currentTime,
    updateEditModeTime
  ]);

  useEffect(() => {
    //console.log("Sorting the timestamps...");
    const sortedTimestamps = exampleTimestamps.sort((a, b) => a.start - b.start);
    setExampleTimestamps(sortedTimestamps);
  }, [exampleTimestamps]);


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
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  function removeEditModeImage(image: string) {
    removeEditModeData(image);
  }

  // Save new timestamp in Edit Mode
  async function handleSave() {
    const startTime = convertEditModeTimeToSeconds(editModeTime.startTime);
    const endTime = convertEditModeTimeToSeconds(editModeTime.endTime);

    //console.log("currentEditModeData");
    //console.log(currentEditModeData);
    const overlapResults = checkOverlap(startTime, endTime, currentEditModeData.timestampId, episodeData?.timestamps || []);
    //console.log("overlapResults");
    //console.log(overlapResults);

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
          const updatedTimestamp: Partial<Timestamp> = {
            start: startTime,
            end: endTime,
            images: [...currentEditModeData.images]
          }

          if (episodeData && episodeData.timestamps) {
            // Update a timestamp for real here... in firebase...
            await updateTimestamp(podcastId, episodeId, currentEditModeData.timestampId, updatedTimestamp)
            await setGlobalStateFromFirebase(podcastId, episodeId);
          }
          const updatedExampleTimestamps = exampleTimestamps.filter(item => item.id !== updatedTimestamp.id);
          // updatedExampleTimestamps.push(updatedTimestamp);
          setExampleTimestamps(updatedExampleTimestamps);

        } else {
          // Creating a new timestamp
          const newTimestamp: Timestamp = {
            id: generateId(),
            start: startTime,
            end: endTime,
            images: [...currentEditModeData.images],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          //console.log("newTimestamp:")
          //console.log(newTimestamp);

          const updatedExampleTimestamps = exampleTimestamps.filter(item => item.id !== newTimestamp.id);
          updatedExampleTimestamps.push(newTimestamp);
          setExampleTimestamps(updatedExampleTimestamps);
          // Real save (CREATE TIMESTAMP) should happen here... only logging for now...
          await addTimestampToEpisode(podcastId, episodeId, newTimestamp);
          await setGlobalStateFromFirebase(podcastId, episodeId);

          //console.log(convertEditModeTimeToSeconds(editModeTime.startTime));
        }

        pauseAudio();

        // Reset relevant states
        setCurrentEditModeData(defaultEditModeData);
        updateEditModeTime("startTime", currentTime);
        updateEditModeTime("endTime", currentTime);
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

  function handleCancel() {
    updateEditModeTime('startTime', currentTime);
    updateEditModeTime('endTime', currentTime);
    setCurrentEditModeData(defaultEditModeData);
  };

  async function handleDelete() {
    const timestampId = currentEditModeData.timestampId;
    console.log("Delete timestamp with id: ", timestampId);
    if (podcastId) {
      const deleted = await deleteTimestamp(podcastId, episodeId, timestampId);
      if (deleted) {
        setGlobalStateFromFirebase(podcastId, episodeId);
        handleCancel();
      }
    }

    /*
    console.log(currentEditModeData);
    const arrayWithoutItem = removeObjectFromArrayByKey([...exampleTimestamps], "id", timestampId);
    setExampleTimestamps(arrayWithoutItem);
    console.log(arrayWithoutItem);
    handleCancel();
    */
  }

  return (
    <main className={styles.main}>
      <p className={styles.greetingText}>
        Hello, this is <b>Poster Podcast Player</b>.
      </p>
      <AuthComponent />
      <SelectPodcastComponent setPodcastId={setPodcastId} setEpisodeId={setEpisodeId}  />
      <SelectEpisodeComponent />
      <p>{ podcastId !== "" ? `Podcast set with id: ${podcastId}` : 'No podcast chosen'}</p>
      {/*<ReadDocumentComponent idToFetch="KqiCQr3O4hucEQvbupKL" />*/}
      {/*<AddTimestampComponent podcastId="KqiCQr3O4hucEQvbupKL" episodeId="LynfNei4oTT5RC9tBiou" />*/}
      {/*<CreatePodcastComponent podcastData={examplePodcastData} />*/}
      {/*<AddEpisodeComponent podcastId="KqiCQr3O4hucEQvbupKL" episodeData={exampleEpisodeData} />*/}

      {user && (
        <div>
          <h2>Admin stuff</h2>
          {podcastId && episodeId && (
            <button onClick={() => setGlobalStateFromFirebase(podcastId, episodeId)}>Set Global State</button>
          )}
          <button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Turn off edit mode" : "Turn on edit mode"}
          </button>
          <CreatePodcastComponent podcastData={examplePodcastData} />
          {podcastId && (
            <AddEpisodeComponent podcastId={podcastId} episodeData={exampleEpisodeData} />
          )}
        </div>
      )}
      {episodeData && (
        <section className={styles.titleSection}>
          <h2>{episodeData.title}</h2>
          {podcastData && podcastData.podcastName && (
            <p>{podcastData.podcastName}</p>
          )}
        </section>
      )}

      {
        <audio
          ref={audioRef}
          controls
          src={episodeData ? episodeData.url : ""}
          preload="auto"
        ></audio>
      }
      <div className={styles.audioButtonContainer}>
        <button className={styles.skipButton} onClick={() => timelineJump(-5)}>
          Back 5 seconds
        </button>
        <button className={styles.skipButton} onClick={() => timelineJump(5)}>
          Skip 5 seconds
        </button>
      </div>

      {/* NORMAL MODE */}
      {(!editMode || !user) ? (
        <div>
          {/*<button onClick={() => playFromSpecificTime(62)}>Play from 1:02</button>*/}
          <div className={styles.exampleImageContainer}>
            {episodeData && episodeData.timestamps && episodeData.timestamps.length > 0 ? (
              <section>
                <div>
                  {currentImages.length > 0 ? (
                    currentImages.map((image) => (
                      <img
                        alt={`${image.image}`}
                        key={image.id}
                        className={styles.imageStyle}
                        src={image.image}
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
              <p>Loading images or no images uploaded...</p>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.editModeContainer}>
          {/* EDIT MODE */}
          <h2>EDIT MODE</h2>
          <div>
            <h3>Poster view</h3>
              {
                episodeData && (
                   <EditModePosterView episodeData={episodeData} currentImages={currentEditModeData.images} currentEditModeData={currentEditModeData} editModeTime={editModeTime} currentTime={currentTime} setEditModeTime={setEditModeTime} setUserIsEditing={setUserIsEditing} />
                )
              }
            <div>
              {/*<EditModeTimeForm timeType="startTime" currentEditModeData={currentEditModeData} editModeTime={editModeTime} currentTime={currentTime} setEditModeTime={setEditModeTime} setUserIsEditing={setUserIsEditing} /> */}
              {/*<EditModeTimeForm timeType="endTime" currentEditModeData={currentEditModeData} editModeTime={editModeTime} currentTime={currentTime} setEditModeTime={setEditModeTime} setUserIsEditing={setUserIsEditing} />*/}
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
              <button
                  disabled={!(currentEditModeData.images.length > 0)}
                  onClick={handleDelete}
              >
                Delete
              </button>
            </div>
            <div style={{ margin: "0.5rem", display: "flex", gap: "1rem"}}>
              <button onClick={() => playFromSpecificTime(currentEditModeData.startTime)}  disabled={!(currentEditModeData.images.length > 0)}>Go to start time</button >
              <button onClick={() => playFromSpecificTime(currentEditModeData.endTime)}  disabled={!(currentEditModeData.images.length > 0)}>Go to end time</button >
            </div >
          </div>
            {podcastId && episodeId && (
              <ImageUploadComponent podcastId={podcastId} episodeId={episodeId}  />
            )}
          <div>
            <h3>Timestamps</h3>
              <EditModeTimestamps updateEditModeTime={updateEditModeTime} setCurrentEditModeData={setCurrentEditModeData} timestamps={exampleTimestamps}  />
          </div>
          <div>
            <h3>Gallery / uploaded images</h3>
            {episodeData && (
              <EditModePosterGallery
                episodeData={episodeData}
                currentImages={currentEditModeData.images}
                addImage={addEditModeImage}
                removeImage={removeEditModeImage}
                currentTime={currentTime}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
