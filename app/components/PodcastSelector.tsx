import React, { Suspense } from 'react';
import { fetchAllPodcasts } from '../firebase/firestoreOperations';
import SelectPodcastButton from './SelectPodcastButton';

async function PodcastSelector() {
  const podcasts = await fetchAllPodcasts();

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Select podcast</h2 >
      <div style={{ display: "flex", gap: "1rem" }}>
        {podcasts && podcasts.map((podcast, index) => (
          <Suspense key={podcast.id}>
            <SelectPodcastButton podcast={ JSON.parse(JSON.stringify(podcast))} />
          </Suspense>
        ))}
      </div >
    </div >
  );
};

export default PodcastSelector;
