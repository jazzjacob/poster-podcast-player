import { PodcastData } from '../helpers/customTypes';
import styles from './PodcastHero.module.css';

function PodcastHero({ podcast, color }: {podcast: any, color: string}) {
  return (
    <section
      className={styles.container}
      style={{
        backgroundColor: color
      }}
    >
      <img className={styles.podcastImage} alt={podcast.podcastName} src={podcast?.artworkUrl600} />
    </section >
  );
}

export default PodcastHero;
