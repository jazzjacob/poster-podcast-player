// /app/podcasts/[id]/page.tsx

import { notFound } from 'next/navigation';
import { fetchPodcast as fetchSavedPodcast, fetchEpisodes as fetchSavedEpisodes } from '@/app/firebase/firestoreOperations';
import EpisodeList from '@/app/components/EpisodeList';
import PodcastHero from '@/app/components/PodcastHero';
import styles from './page.module.css';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { fetchData, fetchRSSFeed } from '@/app/helpers/functions';

export default async function PodcastPage({ params }: { params: { id: string } }) {
  let podcast = await fetchData(`https://itunes.apple.com/lookup?id=${params.id}`);
  podcast = podcast[0];
  //let rssFeed = await fetchRSSFeed(podcast.feedUrl);
  let rssFeed = await fetchRSSFeed(podcast.feedUrl);
  console.log('Look here mate:');
  console.log(rssFeed);
  console.log('Rss feed above');

  //const podcast = await fetchSavedPodcast(params.id);
  //const episodes = await fetchSavedEpisodes(params.id);

  const convertedPodcast = JSON.parse(JSON.stringify(podcast));
  //const convertedEpisodes = JSON.parse(JSON.stringify(episodes));

  if (!podcast) {
    notFound(); // Handle 404 if the podcast is not found
  }

  return (
    <>
      <PodcastHero podcast={podcast} color={podcast.color || 'orange'} />
      <div className={styles.podcastContainer}>
        <Breadcrumbs list={[{ name: 'Podcasts', url: '/' }, {name: podcast.collectionName, url: ""}] } />
        <EpisodeList podcast={convertedPodcast} episodes={rssFeed} />
      </div>
        <p>Hejsan</p>
        <p>Id: {params.id}</p>
    </>
  );
}
