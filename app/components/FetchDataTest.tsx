import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";

const collectionRef = collection(db, "your-collection-name");

// Create
async function createDocument(data: any) {
  const docRef = await addDoc(collectionRef, data);
  console.log("Document written with ID: ", docRef.id);
}

// Read
async function readDocument(id: string) {
  const docRef = doc(db, "your-collection-name", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    console.log("No such document!");
  }
}

// Update
async function updateDocument(id: string, updatedData: any) {
  const docRef = doc(db, "your-collection-name", id);
  await updateDoc(docRef, updatedData);
  console.log("Document updated");
}

// Delete
async function deleteDocument(id: string) {
  const docRef = doc(db, "your-collection-name", id);
  await deleteDoc(docRef);
  console.log("Document deleted");
}
