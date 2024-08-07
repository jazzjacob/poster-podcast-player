'use client'

import React from 'react';
import { PodcastData } from '../helpers/customTypes';
import { useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link';
import { useCallback, Suspense } from 'react';

import styles from './SelectPodcastButton.module.css';

function SelectPodcastButton({ podcast }: { podcast: PodcastData }) {

  const searchParams = useSearchParams();
  const pathname = usePathname()

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <>
      <Link
        href={`/podcasts/${podcast.id}`}
        scroll={false}
        className={styles.link}
      >
        {podcast.podcastName}
      </Link  >
    </>
  );
}

export default SelectPodcastButton;
