import React, { Suspense } from 'react';
import { fetchAllPodcasts } from '../firebase/firestoreOperations';
import SelectPodcastButton from './SelectPodcastButton';
import styles from './PodcastSelector.module.css';
import Breadcrumbs from './Breadcrumbs';

async function PodcastSelector() {
  const podcasts = await fetchAllPodcasts();

  return (
    <div style={{ padding: "1rem", width: "100%" }}>
      {/*<h2 className={styles.heading}>Podcasts</h2>*/}
      <Breadcrumbs list={[{name: 'Podcasts', url: '/podcasts'}] } />
      <div style={{ display: "flex", gap: "1rem", flexDirection: 'column' }}>
        {podcasts && podcasts.map((podcast, index) => (
          <Suspense key={podcast.id}>
            <SelectPodcastButton podcast={ JSON.parse(JSON.stringify(podcast))} />
          </Suspense>
        ))}
        <p className={styles.infoText}>More podcasts coming soon.</p >
      </div >
    </div >
  );
};

export default PodcastSelector;
