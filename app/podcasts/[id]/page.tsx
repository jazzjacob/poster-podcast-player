// /app/podcasts/[id]/page.tsx

import { notFound } from 'next/navigation';
import { fetchPodcast as fetchSavedPodcast, fetchEpisodes as fetchSavedEpisodes, fetchAllPodcasts } from '@/app/firebase/firestoreOperations';
import EpisodeList from '@/app/components/EpisodeList';
import PodcastHero from '@/app/components/PodcastHero';
import styles from './page.module.css';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { fetchData, fetchRSSFeed } from '@/app/helpers/functions';
import { findSavedPodcast } from '@/app/firebase/firestoreOperations';

export default async function PodcastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const COUNTRY = 'se';
  let podcast = await fetchData(`https://itunes.apple.com/lookup?id=${id}&country=${COUNTRY}`);
  podcast = podcast[0];

  if (!podcast) {
    notFound(); // Handle 404 if the podcast is not found
  }

  let rssFeed = await fetchRSSFeed(podcast.feedUrl);
  console.log('rssfeed here');
  console.log(rssFeed);

  const savedPodcast = await findSavedPodcast(id);

  //const episodes = await fetchSavedEpisodes(id);

  const convertedPodcast = JSON.parse(JSON.stringify(podcast));

  let convertedSavedPodcast;
  if (savedPodcast) {
   convertedSavedPodcast = JSON.parse(JSON.stringify(savedPodcast));
  }
  //const convertedEpisodes = JSON.parse(JSON.stringify(episodes));

  return (
    <>
      <PodcastHero podcast={podcast} color={podcast.color || 'orange'} />
      <div className={styles.podcastContainer}>
        <Breadcrumbs list={[{ name: 'Podcasts', url: '/' }, {name: podcast.collectionName, url: ""}] } />
        {savedPodcast && (
          <div style={{ marginBottom: '3rem' }}>
            <h2>Episodes with images:</h2>
            <EpisodeList podcast={convertedSavedPodcast} episodes={convertedSavedPodcast.episodes} />
          </div>
        )}
        <h2>All episodes:</h2>
        <EpisodeList podcast={convertedPodcast} episodes={rssFeed} />
      </div>
    </>
  );
}
