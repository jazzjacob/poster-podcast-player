'use client'

import { Timestamp } from "../helpers/customTypes";
import useStore from "../helpers/store";
import styles  from './GalleryTimestamp.module.css';

function GalleryTimestamp({ timestamp }: { timestamp: Timestamp }) {
  const setCurrentTime = useStore((store) => store.setCurrentTime);
  const setPlayFromTime = useStore((store) => store.setPlayFromTime);

  function handleTimestampClick() {
    console.log(timestamp);
    setPlayFromTime(timestamp.start);
  }

  return (
    <>
      {/*<div key={timestamp.id} className={styles.posterGroup} onClick={handleTimestampClick}>*/}
      {timestamp.images.map((image, imageIndex) => (
        <div className={styles.imageContainer}  key={`${image.id}`}>
          <img
          className={styles.image}
          src={image.image}
          alt={`Episode image ${image.image}`}
          onClick={handleTimestampClick}
          />
        </div >
      ))}
      {/*</div>*/}
    </>
  );
}

export default GalleryTimestamp;
