'use client'

import React from 'react';
import { PodcastData } from '../helpers/customTypes';
import { useSearchParams, usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { useCallback } from 'react';

function SelectPodcastButton({ podcast }: { podcast: PodcastData }) {

  const searchParams = useSearchParams();
  const router = useRouter();
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

  // Get the current podcast ID from the URL query parameters
  const currentPodcastId = searchParams.get('podcast');

  const style = {
    textDecoration: 'underline'
  };

  return (
    <>
      <Link
        style={style}
        href={pathname + '?' + createQueryString('podcast', podcast.id)}
        scroll={false}
      >
        {podcast.podcastName}
      </Link  >
    </>
  );
}

export default SelectPodcastButton;
