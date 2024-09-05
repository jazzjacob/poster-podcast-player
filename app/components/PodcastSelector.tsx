'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { fetchAllPodcasts } from '../firebase/firestoreOperations';
import SelectPodcastButton from './SelectPodcastButton';
import styles from './PodcastSelector.module.css';
import Breadcrumbs from './Breadcrumbs';
import useStore from "../helpers/store";
import { PodcastData } from '../helpers/customTypes';

const PodcastSelector = () => {
  const [podcasts, setPodcasts] = useState<PodcastData[]>([]);
  const user = useStore((state) => state.user);

  // Fetch podcasts on the client side
  useEffect(() => {
    const fetchData = async () => {
      const fetchedPodcasts = await fetchAllPodcasts();
      setPodcasts(fetchedPodcasts);
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "1rem", width: "100%" }}>
      {/*<h2 className={styles.heading}>Podcasts</h2>*/}
      <Breadcrumbs list={[{ name: 'Podcasts', url: '/podcasts' }]} />
      <div style={{ display: "flex", gap: "1rem", flexDirection: 'column' }}>
        {podcasts && podcasts.map((podcast, index) => (
          <Suspense key={podcast.id}>
            {(podcast.draft && user) && (
              <SelectPodcastButton podcast={JSON.parse(JSON.stringify(podcast))} draft={true} />
            )}
           {(!podcast.draft) && (
             <SelectPodcastButton podcast={JSON.parse(JSON.stringify(podcast))} draft={false} />
            )}
          </Suspense>
        ))}
        <p className={styles.infoText}>More podcasts coming soon.</p>
      </div>
    </div>
  );
};

export default PodcastSelector;
