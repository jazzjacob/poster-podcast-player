'use client';

import { useState } from 'react';
import CreatePodcastComponent from '@/app/components/CreatePodcastComponent';
import styles from './page.module.css';
import { PodcastData } from '@/app/helpers/customTypes';
import { nullPodcast } from '@/app/helpers/customTypes';
import AddPodcastForm from '@/app/components/AddPodcastForm';

function AddPodcastPage() {
  const [podcastData, setPodcastData] = useState<PodcastData>(nullPodcast);

  return (
    <div className={styles.container}>
      <p>This is the Add podcast-page</p>
      <AddPodcastForm />
      {podcastData.podcastName !== "" && (
        <CreatePodcastComponent podcastData={podcastData} />
      )}
    </div>
  );
}

export default AddPodcastPage;
