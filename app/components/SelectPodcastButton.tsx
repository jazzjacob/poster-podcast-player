'use client';

import React, { useState } from 'react';
import { PodcastData } from '../helpers/customTypes';
import Link from 'next/link';

import styles from './SelectPodcastButton.module.css';

function SelectPodcastButton({ podcast }: { podcast: PodcastData }) {
  const [isHovered, setIsHovered] = useState(false);

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
        style={{ color: isHovered ? podcast.color : 'inherit' }} // Apply hover color dynamically
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {podcast.podcastName}
      </Link>
    </>
  );
}

export default SelectPodcastButton;
