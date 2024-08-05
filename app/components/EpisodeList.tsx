import { EpisodeData, PodcastData } from "../helpers/customTypes";
import Link from "next/link";

function EpisodeList({ podcast, episodes }: { podcast: PodcastData, episodes: EpisodeData[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {episodes?.map(episode => (
        <Link key={episode.id} href={`/podcasts/${podcast.id}/episodes/${episode.id}`}>{episode.title}</Link  >
      ))}
    </div >
  );
}

export default EpisodeList;
