import { EpisodeData, PodcastData } from "../helpers/customTypes";
import styles from './EpisodeList.module.css';
import SelectLink from "./SelectLink";

function EpisodeList({ podcast, episodes }: { podcast: PodcastData, episodes: EpisodeData[] }) {

  return (
    <div className={styles.container}>
      {episodes?.map(episode => (
        <>
          {!episode.draft && (
            <>
              <SelectLink type={"episode"} podcast={podcast} episode={episode} />
            </>
          )}
        </>
      ))}
    </div >
  );
}

export default EpisodeList;
