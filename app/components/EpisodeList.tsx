'use client';

import { EpisodeData, PodcastData } from "../helpers/customTypes";
import Link from "next/link";
import styles from './EpisodeList.module.css';
import useStore from "../helpers/store";

function EpisodeList({ podcast, episodes }: { podcast: PodcastData, episodes: EpisodeData[] }) {
  const user = useStore((state) => state.user);

  return (
    <div className={styles.container}>
      {episodes?.map(episode => (
        <>
          {episode.draft && user && (
            <>
              <Link className={styles.link} key={episode.id} href={`/podcasts/${podcast.id}/episodes/${episode.id}`}><b>Draft:</b> {episode.title}</Link>
            </>
          )}
          {!episode.draft && (
            <Link className={styles.link} key={episode.id} href={`/podcasts/${podcast.id}/episodes/${episode.id}`}>{episode.title}</Link  >
          )}
        </>
      ))}
    </div >
  );
}

export default EpisodeList;
