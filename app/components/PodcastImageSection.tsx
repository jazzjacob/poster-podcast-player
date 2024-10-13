import styles from './PodcastImageSection.module.css';

function PodcastImageSection({ podcast, episode }: { podcast: any, episode: any }) {

  return (
    <>
      <div className={styles.container}>
        <img src={episode.image ? episode.image : podcast.artworkUrl600} className={styles.episodeImage} alt={episode.title} />
      </div>
    </>
  )
}

export default PodcastImageSection;
