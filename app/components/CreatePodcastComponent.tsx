import React, { useState, useEffect } from 'react';
import { createPodcast } from '../firebase/firestoreOperations';
import { TimestampImage, Timestamp, UploadedImage, PodcastData } from '../helpers/customTypes';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

interface CreatePodcastComponentProps {
  podcastData: PodcastData;
}

const CreatePodcastComponent: React.FC<CreatePodcastComponentProps> = ({ podcastData }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Use useEffect to track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const handleCreatePodcast = async () => {
    console.log(user);

    // User is signed in, you can proceed with Firestore operations
    if (user) {
      setLoading(true);
      try {
        await createPodcast(podcastData);
        setSuccess(true);
      } catch (error) {
        console.error("Error creating podcast document:", error);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    } else {
      // No user is signed in
      console.log("User is not authenticated");
    }
  };

  return (
    <div>
      <h1>Create Podcast</h1>
      <button onClick={handleCreatePodcast} disabled={loading}>
        {loading ? 'Creating...' : 'Create Podcast'}
      </button>
      {success === true && <p>Podcast document created successfully!</p>}
      {success === false && <p>Error creating podcast document.</p>}
    </div>
  );
};

export default CreatePodcastComponent;
