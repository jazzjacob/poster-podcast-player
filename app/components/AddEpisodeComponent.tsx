'use client'

import React, { useState } from 'react';
import { addEpisode } from '../firebase/firestoreOperations';
import { EpisodeData } from '../helpers/customTypes';

interface CreatePodcastComponentProps {
  episodeData: EpisodeData;
  podcastId: string;
}

const AddEpisodeComponent: React.FC<CreatePodcastComponentProps> = ({ podcastId, episodeData }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleAddEpisode = async () => {
    setLoading(true);
    try {
      await addEpisode(podcastId, episodeData);
      setSuccess(true);
    } catch (error) {
      console.error("Error adding episode:", error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "2rem 0" }}>
      <h2>Add episode</h2>
      <button onClick={handleAddEpisode} disabled={loading}>
        {loading ? 'Creating...' : 'Add episode'}
      </button>
      {success === true && <p>Episode document created successfully!</p>}
      {success === false && <p>Error creating podcast document.</p>}
    </div >
  );
};

export default AddEpisodeComponent;
