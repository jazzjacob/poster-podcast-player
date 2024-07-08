import React from 'react';
import { TimestampImage, EpisodeData } from '@/app/helpers/customTypes';
import styles from './EditModePosterView.module.css';

interface PosterGalleryProps {
  episodeData: EpisodeData;
  currentImages: TimestampImage[];
}



const EditModePosterView: React.FC<PosterGalleryProps> = (
  { episodeData, currentImages }
) => {

  //const PosterGallery = ({episodeData, playFromSpecificTime}) => {
  //console.log("episode data from within PosterGallery");
  //console.log(episodeData);

  return (
    <div className={styles.startView}>
      {currentImages && currentImages.length > 0 ? (
        currentImages.map((image) => {
          return (
            <img alt="" style={{height: "300px"}} key={image.image} src={`/images/episode-59/${image.image}`} />
          )
        })
      ) : (
          <p>Select images below</p>
      )}
    </div>
  );
}

export default EditModePosterView;
