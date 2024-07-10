import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";

// Create
export async function createDocument(data: any): Promise<void> {
  try {
    const docRef = await addDoc(collection(db, "your-collection-name"), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Read
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
