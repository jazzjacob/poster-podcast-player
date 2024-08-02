'use client'

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { EpisodeData, Timestamp, UploadedImage } from "../helpers/customTypes";

function DataDownloader() {

  const PODCAST_ID = "iUN3ZL3qFUhnVYfHVTGK";
  const EPISODE_ID = "cdcxQZezeuREfzPSwUGi";

  async function fetchEpisode(podcastId: string, episodeId: string): Promise<EpisodeData | null> {
    try {
      //console.log("Fetching the episode...");
      const episodeDocRef = doc(db, 'podcasts', podcastId, 'episodes', episodeId);
      const episodeDocSnap = await getDoc(episodeDocRef);

      if (episodeDocSnap.exists()) {
        const episodeData = episodeDocSnap.data() as EpisodeData;

        // Fetch timestamps sub-collection
        console.log("Fetching the timestamps...");

        const timestampsRef = collection(db, 'podcasts', podcastId, 'episodes', episodeId, 'timestamps');
        const timestampsQuerySnapshot = await getDocs(timestampsRef);

        const timestamps: Timestamp[] = [];
        timestampsQuerySnapshot.forEach(timestampDoc => {
          const timestampData = timestampDoc.data() as Timestamp;
          timestampData.id = timestampDoc.id; // Store the timestamp ID
          timestamps.push(timestampData);
        });

        // Add timestamps to episode data
        episodeData.timestamps = timestamps;

        // Fetch uploadedImages sub-collection
        const uploadedImagesRef = collection(db, 'podcasts', podcastId, 'episodes', episodeId, 'uploadedImages');
        const uploadedImagesQuerySnapshot = await getDocs(uploadedImagesRef);

        const uploadedImages: UploadedImage[] = [];
        uploadedImagesQuerySnapshot.forEach(uploadedImageDoc => {
          const uploadedImageData = uploadedImageDoc.data() as UploadedImage;
          uploadedImageData.id = uploadedImageDoc.id; // Store the uploadedImage ID
          //console.log("uploadedImageDoc.id")
          //console.log(uploadedImageDoc.id);
          uploadedImages.push(uploadedImageData);
        });

        // Add uploadedImages to episode data
        episodeData.uploadedImages = uploadedImages;

        episodeData.id = episodeDocSnap.id; // Store the episode ID
        console.log("Look here:");
        console.log(episodeData);
        return episodeData;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (e) {
      console.error("Error fetching episode: ", e);
      return null;
    }
  }

  return (
    <button onClick={() => fetchEpisode(PODCAST_ID, EPISODE_ID)}>Download the data</button>
  );
}

export default DataDownloader;
