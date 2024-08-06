import { PodcastData } from '../helpers/customTypes';
import styles from './PodcastHero.module.css';

function PodcastHero({ podcast }: {podcast: PodcastData}) {
  return (
    <section className={styles.container}>
      <img className={styles.podcastImage} alt={podcast.podcastName} src={podcast?.image} />
    </section >
  );
}

export default PodcastHero;
