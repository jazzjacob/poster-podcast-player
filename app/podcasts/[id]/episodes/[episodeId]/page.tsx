// /app/podcasts/[id]/episodes/[episodeId]/page.tsx

import { notFound } from 'next/navigation';
import { fetchEpisode, fetchPodcast, findSavedPodcast } from '@/app/firebase/firestoreOperations';
import Link from 'next/link';
import PosterGallery from '@/app/components/NewPosterGallery';
import AudioPlayer from '@/app/components/AudioPlayer';
import PosterView from '@/app/components/PosterView';
import TitleSection from '@/app/components/TitleSection';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { fetchData, fetchEpisodeByGUID } from '@/app/helpers/functions';
import PodcastImageSection from '@/app/components/PodcastImageSection';
import EpisodeInformation from '@/app/components/EpisodeInformation';

function findSavedEpisode(podcast: any, episodeId: string) {
  const episode = podcast.episodes.find((episode: any) => episode.guid == episodeId);

  return episode;
}

export default async function EpisodePage({ params }: { params: { id: string, episodeId: string } }) {
  //const podcast = await fetchPodcast(params.id);
  const COUNTRY = 'se';
  let podcast = await fetchData(`https://itunes.apple.com/lookup?id=${params.id}&country=${COUNTRY}`);
  podcast = podcast[0];
  const savedPodcast = await findSavedPodcast(decodeURIComponent(params.id));

  let savedEpisode;
  if (savedPodcast) {
    savedEpisode = findSavedEpisode(savedPodcast, decodeURIComponent(params.episodeId));
  }
  let episode = await fetchEpisodeByGUID(podcast.feedUrl, decodeURIComponent(params.episodeId));
  //console.log(episode);

  return (
    <>
      {savedEpisode ? (
        <>
          <PosterView
            episode={JSON.parse(JSON.stringify(savedEpisode))}
          />
          <div style={{ padding: '1rem' }}>
            <Breadcrumbs list={[{ name: 'Podcasts', url: '/' }, { name: podcast?.collectionName || "", url: `/podcasts/${podcast?.collectionId}` }, { name: episode.title, url: ''}] } />
            <AudioPlayer src={savedEpisode.url} />
            <PosterGallery
              podcastId={savedPodcast?.id || ''}
              episodeId={savedEpisode.id}
            />
            <EpisodeInformation podcast={podcast} episode={episode} />
          </div>
        </>
      ) : (
        <>
          <PodcastImageSection podcast={podcast} episode={episode} />
          <div style={{ padding: '1rem' }}>
            <Breadcrumbs list={[{ name: 'Podcasts', url: '/' }, { name: podcast?.collectionName || "", url: `/podcasts/${podcast?.collectionId}` }, { name: episode.title, url: ''}] } />
            <AudioPlayer src={episode.enclosureUrl} />
            <EpisodeInformation podcast={podcast} episode={episode} />
        </div>
        </>
      )}
    </>
  );
}
