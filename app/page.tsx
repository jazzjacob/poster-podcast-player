import React from 'react';
import PodcastSelector from './components/PodcastSelector';
import Hero from './components/Hero';
import PodcastSearcher from './components/PodcastSearcher';

export const metadata = {
  title: 'Poster Podcast Player',
  description: 'Podcasts with images - simple as that.',
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  //const data = await db.someTable.findMany(); // Replace with your actual data fetching logic

  return (
    <>
      <Hero />
      <PodcastSelector />
      <div style={{ padding: '1rem' }}>
        <PodcastSearcher />
      </div>
    </>
  );
}
