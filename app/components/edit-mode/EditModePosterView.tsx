import React from 'react';
import { TimestampImage, EpisodeData } from '@/app/helpers/customTypes';

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
    <div style={{height: "400px"}}>
      <p>Edit mode poster view</p>
      {currentImages && currentImages.length > 0 && (
        currentImages.map((image) => {
          return (
            <img style={{height: "300px"}} key={image.image} src={`/images/episode-59/${image.image}`} />
          )
        })
      )}
    </div>
  );
}

export default EditModePosterView;
