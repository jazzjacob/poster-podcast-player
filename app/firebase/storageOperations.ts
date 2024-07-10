import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
