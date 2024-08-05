import React, { useEffect, useState } from "react";
import {
  TimestampImage,
  UploadedImage,
  EpisodeData,
} from "@/app/helpers/customTypes";
import { deleteUploadedImage } from "@/app/firebase/storageOperations";
import useStore from "@/app/helpers/store";
import {
  addImageToCurrentEdit,
  removeImageFromCurrentEdit,
  setGlobalStateFromFirebase,
} from "@/app/helpers/functions";

interface EditModePosterGalleryProps {
  episodeData: EpisodeData;
  addImage: (image: UploadedImage) => void;
  removeImage: (image: string) => void;
  currentImages: TimestampImage[];
  currentTime: number;
  handleCancel: () => void;
}

const EditModePosterGallery: React.FC<EditModePosterGalleryProps> = ({
  episodeData,
  addImage,
  removeImage,
  currentImages,
  currentTime,
  handleCancel,
}) => {
  const currentPodcast = useStore((state) => state.podcast);
  const currentEpisode = useStore((state) => state.currentEpisode);
  const currentEdit = useStore((state) => state.currentEdit);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [addedIndex, setAddedIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log("current time inside edit mode gallery:", currentTime);
  }, [currentTime]);

  function handleImageClick(uploadedImage: UploadedImage, index: number) {
    console.log("uploaded image: ", uploadedImage);
    if (
      currentEdit &&
      currentEdit.images &&
      currentEdit.images.some((image) => image.id === uploadedImage.id)
    ) {
      console.log("The image is in state, removing image...");
      removeImageFromCurrentEdit(uploadedImage.id);
      setAddedIndex(null);
    } else {
      console.log("The image is not in state, adding image...");
      addImageToCurrentEdit(uploadedImage);
      setAddedIndex(index);
    }
    setSelectedIndex(index);
    if (currentImages.length < 1) {
      addImage(uploadedImage);
    } else {
      let imageIsRemoved = false;
      currentImages.forEach((currentImage) => {
        if (currentImage.image === uploadedImage.url) {
          removeImage(uploadedImage.url);
          imageIsRemoved = true;
        }
      });
      if (!imageIsRemoved) {
        addImage(uploadedImage);
      }
    }
  }

  function checkIfImageIsUsed(image: UploadedImage) {
    console.log("Gonna check if image is used here");
    console.log(image);
    console.log(episodeData.timestamps);

    const isUsed = episodeData.timestamps.some((timestamp) => {
      return timestamp.images.some((timestampImage) => {
        console.log("Uploaded image id:", image.id);
        console.log("Timestamp image id:", timestampImage.id);
        if (image.id === timestampImage.id) {
          console.log("Image is used! Returning true");
          return true;
        }
        return false;
      });
    });

    if (!isUsed) {
      console.log("No match found, returning false");
    }
    return isUsed;
  }

  function handleDeleteImage(
    podcastId: string,
    episodeId: string,
    image: UploadedImage,
  ) {
    // How it should work:
    // deleteUploadedImage(podcastId, episodeId, image);

    // Check if image is used in any timestamp
    // If not, delete image

    const imageIsUsed = checkIfImageIsUsed(image);

    if (imageIsUsed) {
      console.log("Image cannot be deleted, since it is being used in timestamp!");
    } else {
      console.log("Gonna delete image now...");
      deleteUploadedImage(podcastId, episodeId, image);
      setGlobalStateFromFirebase(podcastId, episodeId);
      handleCancel();
    }
  }

  return (
    <div>
      {episodeData && episodeData.uploadedImages.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {currentEpisode &&
            currentPodcast &&
            episodeData.uploadedImages.map((uploadedImage, index) => (
              <div
                key={`${uploadedImage.id}-${index}`}
                style={{ position: "relative", margin: "8px" }}
              >
                <img
                  alt={`Episode image ${uploadedImage.url}`}
                  onClick={() => handleImageClick(uploadedImage, index)}
                  style={{
                    height: "100px",
                    cursor: "pointer",
                    outline:
                      uploadedImage.timestampIds.length > 0
                        ? "2px solid red"
                        : "none",
                    border:
                      currentEdit &&
                      currentEdit.images.some(
                        (image) => image.id === uploadedImage.id,
                      )
                        ? "4px solid lightgreen"
                        : "none",
                  }}
                  src={uploadedImage.url}
                />
                {selectedIndex === index && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "black",
                    }}
                  >
                    <div>
                      <button
                        onClick={() =>
                          handleDeleteImage(
                            currentPodcast.id,
                            currentEpisode.id,
                            uploadedImage,
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <p>No images</p>
      )}
    </div>
  );
};

export default EditModePosterGallery;
