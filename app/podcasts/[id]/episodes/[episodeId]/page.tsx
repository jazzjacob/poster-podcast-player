// /app/podcasts/[id]/episodes/[episodeId]/page.tsx

import { notFound } from 'next/navigation';
import { fetchEpisode, fetchPodcast } from '@/app/firebase/firestoreOperations';
import Link from 'next/link';
import PosterGallery from '@/app/components/NewPosterGallery';
import AudioPlayer from '@/app/components/AudioPlayer';
import PosterView from '@/app/components/PosterView';
import TitleSection from '@/app/components/TitleSection';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { fetchData, fetchEpisodeByGUID } from '@/app/helpers/functions';

export default async function EpisodePage({ params }: { params: { id: string, episodeId: string } }) {
  //const podcast = await fetchPodcast(params.id);
  let podcast = await fetchData(`https://itunes.apple.com/lookup?id=${params.id}`);
  podcast = podcast[0];

  console.log(podcast);
  let episode = await fetchEpisodeByGUID(podcast.feedUrl, params.episodeId);
  console.log('Episode:');
  console.log(episode);
  //const episode = await fetchEpisode(params.id, params.episodeId);

  /*
  let episode = '';
  if (!episode) {
    notFound(); // Handle 404 if the episode is not found
  }*/

  return (
    <>
      <div style={{ padding: '1rem' }}>
        <Breadcrumbs list={[{ name: 'Podcasts', url: '/' }, { name: podcast?.collectionName || "", url: `/podcasts/${podcast?.collectionId}` }, { name: episode.title, url: ''}] } />
        <p>{episode.title}</p>
        <AudioPlayer src={episode.enclosureUrl} />
      </div>
    {/*


    <>
      <PosterView
        episode={JSON.parse(JSON.stringify(episode))}
      />
      <div style={{ padding: '1rem' }}>
        <AudioPlayer src={episode.url} />
        <PosterGallery
          podcastId={params.id}
          episodeId={params.episodeId}
        />
      </div>
    </>
    */}
    </>
  );
}
