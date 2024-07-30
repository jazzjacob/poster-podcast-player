// /app/podcasts/[id]/episodes/[episodeId]/page.tsx

import { notFound } from 'next/navigation';
import { fetchEpisode, fetchPodcast } from '@/app/firebase/firestoreOperations';
import Link from 'next/link';
import PosterGallery from '@/app/components/NewPosterGallery';
import AudioPlayer from '@/app/components/AudioPlayer';

export default async function EpisodePage({ params }: { params: { id: string, episodeId: string } }) {
  const podcast = await fetchPodcast(params.id);
  const episode = await fetchEpisode(params.id, params.episodeId);

  if (!episode) {
    notFound(); // Handle 404 if the episode is not found
  }

  async function playFromSpecificTime() {
    'use server';
  }

  return (
    <div>
      <Link href={`/podcasts/${params.id}`}>{podcast?.podcastName}</Link>
      <h1>{episode.title}</h1>
      {/* Add media player or other episode details here */}
      <audio
        controls
        src={episode.url}
        preload="auto"
      ></audio>
      <AudioPlayer src={episode.url} />
      <PosterGallery
        podcastId={params.id}
        episodeId={params.episodeId}
      />
    </div>
  );
}
