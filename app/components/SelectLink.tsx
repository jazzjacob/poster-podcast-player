'use client';

import React, { useState } from 'react';
import { EpisodeData, PodcastData } from '../helpers/customTypes';
import Link from 'next/link';

import styles from './SelectLink.module.css';

function SelectLink({ type, podcast, episode }: { type: "podcast" | "episode", podcast: any, episode?: any }) {
  const [isHovered, setIsHovered] = useState(false);


  let url = "";
  if (type == "podcast") {
    url = `/podcasts/${podcast.itunesId}`;
  } else {
    if (episode) {
      const guid = episode.guid[`#text`] || episode.guid;
      url = `/podcasts/${podcast.collectionId}/episodes/${guid}`;
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  function handleClick() {
    console.log(podcast);
  }

  return (
    <>
      <Link
        onClick={handleClick}
        href={url}
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
