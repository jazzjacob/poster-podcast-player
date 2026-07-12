import React from "react";
import { EpisodeData, PodcastData } from "../helpers/customTypes";
import styles from './EpisodeList.module.css';
import SelectLink from "./SelectLink";

function EpisodeList({ podcast, episodes }: { podcast: PodcastData, episodes: EpisodeData[] }) {

  return (
    <div className={styles.container}>
      {episodes?.map((episode, index) => (
        <React.Fragment key={(episode as any).guid?.[`#text`] || (episode as any).guid || episode.id || index}>
          {!episode.draft && (
            <SelectLink type={"episode"} podcast={podcast} episode={episode} />
          )}
        </React.Fragment>
      ))}
    </div >
  );
}

export default EpisodeList;
