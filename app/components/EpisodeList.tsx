import { EpisodeData, PodcastData } from "../helpers/customTypes";
import Link from "next/link";

function EpisodeList({ podcast, episodes }: { podcast: PodcastData, episodes: EpisodeData[] }) {
  return (
    <>
      {episodes?.map(episode => (
        <Link key={episode.id} href={`/podcasts/${podcast.id}/episodes/${episode.id}`}>{episode.title}</Link >
      ))}
    </>
  );
}

export default EpisodeList;
