import React, { useEffect } from 'react';
import { TimestampImage, Timestamp, UploadedImage, EpisodeData } from '@/app/helpers/customTypes';


interface EditModePosterGalleryProps {
  episodeData: EpisodeData;
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  currentImages: TimestampImage[];
  currentTime: number;
}

const EditModePosterGallery: React.FC<EditModePosterGalleryProps> = (
  { episodeData, addImage, removeImage, currentImages, currentTime }
) => {
  useEffect(() => {
    console.log("current time inside edit mode gallery:");
    console.log(currentTime);
  }, [currentTime]);

  //const PosterGallery = ({episodeData, playFromSpecificTime}) => {
  //console.log("episode data from within PosterGallery");
  //console.log(episodeData);

  function handleImageClick(uploadedImage: UploadedImage) {
    if (currentImages.length < 1) {
      addImage(uploadedImage.url);
    } else {
      let imageIsRemoved = false;
      currentImages.forEach((currentImage) => {
        if (currentImage.image == uploadedImage.url) {
          removeImage(uploadedImage.url);
          imageIsRemoved = true;
        }
      })
      if (!imageIsRemoved) {
        addImage(uploadedImage.url);
      }
    }
  }

  return (
    <div>
      {episodeData && episodeData.uploadedImages.length > 0 ? (
        <div>
          {
            episodeData.uploadedImages.map(
              (uploadedImage, index) => {
                return (
                  <img alt={`Episode image ${uploadedImage.url}`} key={index} onClick={() => handleImageClick(uploadedImage)} style={{height: "100px", cursor: "pointer", margin: "8px"}} src={uploadedImage.url} />
                )
              }
            )
          }
        </div>
      ):(
        <p>No images</p>
      )}
    </div>
  );
}

export default EditModePosterGallery;
