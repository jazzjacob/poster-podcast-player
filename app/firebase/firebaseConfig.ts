import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence, inMemoryPersistence, onAuthStateChanged } from 'firebase/auth';
import useStore from "@/app/helpers/store";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Set up authentication state listener
onAuthStateChanged(auth, (user) => {
  const { setUser, clearUser } = useStore.getState();
  if (user) {
    setUser(user);
  } else {
    clearUser();
  }
});

export const setAuthPersistence = async (persistence: 'LOCAL' | 'SESSION' | 'NONE') => {
  let persistenceType;

  switch (persistence) {
    case 'LOCAL':
      persistenceType = browserLocalPersistence;
      break;
    case 'SESSION':
      persistenceType = browserSessionPersistence;
      break;
    case 'NONE':
      persistenceType = inMemoryPersistence;
      break;
    default:
      throw new Error('Invalid persistence type');
  }

  try {
    await setPersistence(auth, persistenceType);
    console.log(`Persistence set to ${persistence}`);
  } catch (error) {
    console.error('Error setting persistence:', error);
  }
};

export { db, storage , auth};
