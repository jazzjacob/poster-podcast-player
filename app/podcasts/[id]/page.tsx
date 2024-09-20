// /app/podcasts/[id]/page.tsx

import { notFound } from 'next/navigation';
import { fetchPodcast as fetchSavedPodcast, fetchEpisodes as fetchSavedEpisodes, fetchAllPodcasts } from '@/app/firebase/firestoreOperations';
import EpisodeList from '@/app/components/EpisodeList';
import PodcastHero from '@/app/components/PodcastHero';
import styles from './page.module.css';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { fetchData, fetchRSSFeed } from '@/app/helpers/functions';
import { findSavedPodcast } from '@/app/firebase/firestoreOperations';

export default async function PodcastPage({ params }: { params: { id: string } }) {
  const COUNTRY = 'se';
  let podcast = await fetchData(`https://itunes.apple.com/lookup?id=${params.id}&country=${COUNTRY}`);
  podcast = podcast[0];
  //let rssFeed = await fetchRSSFeed(podcast.feedUrl);

  let rssFeed = await fetchRSSFeed(podcast.feedUrl);
  console.log('rssfeed here');
  console.log(rssFeed);

  const savedPodcast = await findSavedPodcast(params.id);

  //const episodes = await fetchSavedEpisodes(params.id);

  const convertedPodcast = JSON.parse(JSON.stringify(podcast));

  let convertedSavedPodcast;
  if (savedPodcast) {
   convertedSavedPodcast = JSON.parse(JSON.stringify(savedPodcast));
  }
  //const convertedEpisodes = JSON.parse(JSON.stringify(episodes));

  if (!podcast) {
    notFound(); // Handle 404 if the podcast is not found
  }

  return (
    <>
      <PodcastHero podcast={podcast} color={podcast.color || 'orange'} />
      <div className={styles.podcastContainer}>
        <Breadcrumbs list={[{ name: 'Podcasts', url: '/' }, {name: podcast.collectionName, url: ""}] } />
        {savedPodcast && (
          <div style={{ marginBottom: '1rem' }}>
            <h2>Saved episodes:</h2>
            <EpisodeList podcast={convertedSavedPodcast} episodes={convertedSavedPodcast.episodes} />
          </div>
        )}
        <h2>All episodes:</h2>
        <EpisodeList podcast={convertedPodcast} episodes={rssFeed} />
      </div>
        <p>Hejsan</p>
        <p>Id: {params.id}</p>
    </>
  );
}
