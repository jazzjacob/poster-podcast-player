import Link from "next/link";
import styles from './TitleSection.module.css';

async function TitleSection({ podcastName, podcastId, episodeTitle }: { podcastName: string, podcastId: string, episodeTitle: string }) {

  return (
    <div className={styles.container}>
      <Link className={styles.podcastName} href={`/podcasts/${podcastId}`}>{podcastName}</Link>
      <h1>{episodeTitle}</h1>
    </div >
  );
}

export default TitleSection;
