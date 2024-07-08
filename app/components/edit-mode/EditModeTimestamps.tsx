import React from 'react';
import { Timestamp, TimestampImage, EditModeData, EditModeTime } from '@/app/helpers/customTypes';
import styles from "./EditModeTimestamps.module.css";

interface EditModeTimestampsProps {
  timestamps: Timestamp[],
  setCurrentEditModeData: React.Dispatch<React.SetStateAction<EditModeData>>,
  updateEditModeTime: (field: keyof EditModeTime, timeInSeconds: number) => void,
}


const EditModeTimestamps: React.FC <EditModeTimestampsProps> = ({ timestamps, setCurrentEditModeData, updateEditModeTime }) => {

  //const PosterGallery = ({episodeData, playFromSpecificTime}) => {
  //console.log("episode data from within PosterGallery");
  //console.log(episodeData);

  function handleBoxClick(timestamp: Timestamp) {
    console.log("Clicking the box");
    console.log(timestamp);

    setCurrentEditModeData({
      startTime: timestamp.start,
      endTime: timestamp.end,
      images: timestamp.images,
      startTimeSaved: true,
      endTimeSaved: true,
      timestampId: timestamp.id
    });
    updateEditModeTime('startTime', timestamp.start);
    updateEditModeTime('endTime', timestamp.end);
    /*startTime: number,
    endTime: number,
    images: TimestampImage[],
    startTimeSaved: boolean,
    timestampId: string*/
  }

  return (
    <div className={styles.container}>
      {timestamps.map((timestamp, index) => (
        <div onClick={() => handleBoxClick(timestamp)} className={styles.timestampBox} key={`${index}-${timestamp.id}`}>
          <div className={styles.thumbnailContainer}>
            {timestamp.images.map((image, index) => (
              <img className={styles.image} key={`${index}-${image.id}`} alt="" src={`/images/episode-59/${image.image}`} />
            ))}
          </div >
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
