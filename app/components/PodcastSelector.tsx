import React from 'react';
import {  fetchAllPodcasts } from '../firebase/firestoreOperations';
import SelectPodcastButton from './SelectPodcastButton';

async function PodcastSelector() {
  const podcasts = await fetchAllPodcasts();

  return (
    <div style={{ margin: "2rem 0" }}>
      <h2>New Select podcast</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        {podcasts && podcasts.map((podcast, index) => (
          <>
            <SelectPodcastButton podcast={podcast} />
          </>
        ))}
      </div >
    </div >
  );
};

export default PodcastSelector;
