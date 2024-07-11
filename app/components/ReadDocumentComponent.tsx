import React, { useEffect, useState } from 'react';
import { readDocument } from '../firebase/firestoreOperations';

interface DocumentData {
  // Define the structure of your document data
  podcastName: string;
  //field2: number;
  // Add other fields as needed
}

const ReadDocumentComponent: React.FC = () => {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const docData = await readDocument('jdB3sQsT8p1FE5qW76mH');
      console.log("docData");
      console.log(docData);
      setData(docData);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No document found.</div>;
  }

  return (
    <div>
      <h2>Data from Firestore</h2>
      <p>Podcast name: {data.podcastName}</p>
      {/* Render other fields as needed */}
    </div>
  );
};

export default ReadDocumentComponent;
