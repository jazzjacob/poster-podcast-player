import React, { useState, useEffect } from 'react';
import { Timestamp, TimestampImage, EditModeData, EditModeTime } from '@/app/helpers/customTypes';
import styles from "./EditModeTimestamps.module.css";
import useStore from '@/app/helpers/store';

interface EditModeTimestampsProps {
  timestamps: Timestamp[],
  setCurrentEditModeData: React.Dispatch<React.SetStateAction<EditModeData>>,
  updateEditModeTime: (field: keyof EditModeTime, timeInSeconds: number) => void,
}


const EditModeTimestamps: React.FC <EditModeTimestampsProps> = ({ timestamps, setCurrentEditModeData, updateEditModeTime }) => {

  const [sortedTimestamps, setSortedTimestamps] = useState<Timestamp[]>([]);
  //const PosterGallery = ({episodeData, playFromSpecificTime}) => {
  //console.log("episode data from within PosterGallery");
  //console.log(episodeData);

  const timestampState = useStore((state) => state?.currentEpisode?.timestamps);
  const setInitialEdit = useStore((state) => state.setInitialEdit);
  const setCurrentEdit = useStore((state) => state.setCurrentEdit);

  useEffect(() => {
    if (timestampState) {
      //console.log("Sorting the timestamps...");
      const sortedTimestamps = timestampState.sort((a, b) => a.start - b.start);
      setSortedTimestamps(sortedTimestamps);
    }
  }, [timestampState]);

  function handleBoxClick(timestamp: Timestamp) {

    const currentData = {
      startTime: timestamp.start,
      endTime: timestamp.end,
      images: timestamp.images,
      startTimeSaved: true,
      endTimeSaved: true,
      timestampId: timestamp.id
    };

    setCurrentEditModeData(currentData);
    updateEditModeTime('startTime', timestamp.start);
    updateEditModeTime('endTime', timestamp.end);
    console.log("Setting initial edit: ", currentData);
    setInitialEdit(currentData);
    setCurrentEdit(currentData);
    /*startTime: number,
    endTime: number,
    images: TimestampImage[],
    startTimeSaved: boolean,
    timestampId: string*/
  }

  return (
    <>
    <div className={styles.container}>
      {/*timestamps.map((timestamp, index) => (
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
      ))*/}
      {sortedTimestamps && sortedTimestamps.length > 0 &&  sortedTimestamps.map((timestamp, index) => (
        <div onClick={() => handleBoxClick(timestamp)} className={styles.timestampBox} key={`${index}-${timestamp.id}`}>
          <div className={styles.thumbnailContainer}>
            {timestamp.images.map((image, index) => (
              <img className={styles.image} key={`${index}-${image.id}`} alt="" src={image.image} />
            ))}
          </div >
          <div className={styles.startEndContainer}>
            <p>{timestamp.start}</p>
            <p>{timestamp.end}</p>
          </div>
        </div>
      ))}
    </div>
    </>
  );
}

export default EditModeTimestamps;
