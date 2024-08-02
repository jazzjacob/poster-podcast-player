// pages/page.tsx
import React from 'react';
//import db from '@/db/db';
import ClientPage from '@/app/components/ClientPage';
import TitleSection from './components/TitleSection';
import PodcastSelector from './components/PodcastSelector';
import EpisodeSelector from './components/EpisodeSelector';

export const metadata = {
  title: 'Main Page',
  description: 'Your main page description',
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
      <PodcastSelector />
    </>
  );
}
