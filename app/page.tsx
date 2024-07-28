// pages/page.tsx
import React from 'react';
//import db from '@/db/db';
import ClientPage from '@/app/components/ClientPage';
import TitleSection from './components/TitleSection';

export const metadata = {
  title: 'Main Page',
  description: 'Your main page description',
};

export default async function Page() {
  //const data = await db.someTable.findMany(); // Replace with your actual data fetching logic

  return (
    <>
      <TitleSection />
      <ClientPage />
    </>
  );
}
