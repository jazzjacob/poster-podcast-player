// /app/podcasts/[id]/episodes/[episodeId]/page.tsx

import { notFound } from 'next/navigation';
import { fetchEpisode, fetchPodcast } from '@/app/firebase/firestoreOperations';
import Link from 'next/link';
import PosterGallery from '@/app/components/NewPosterGallery';
import AudioPlayer from '@/app/components/AudioPlayer';
import PosterView from '@/app/components/PosterView';
import TitleSection from '@/app/components/TitleSection';

export default async function EpisodePage({ params }: { params: { id: string, episodeId: string } }) {
  const podcast = await fetchPodcast(params.id);
  const episode = await fetchEpisode(params.id, params.episodeId);

  if (!episode) {
    notFound(); // Handle 404 if the episode is not found
  }

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fafafa' }}>
      <TitleSection podcastName={podcast?.podcastName || ""} podcastId={params.id}  episodeTitle={episode.title} />
      <AudioPlayer src={episode.url} />
      <PosterView
        episode={JSON.parse(JSON.stringify(episode))}
      />
      <PosterGallery
        podcastId={params.id}
        episodeId={params.episodeId}
      />
    </div >
  );
}
