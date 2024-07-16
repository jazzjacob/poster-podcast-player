import React, { useState } from 'react';
import { addTimestampToEpisode } from '../firebase/firestoreOperations';
import { Timestamp } from '../helpers/customTypes';
import { generateId } from '../helpers/functions';

const AddTimestampComponent: React.FC<{ podcastId: string, episodeId: string }> = ({ podcastId, episodeId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleAddTimestamp = async () => {
    setLoading(true);

    const newTimestamp: Timestamp = {
      id: generateId(),
      start: 11,
      end: 20,
      images: [
        {
          id: generateId(),
          image: "https://firebasestorage.googleapis.com/v0/b/poster-podcast-player.appspot.com/o/podcasts%2Fthe-poster-boys%2Fepisode-59%2Flast-black-man-1.jpg?alt=media&token=cf5a4ee4-c774-4c53-999b-e68c92363d78",
          description: "",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
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
