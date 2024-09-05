// /app/podcasts/[id]/page.tsx

import { notFound } from 'next/navigation';
import { fetchPodcast, fetchEpisodes } from '@/app/firebase/firestoreOperations';
import EpisodeList from '@/app/components/EpisodeList';
import PodcastHero from '@/app/components/PodcastHero';
import styles from './page.module.css';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export default async function PodcastPage({ params }: { params: { id: string } }) {
  console.log(params.id);
  const podcast = await fetchPodcast(params.id);
  const episodes = await fetchEpisodes(params.id);
  const convertedPodcast = JSON.parse(JSON.stringify(podcast));
  const convertedEpisodes = JSON.parse(JSON.stringify(episodes));

  if (!podcast) {
    notFound(); // Handle 404 if the podcast is not found
  }

  return (
    <>
      <PodcastHero podcast={podcast} color={podcast.color || 'orange'} />
      <div className={styles.podcastContainer}>
        <Breadcrumbs list={[{ name: 'Podcasts', url: '/' }, {name: podcast.podcastName, url: ""}] } />
        {/*<h1 className={styles.podcastName}>{podcast.podcastName}</h1>*/}
        <EpisodeList podcast={convertedPodcast} episodes={convertedEpisodes} />
      </div>
    </>
  );
}
