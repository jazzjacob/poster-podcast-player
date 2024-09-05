import { EpisodeData, PodcastData } from "../helpers/customTypes";
import Link from "next/link";
import styles from './EpisodeList.module.css';
import useStore from "../helpers/store";

function EpisodeList({ podcast, episodes }: { podcast: PodcastData, episodes: EpisodeData[] }) {

  return (
    <div className={styles.container}>
      {episodes?.map(episode => (
        <>
          {!episode.draft && (
            <Link className={styles.link} key={episode.id} href={`/podcasts/${podcast.id}/episodes/${episode.id}`}>{episode.title}</Link  >
          )}
        </>
      ))}
    </div >
  );
}

export default EpisodeList;
