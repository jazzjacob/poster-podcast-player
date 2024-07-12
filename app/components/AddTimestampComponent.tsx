import React, { useState } from 'react';
import { addTimestampToEpisode } from '../firebase/firestoreOperations';
import { Timestamp } from '../helpers/customTypes';

const AddTimestampComponent: React.FC<{ podcastId: string, episodeId: string }> = ({ podcastId, episodeId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleAddTimestamp = async () => {
    setLoading(true);

    const newTimestamp: Timestamp = {
      id: 'new-timestamp-id',
      start: 30,
      end: 60,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await addTimestampToEpisode(podcastId, episodeId, newTimestamp);
      setSuccess(true);
    } catch (error) {
      console.error("Error adding timestamp:", error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Timestamp</h1>
      <button onClick={handleAddTimestamp} disabled={loading}>
        {loading ? 'Adding...' : 'Add Timestamp'}
      </button>
      {success === true && <p>Timestamp added successfully!</p>}
      {success === false && <p>Error adding timestamp.</p>}
    </div>
  );
};

export default AddTimestampComponent;
