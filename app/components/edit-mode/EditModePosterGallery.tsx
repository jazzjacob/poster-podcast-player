import React from 'react';

interface Timestamp {
  start: number;
  end: number;
  image: string;
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
}



const EditModePosterGallery: React.FC<PosterGalleryProps> = (
  { episodeData, setCurrentImagesInEditMode, addImage, removeImage, currentImages }
) => {

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
