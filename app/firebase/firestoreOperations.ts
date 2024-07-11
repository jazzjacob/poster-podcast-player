import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, setDoc } from "firebase/firestore";
import { PodcastData, EpisodeData } from '../helpers/customTypes';

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
export async function readDocument(id: string): Promise<PodcastData | null> {
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
    await addDoc(episodesCollectionRef, { placeholder: true }); // Placeholder document to initialize the sub-collection

    console.log("Episode added to sub-collection for podcast: ", podcast.podcastName);

  } catch (e) {
    console.error("Error adding podcast document: ", e);
    throw e; // Re-throw the error to handle it elsewhere if needed
  }
}

export async function addEpisode(podcastId: string, episode: EpisodeData): Promise<void> {
  try {
    const podcastRef = collection(db, "podcasts", podcastId, "episodes");
    const docRef = await addDoc(podcastRef, episode);
    console.log("Episode document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding episode document: ", e);
    throw e; // Re-throw the error to handle it elsewhere if needed
  }
}
