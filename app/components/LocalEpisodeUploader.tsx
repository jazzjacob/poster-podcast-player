'use client'
import { addTimestamp } from "../firebase/firestoreOperations";
import { Timestamp, UploadedImage } from "../helpers/customTypes";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function LocalEpisodeUploader() {

  const PODCAST_ID = "iUN3ZL3qFUhnVYfHVTGK";
  const EPISODE_ID = "cdcxQZezeuREfzPSwUGi";

  async function handleClick() {
    console.log('Clicking!');
    const response = await fetch('/episode-59-data.json');
    const episodeData = await response.json();

    /*
    for (const timestamp of episodeData.timestamps) {
      await addTimestampWithDelay(PODCAST_ID, EPISODE_ID, timestamp, 2000); // 2000ms delay between each iteration
    }*/

    for (const uploadedImage of episodeData.uploadedImages) {
      await addUploadedImageWithDelay(PODCAST_ID, EPISODE_ID, uploadedImage, 2000);
    }
    console.log("UPLOAD COMPLETED");
  }

  function addTimestampWithDelay(podcastId: string, episodeId: string, timestamp: Timestamp, delay: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        await addTimestamp(podcastId, episodeId, timestamp);
        console.log("adding timestamp: ", timestamp);
        resolve();
      }, delay);
    });
  }

  function addUploadedImageWithDelay(podcastId: string, episodeId: string, uploadedImage: UploadedImage, delay: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const episodeDocRef = doc(db, 'podcasts', podcastId, 'episodes', episodeId);
        await updateDoc(episodeDocRef, {
          uploadedImages: arrayUnion(uploadedImage)
        });
        console.log("adding uploadedimage: ", uploadedImage);
        resolve();
      }, delay);
    });
  }

  return (
    <button onClick={handleClick}>Upload episode</button >
  );
}

export default LocalEpisodeUploader;
