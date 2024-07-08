import React from 'react';
import { TimestampImage, EpisodeData, EditModeData, EditModeTime } from '@/app/helpers/customTypes';
import styles from './EditModePosterView.module.css';
import EditModeTimeForm from './EditModeTimeForm';

interface PosterGalleryProps {
  episodeData: EpisodeData;
  currentImages: TimestampImage[];
  currentEditModeData: EditModeData;
  editModeTime: EditModeTime;
  currentTime: number;
  setEditModeTime: React.Dispatch<React.SetStateAction<EditModeTime>>;
  setUserIsEditing: (userIsEditing: boolean) => void;
}



const EditModePosterView: React.FC<PosterGalleryProps> = (
  { episodeData, currentImages, currentEditModeData, currentTime, setEditModeTime, setUserIsEditing, editModeTime }
) => {

  //const PosterGallery = ({episodeData, playFromSpecificTime}) => {
  //console.log("episode data from within PosterGallery");
  //console.log(episodeData);

  return (
    <div className={styles.startView}>
      {currentImages && currentImages.length > 0 ? (
        <div className={styles.imagesAndTimeContainer}>
          <div className={styles.currentImagesContainer}>
            {currentImages.map(image => (<img alt="" style={{ height: "300px"}} key={image.image} src={`/images/episode-59/${image.image}`} />))}
          </div >
          <div className={styles.timeFormContainer}>
            <EditModeTimeForm timeType="startTime" currentEditModeData={currentEditModeData} editModeTime={editModeTime} currentTime={currentTime} setEditModeTime={setEditModeTime} setUserIsEditing={setUserIsEditing} />
            <EditModeTimeForm timeType="endTime" currentEditModeData={currentEditModeData} editModeTime={editModeTime} currentTime={currentTime} setEditModeTime={setEditModeTime} setUserIsEditing={setUserIsEditing} />
          </div>
        </div >
      ) : (
          <p>Select images below</p>
      )}
    </div>
  );
}

export default EditModePosterView;
