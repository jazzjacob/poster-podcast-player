import React, { useEffect, useState } from 'react';
import { TimestampImage, Timestamp, UploadedImage, EpisodeData } from '@/app/helpers/customTypes';
import { deleteImage } from '@/app/firebase/storageOperations';
import useStore from '@/app/helpers/store';
import { addImageToCurrentEdit, removeImageFromCurrentEdit } from '@/app/helpers/functions';


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

  const currentPodcast = useStore((state) => state.podcast);
  const currentEpisode = useStore((state) => state.currentEpisode);
  const currentEdit = useStore((state) => state.currentEdit);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  useEffect(() => {
    console.log("current time inside edit mode gallery:");
    console.log(currentTime);
  }, [currentTime]);


  //const PosterGallery = ({episodeData, playFromSpecificTime}) => {
  //console.log("episode data from within PosterGallery");
  //console.log(episodeData);

  function handleImageClick(uploadedImage: UploadedImage, index: number) {
    console.log("uploaded image: ", uploadedImage);
    if (currentEdit && currentEdit.images && (currentEdit.images.find(image => image.uploadedImageId == uploadedImage.id) != undefined)) {
      console.log("The image is in state, removing image...");
      removeImageFromCurrentEdit(uploadedImage.id);
    } else {
      console.log("The image is not in state, adding image...");
      addImageToCurrentEdit(uploadedImage);
    }
    if (currentEdit) {
      //console.log("current edit: ", currentEdit);
    }
    setSelectedIndex(selectedIndex == index ? -1 : index);
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

  function handleDeleteImage(podcastId: string, episodeId: string, image: UploadedImage) {
    // How it should work:
    //deleteImage(podcastId, episodeId, image);
    console.log("Delete image: ", image);

  }

  return (
     <div>
       {episodeData && episodeData.uploadedImages.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap'}}>
           {currentEpisode && currentPodcast && (
             episodeData.uploadedImages.map((uploadedImage, index) => (
               <div key={`${uploadedImage.id}-${index}`}>
                 <img
                   alt={`Episode image ${uploadedImage.url}`}
                   onClick={() => handleImageClick(uploadedImage, index)}
                   style={{ height: '100px', cursor: 'pointer', margin: '8px' }}
                   src={uploadedImage.url}
                 />
                 {selectedIndex === index && (
                   <div>
                     <p>Selected</p>
                     <button onClick={() => handleDeleteImage(currentPodcast.id, currentEpisode.id, uploadedImage)}>Delete</button>
                   </div>
                 )}
               </div>
             ))
           )}
         </div >
       ) : (
         <p>No images</p>
       )}
     </div>
   );
}

export default EditModePosterGallery;
