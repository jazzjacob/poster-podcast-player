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
  currentImages: string[];
}



const EditModePosterView: React.FC<PosterGalleryProps> = (
  { episodeData, currentImages }
) => {

  //const PosterGallery = ({episodeData, playFromSpecificTime}) => {
  //console.log("episode data from within PosterGallery");
  //console.log(episodeData);

  return (
    <div>
      <p>Edit mode poster view</p>
      {currentImages && currentImages.length > 0 && (
        currentImages.map((image) => {
          return (
            <img style={{height: "300px"}} key={image} src={`/images/episode-59/${image}`} />
          )
        })
      )}
    </div>
  );
}

export default EditModePosterView;
