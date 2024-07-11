import React, { useState } from 'react';
import { createPodcast } from '../firebase/firestoreOperations';
import { TimestampImage, Timestamp, UploadedImage, PodcastData } from '../helpers/customTypes';

interface CreatePodcastComponentProps {
  podcastData: PodcastData;
}

const CreatePodcastComponent: React.FC<CreatePodcastComponentProps> = ({ podcastData }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleCreatePodcast = async () => {
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
