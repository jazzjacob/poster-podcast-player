import React from 'react';
import { Timestamp, TimestampImage } from '@/app/helpers/customTypes';
import styles from "./EditModeTimestamps.module.css";

interface EditModeTimestampProps {
  episodeData: EpisodeData;
  currentImages: TimestampImage[];
}

const exampleTimestamps: Timestamp[] = [
  {
    id: "1",
    start: 0,
    end: 10,
    images: [
      {
        id: "1-1",
        image: "last-black-man-1.jpg",
        description: "Theatrical poster"
      },
      {
        id: "1-1",
        image: "last-black-man-2.jpg",
        description: "Theatrical poster"
      },
    ]
  },
  {
    id: "2",
    start: 11,
    end: 20,
    images: [
      {
        id: "2-1",
        image: "in-fabric-1.jpg",
        description: "Infabric theatrical poster 1"
      },
      {
        id: "2-2",
        image: "in-fabric-2.jpg",
        description: "In fabric theatrical poster 2"
      },
    ]
  },
];

const EditModeTimestamps: React.FC<EditModeTimestampProps> = () => {

  //const PosterGallery = ({episodeData, playFromSpecificTime}) => {
  //console.log("episode data from within PosterGallery");
  //console.log(episodeData);

  function handleBoxClick() {
    console.log("Clicking the box");
  }

  return (
    <div style={{}}>
      <p>Timestamps component</p>
      {exampleTimestamps.map((timestamp, index) => (
        <div onClick={handleBoxClick} className={styles.timestampBox} key={`${index}-${timestamp.id}`}>
          {timestamp.images.map((image, index) => (
            <img className={styles.image} key={`${index}-${image.id}`} alt="" src={`/images/episode-59/${image.image}`} />
          ))}
          <div className={styles.startEndContainer}>
            <p>{timestamp.start}</p>
            <p>{timestamp.end}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EditModeTimestamps;
