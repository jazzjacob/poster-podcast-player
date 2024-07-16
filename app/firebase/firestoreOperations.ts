import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, setDoc, arrayUnion } from "firebase/firestore";
import { PodcastData, EpisodeData, Timestamp, UploadedImage } from '../helpers/customTypes';

// Create
export async function createDocument(data: any): Promise<void> {
  try {
    const docRef = await addDoc(collection(db, "podcasts"), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Read
export async function fetchPodcastById(id: string): Promise<PodcastData | null> {
  try {
    const podcastDocRef = doc(db, 'podcasts', id);
    const podcastDocSnap = await getDoc(podcastDocRef);

    if (podcastDocSnap.exists()) {
      // Retrieve podcast data
      const podcastData = podcastDocSnap.data() as PodcastData;

      // Fetch episodes from the 'episodes' sub-collection
      const episodesCollectionRef = collection(podcastDocRef, 'episodes');
      const episodesQuerySnapshot = await getDocs(episodesCollectionRef);

      // Map episodes from QuerySnapshot to EpisodeData array
      const episodes: EpisodeData[] = [];
      episodesQuerySnapshot.forEach((episodeDoc) => {
        episodes.push(episodeDoc.data() as EpisodeData);
      });

      // Assign episodes array to podcastData
      podcastData.episodes = episodes;

      console.log("Document data:", podcastData);
      return podcastData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error reading document: ", e);
    return null;
  }
}
/*
export async function readDocument(id: string): Promise<any> {
  try {
    const docRef = doc(db, "podcasts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error reading document: ", e);
    return null;
  }
}
*/

export async function fetchEpisodes(podcastId: string): Promise<EpisodeData[]> {
  try {
    const episodesCollectionRef = collection(db, 'podcasts', podcastId, 'episodes');
    const episodesQuerySnapshot = await getDocs(episodesCollectionRef);

    const episodes: EpisodeData[] = [];
    episodesQuerySnapshot.forEach((episodeDoc) => {
      episodes.push(episodeDoc.data() as EpisodeData);
    });

    return episodes;
  } catch (e) {
    console.error("Error fetching episodes: ", e);
    return [];
  }
};

export async function fetchEpisode(podcastId: string, episodeId: string): Promise<EpisodeData | null> {
  try {
    console.log("Fetching the episode...");
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
        console.log("timestampDoc.id")
        console.log(timestampDoc.id);
        console.log("timestampData.id");
        console.log(timestampData.id);
        timestamps.push(timestampData);
      });

      console.log("timestamps");
      console.log(timestamps);

      // Add timestamps to episode data
      episodeData.timestamps = timestamps;

      // Fetch uploadedImages sub-collection
      const uploadedImagesRef = collection(db, 'podcasts', podcastId, 'episodes', episodeId, 'uploadedImages');
      const uploadedImagesQuerySnapshot = await getDocs(uploadedImagesRef);

      const uploadedImages: UploadedImage[] = [];
      uploadedImagesQuerySnapshot.forEach(uploadedImageDoc => {
        const uploadedImageData = uploadedImageDoc.data() as UploadedImage;
        uploadedImageData.id = uploadedImageDoc.id; // Store the uploadedImage ID
        console.log("uploadedImageDoc.id")
        console.log(uploadedImageDoc.id);
        uploadedImages.push(uploadedImageData);
      });

      // Add uploadedImages to episode data
      episodeData.uploadedImages = uploadedImages;

      episodeData.id = episodeDocSnap.id; // Store the episode ID
      console.log("episodeData in fetch");
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

/*
export async function fetchEpisode(podcastId: string, episodeId: string): Promise<EpisodeData | null> {
  try {
    const episodeDocRef = doc(db, 'podcasts', podcastId, 'episodes', episodeId);
    const episodeDocSnap = await getDoc(episodeDocRef);

    if (episodeDocSnap.exists()) {
      const episodeData = episodeDocSnap.data() as EpisodeData;
      return episodeData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error fetching episode: ", e);
    return null;
  }
}*/

export async function fetchAllPodcasts(): Promise<PodcastData[]> {
  try {
    const podcastsQuerySnapshot = await getDocs(collection(db, "podcasts"));
    const podcasts: PodcastData[] = [];

    // Iterate through each podcast document
    for (const podcastDocument of podcastsQuerySnapshot.docs) {
      const podcastData = podcastDocument.data() as PodcastData;
      podcastData.id = podcastDocument.id; // Ensure the ID is set

      // Fetch episodes subcollection for each podcast
      const episodesQuerySnapshot = await getDocs(collection(db, "podcasts", podcastDocument.id, "episodes"));
      const episodes: EpisodeData[] = [];

      // Iterate through each episode document and add to episodes array
      episodesQuerySnapshot.forEach(episodeDocument => {
        const episodeData = episodeDocument.data() as EpisodeData;
        episodeData.id = episodeDocument.id; // Ensure the ID is set
        episodes.push(episodeData);
      });

      // Attach the episodes array to the podcast data
      podcastData.episodes = episodes;
      podcasts.push(podcastData);
    }

    return podcasts;
  } catch (e) {
    console.error("Error fetching podcasts: ", e);
    return [];
  }
}

// Update
export async function updateDocument(id: string, updatedData: any): Promise<void> {
  try {
    const docRef = doc(db, "your-collection-name", id);
    await updateDoc(docRef, updatedData);
    console.log("Document updated");
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}

/*
export async function addTimestampToEpisode(podcastId: string, episodeId: string, timestamp: Timestamp): Promise<void> {
  try {
    const episodeDocRef = doc(db, 'podcasts', podcastId, 'episodes', episodeId);

    // Add the new timestamp to the timestamps array using arrayUnion
    await updateDoc(episodeDocRef, {
      timestamps: arrayUnion(timestamp)
    });

    console.log("Timestamp added successfully");
  } catch (e) {
    console.error("Error adding timestamp: ", e);
    throw e; // Re-throw the error to handle it elsewhere if needed
  }
}
*/

// Delete
export async function deleteDocument(id: string): Promise<void> {
  try {
    const docRef = doc(db, "your-collection-name", id);
    await deleteDoc(docRef);
    console.log("Document deleted");
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}


export async function createPodcast(podcast: PodcastData): Promise<void> {
  try {
    // Check if a podcast with the same name already exists
    const podcastsRef = collection(db, 'podcasts');
    const queryRef = query(podcastsRef, where('podcastName', '==', podcast.podcastName));
    const querySnapshot = await getDocs(queryRef);

    if (!querySnapshot.empty) {
      // Podcast with the same name already exists, prompt user for confirmation
      const confirmUpload = window.confirm(`A podcast with the name "${podcast.podcastName}" already exists. Are you sure you want to upload another one?`);
      if (!confirmUpload) {
        return; // Cancel operation if user chooses not to proceed
      }
    }

    // Remove 'episodes' from the podcast data if it exists
    const { episodes, ...podcastDataWithoutEpisodes } = podcast;

    // Add the podcast document to Firestore without the 'episodes' field
    const docRef = await addDoc(podcastsRef, podcastDataWithoutEpisodes);
    console.log("Podcast document written with ID: ", docRef.id);

    // Create an empty 'episodes' sub-collection for the new podcast
    const episodesCollectionRef = collection(doc(db, 'podcasts', docRef.id), 'episodes');
    podcast.episodes.map(async (episode) => {
      await addDoc(episodesCollectionRef, episode);
    });
    //await addDoc(episodesCollectionRef, podcast.episodes); // Placeholder document to initialize the sub-collection

    console.log("Episode added to sub-collection for podcast: ", podcast.podcastName);

  } catch (e) {
    console.error("Error adding podcast document: ", e);
    throw e; // Re-throw the error to handle it elsewhere if needed
  }
}

export async function addEpisode(podcastId: string, episodeData: EpisodeData): Promise<void> {
  try {
    const episodesRef = collection(db, "podcasts", podcastId, "episodes");
    console.log("episodesRef:");
    console.log(episodesRef);

    // Remove timestamps array before adding the episode
    const { timestamps, ...episodeDataWithoutTimestamps } = episodeData;
    console.log("episodeDataWithoutTimestamps");
    console.log(episodeDataWithoutTimestamps);
    const docRef = await addDoc(episodesRef, episodeDataWithoutTimestamps);
    console.log("Episode document written with ID: ", docRef.id);
    console.log("timestamps");
    console.log(timestamps);

    // Create 'timestamps' sub-collection for the new episode
    if (timestamps && timestamps.length > 0) {
      const timestampsRef = collection(doc(db, "podcasts", podcastId, "episodes", docRef.id), "timestamps");
      console.log(timestampsRef);
      console.log("timestampsRef");
      timestamps.map(async (timestamp) => {
        console.log("timestamp");
        console.log(timestamp);
        await addDoc(timestampsRef, timestamp);
      });
      console.log("Episode added successfully");
      /*
      for (const timestamp of timestamps) {
        console.log("timestamp");
        console.log(timestamp);
        await addDoc(timestampsRef, timestamp);
        console.log("timestamp added")
      }*/
    }

  } catch (e) {
    console.error("Error adding episode document: ", e);
    throw e; // Re-throw the error to handle it elsewhere if needed
  }
}



/**
 * Updates a specific timestamp for an episode in Firestore.
 *
 * @param podcastId - The ID of the podcast.
 * @param episodeId - The ID of the episode.
 * @param timestampId - The ID of the timestamp to update.
 * @param newData - The new data to update the timestamp with.
 */

 export async function updateTimestamp(
   podcastId: string,
   episodeId: string,
   timestampId: string,
   newData: Partial<Timestamp>
 ): Promise<void> {
   try {
     // Reference to the specific timestamp document
     const timestampRef = doc(db, 'podcasts', podcastId, 'episodes', episodeId, 'timestamps', timestampId);
     console.log("Updating Timestamp with ID:", timestampId);
     console.log("EpisodeId:", episodeId);

     // Fetch the current timestamp data
     const timestampDoc = await getDoc(timestampRef);
     console.log("Fetched Timestamp Document Data:", timestampDoc.data());

     if (!timestampDoc.exists()) {
       throw new Error('Timestamp not found');
     }

     // Update the timestamp with the new data
     await updateDoc(timestampRef, {
       ...newData,
       updatedAt: new Date() // Update the updatedAt field
     });

     console.log('Timestamp updated successfully');
   } catch (error) {
     console.error('Error updating timestamp: ', error);
   }
 }

/*
export async function updateTimestamp(
  podcastId: string,
  episodeId: string,
  timestampId: string,
  newData: Partial<Timestamp>
): Promise<void> {
  try {
    // Reference to the specific timestamp document
    const timestampRef = doc(db, 'podcasts', podcastId, 'episodes', episodeId, 'timestamps', timestampId);
    console.log("timestampId");
    console.log(timestampId);
    // Fetch the current timestamp data
    const timestampDoc = await getDoc(timestampRef);
    console.log("timestampDoc");
    console.log(timestampDoc);

    if (!timestampDoc.exists()) {
      throw new Error('Timestamp not found');
    }

    // Update the timestamp with the new data
    await updateDoc(timestampRef, {
      ...newData,
      updatedAt: new Date() // Update the updatedAt field
    });

    console.log('Timestamp updated successfully');
  } catch (error) {
    console.error('Error updating timestamp: ', error);
  }
  }*/

export async function addTimestampToEpisode(podcastId: string, episodeId: string, timestamp: Timestamp): Promise<void> {
  try {
    const timestampsCollectionRef = collection(db, 'podcasts', podcastId, 'episodes', episodeId, 'timestamps');
    await addDoc(timestampsCollectionRef, { ...timestamp, createdAt: new Date(), updatedAt: new Date() });
    console.log('Timestamp added successfully');
  } catch (e) {
    console.error('Error adding timestamp: ', e);
  }
}
