import parse from 'html-react-parser';

import styles from './EpisodeInformation.module.css';

// Server-side Component for displaying the episode
function EpisodeInformation({ podcast, episode }: { podcast: any, episode: any }) {


  const parsed = parse(episode.contentEncoded ? episode.contentEncoded : episode.description);
  console.log(parsed);

  console.log('Episode description');
  console.log(episode.description);
  console.log('Episode contentEncoded');
  console.log(episode.contentEncoded);
  return (
    <>
      <h1>{episode.title}</h1>
      <p className={styles.podcastName}><b>{podcast.collectionName}</b></p>
      {/* Display sanitized HTML in the component */}

      {/*<p dangerouslySetInnerHTML={{__html: episode.contentEncoded ? episode.contentEncoded : episode.description }}></p>)*/}
      <div className={styles.description}>{parsed}</div>
    </>
  );
}

export default EpisodeInformation;
