'use client';

import React, { useState } from 'react';
import { EpisodeData, PodcastData } from '../helpers/customTypes';
import Link from 'next/link';

import styles from './SelectPodcastButton.module.css';

function SelectLink({ type, podcast, episode }: { type: "podcast" | "episode", podcast: PodcastData, episode?: EpisodeData }) {
  const [isHovered, setIsHovered] = useState(false);
  let url = "";
  if (type == "podcast") {
    url = `/podcasts/${podcast.id}`;
  } else {
    if (episode) {
       url = `/podcasts/${podcast.id}/episode/${episode.id}`;
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <Link
        href={url}
        scroll={false}
        className={styles.link}
        style={{ color: isHovered ? podcast.color : 'inherit' }} // Apply hover color dynamically
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {type == "podcast" ? (
          podcast.podcastName
        ) : (
          episode && episode.title
        )}

      </Link>
    </>
  );
}

export default SelectLink;
