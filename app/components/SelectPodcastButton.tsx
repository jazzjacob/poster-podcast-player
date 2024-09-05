'use client';

import React, { useState } from 'react';
import { PodcastData } from '../helpers/customTypes';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCallback } from 'react';

import styles from './SelectPodcastButton.module.css';

function SelectPodcastButton({ podcast, color }: { podcast: PodcastData, color: string }) {
  const [isHovered, setIsHovered] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <Link
        href={`/podcasts/${podcast.id}`}
        scroll={false}
        className={styles.link}
        style={{ color: isHovered ? color : 'inherit' }} // Apply hover color dynamically
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {podcast.podcastName}
      </Link>
    </>
  );
}

export default SelectPodcastButton;
