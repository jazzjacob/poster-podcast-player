import { PodcastData } from '../helpers/customTypes';
import styles from './PodcastHero.module.css';

function PodcastHero({ podcast, color }: {podcast: PodcastData, color: string}) {
  return (
    <section
      className={styles.container}
      style={{
        backgroundColor: color
      }}
    >
      <img className={styles.podcastImage} alt={podcast.podcastName} src={podcast?.image} />
    </section >
  );
}

export default PodcastHero;
