import { storage, db } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { UploadedImage } from '../helpers/customTypes';
import { doc, updateDoc, arrayRemove, deleteDoc, runTransaction } from 'firebase/firestore';

// Upload Image
export async function uploadImage(file: File): Promise<void> {
  try {
    const storageRef = ref(storage, 'images/' + file.name);
    await uploadBytes(storageRef, file);
    console.log("Uploaded a blob or file!");
  } catch (e) {
    console.error("Error uploading file: ", e);
  }
}

// Fetch Image URL
export async function getImageURL(filePath: string): Promise<string | null> {
  try {
    const storageRef = ref(storage, filePath);
    const url = await getDownloadURL(storageRef);
    console.log("File available at", url);
    return url;
  } catch (e) {
    console.error("Error fetching file URL: ", e);
    return null;
  }
}

/*
export async function deleteUploadedImage(podcastId: string, episodeId: string, image: UploadedImage): Promise<void> {
  try {
    // Get a reference to the image in Firebase Storage
    const imageRef = ref(storage, `podcasts/${podcastId}/episodes/${episodeId}/uploadedImages/${image.name}`);

    // Delete the image from Firebase Storage
    await deleteObject(imageRef);
    console.log('Image deleted successfully from storage.');

    // Remove the image reference from the Firestore sub-collection
    const imageDocRef = doc(db, 'podcasts', podcastId, 'episodes', episodeId, 'uploadedImages', image.id);
    await deleteDoc(imageDocRef);
    console.log('Image reference removed from Firestore.');
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}*/

export async function deleteUploadedImage(podcastId: string, episodeId: string, image: UploadedImage): Promise<void> {
  const episodeDocRef = doc(db, 'podcasts', podcastId, 'episodes', episodeId);

  try {
    // Run the transaction
    await runTransaction(db, async (transaction) => {
      // Get the episode document
      const episodeDoc = await transaction.get(episodeDocRef);

      if (!episodeDoc.exists()) {
        throw new Error("Episode document does not exist!");
      }

      // Delete the image from Firebase Storage
      const imageRef = ref(storage, `podcasts/${podcastId}/episodes/${episodeId}/uploadedImages/${image.name}`);
      await deleteObject(imageRef);
      console.log('Image deleted successfully from storage.');

      // Remove the image reference from the uploadedImages array in the episode document
      transaction.update(episodeDocRef, {
        uploadedImages: arrayRemove(image)
      });
      console.log('Image reference removed from Firestore.');
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}


export async function createPodcastDirectoryInStorage(podcastId: string) {
  const folderPath = `podcasts/${podcastId}/.placeholder`;

  try {
      // Create a reference to the placeholder file in the specified folder path
      const placeholderRef = ref(storage, folderPath);

      // Create a zero-byte placeholder file
      const placeholderFile = new Blob([''], { type: 'text/plain' });

      // Upload the zero-byte placeholder file
      await uploadBytes(placeholderRef, placeholderFile);

      console.log(`Empty folder created at ${folderPath}`);
    } catch (error) {
      console.error('Error creating empty folder:', error);
      throw error;
    }
}

export async function createEpisodeDirectoryInStorage(podcastId: string, episodeId: string) {
  const folderPath = `podcasts/${podcastId}/episodes/${episodeId}/.placeholder`;

  try {
      // Create a reference to the placeholder file in the specified folder path
      const placeholderRef = ref(storage, folderPath);

      // Create a zero-byte placeholder file
      const placeholderFile = new Blob([''], { type: 'text/plain' });

      // Upload the zero-byte placeholder file
      await uploadBytes(placeholderRef, placeholderFile);

      console.log(`Empty folder created at ${folderPath}`);
    } catch (error) {
      console.error('Error creating empty folder:', error);
      throw error;
    }
}
