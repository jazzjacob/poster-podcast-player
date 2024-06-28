import React, { useEffect } from 'react';

interface TimestampImage {
  id: string;
  image: string;
  description: string;
}

interface Timestamp {
  id: string;
  start: number;
  end: number;
  image: string;
  images: TimestampImage[];
};

interface UploadedImage {
  id: string;
  image: string;
  used: boolean;
  timestampIds: string[];
};

interface EpisodeData {
  episodeNumber: number;
  url: string;
  localPath: string;
  title: string;
  episodeImage: string;
  timestamps: Timestamp[];
  uploadedImages: UploadedImage[];
};


interface PosterGalleryProps {
  episodeData: EpisodeData;
  setCurrentImagesInEditMode: (image: string[]) => void;
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  currentImages: string[];
  currentTime: number;
}



const EditModePosterGallery: React.FC<PosterGalleryProps> = (
  { episodeData, setCurrentImagesInEditMode, addImage, removeImage, currentImages, currentTime }
) => {
  useEffect(() => {
    console.log("current time inside edit mode gallery:");
    console.log(currentTime);
  }, [currentTime]);

  //const PosterGallery = ({episodeData, playFromSpecificTime}) => {
  //console.log("episode data from within PosterGallery");
  //console.log(episodeData);

  function handleImageClick(uploadedImage: UploadedImage) {
    console.log("Image is clicked from EditMode");
    console.log(uploadedImage);
    // setCurrentImagesInEditMode(prevItems => [...prevItems, uploadedImage.image]);
    if (currentImages.includes(uploadedImage.image)) {
      removeImage(uploadedImage.image);
    } else {
      addImage(uploadedImage.image);
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
                  <img key={index} onClick={() => handleImageClick(uploadedImage)} style={{height: "100px"}} src={`/images/episode-59/${uploadedImage.image}`} />
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
