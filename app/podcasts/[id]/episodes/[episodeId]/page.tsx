// /app/podcasts/[id]/episodes/[episodeId]/page.tsx

import { notFound } from 'next/navigation';
import { fetchEpisode, fetchPodcast } from '@/app/firebase/firestoreOperations';
import Link from 'next/link';
import PosterGallery from '@/app/components/NewPosterGallery';
import AudioPlayer from '@/app/components/AudioPlayer';
import PosterView from '@/app/components/PosterView';
import TitleSection from '@/app/components/TitleSection';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export default async function EpisodePage({ params }: { params: { id: string, episodeId: string } }) {
  const podcast = await fetchPodcast(params.id);
  const episode = await fetchEpisode(params.id, params.episodeId);

  if (!episode) {
    notFound(); // Handle 404 if the episode is not found
  }

  return (
    <>
      <PosterView
        episode={JSON.parse(JSON.stringify(episode))}
      />
      <div style={{ padding: '1rem' }}>
        <Breadcrumbs list={[{ name: 'Podcasts', url: '/' }, { name: podcast?.podcastName || "", url: `/podcasts/${podcast?.id}` }, { name: episode.title, url: ''}] } />
        {/*<TitleSection podcastName={podcast?.podcastName || ""} podcastId={params.id}  episodeTitle={episode.title} />*/}
        <AudioPlayer src={episode.url} />
        <PosterGallery
          podcastId={params.id}
          episodeId={params.episodeId}
        />
      </div>
    </>
  );
}
