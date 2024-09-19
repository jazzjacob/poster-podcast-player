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

function findSavedEpisode(podcast: any, episodeId: string) {
  const episode = podcast.episodes.find((episode: any) => episode.guid == episodeId);

  return episode;
}

export default async function EpisodePage({ params }: { params: { id: string, episodeId: string } }) {
  //const podcast = await fetchPodcast(params.id);
  let podcast = await fetchData(`https://itunes.apple.com/lookup?id=${params.id}`);
  podcast = podcast[0];
  const savedPodcast = await findSavedPodcast(params.id);

  let savedEpisode;
  if (savedPodcast) {
    savedEpisode = findSavedEpisode(savedPodcast, params.episodeId);
  }

  console.log('saved episode');
  console.log(savedEpisode);
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
          </div>
        </>
      ) : (
        <div style={{ padding: '1rem' }}>
          <Breadcrumbs list={[{ name: 'Podcasts', url: '/' }, { name: podcast?.collectionName || "", url: `/podcasts/${podcast?.collectionId}` }, { name: episode.title, url: ''}] } />
          <p>{episode.title}</p>
          <AudioPlayer src={episode.enclosureUrl} />
        </div>
      )}
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
