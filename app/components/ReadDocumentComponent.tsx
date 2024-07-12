import React, { useEffect, useState } from 'react';
import { fetchAllPodcasts, readDocument } from '../firebase/firestoreOperations';
import { PodcastData } from '../helpers/customTypes';
import { create } from 'zustand'
import useStore from '../helpers/store';


interface DocumentData {
  // Define the structure of your document data
  podcastName: string;
  //field2: number;
  // Add other fields as needed
}

interface ReadDocumentComponentProps {
  idToFetch: string;
}

const ReadDocumentComponent: React.FC<ReadDocumentComponentProps> = ({ idToFetch }) => {
  const [data, setData] = useState<DocumentData | null>(null);
  const [podcastData, setPodcastData] = useState<PodcastData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const podcastState = useStore((state) => state.podcasts);

  const updatePodcastState = useStore((state) => state.setPodcasts);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docData = await readDocument(idToFetch);
        const allPodcasts = await fetchAllPodcasts();
        setData(docData);
        updatePodcastState(allPodcasts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idToFetch, updatePodcastState]);

  useEffect(() => {
    console.log("Global state:");
    console.log(podcastState);
  }, [podcastState]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No document found.</div>;
  }

  return (
    <div style={{
      margin: "2rem 0",
      padding: "1rem",
      backgroundColor: "lightgray"
    }}>
      <h2>Data from Firestore</h2>
      <p>Podcast name: {data.podcastName}</p>
      {podcastData && (
        podcastData.map((podcast, index) => (
          <div key={`${index}-${podcast.id}`}>
            <p>{podcast.podcastName}</p>
            <h3>Episodes</h3>
            {podcast.episodes && podcast.episodes.map((episode, index) => (
              <div key={`${index}-${episode.id}`}>
                <p>{episode.title}</p>
                <img alt="" style={{ width: "100px" }} src={episode.uploadedImages[0].image} />
              </div >
            ))}
          </div>
        ))
      )}
    </div >
  );
};

export default ReadDocumentComponent;
