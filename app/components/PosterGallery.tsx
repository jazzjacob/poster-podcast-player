import React from 'react';


interface Timestamp {
  start: number;
  end: number;
  image: string;
};

interface EpisodeData {
  episodeNumber: number;
  url: string;
  localPath: string;
  title: string;
  timestamps: Timestamp[];
};


interface PosterGalleryProps {
  episodeData: EpisodeData;
  playFromSpecificTime: (start: number) => void;
}



const PosterGallery: React.FC<PosterGalleryProps> = ({ episodeData, playFromSpecificTime }) => {

  //const PosterGallery = ({episodeData, playFromSpecificTime}) => {
  console.log("episode data from within PosterGallery");
  console.log(episodeData);

  function handleImageClick(timestamp: Timestamp) {
    console.log("Image is clicked");
    console.log(timestamp)
    playFromSpecificTime(timestamp.start);
  }

  return (
    <div>
      <h2>This is the poster gallery</h2>

      {episodeData ? (
        <div>
          <p>Images should be displayed here.</p>
          {
            episodeData.timestamps.map(
              (timestamp, index) => {
                return (
                  <img key={index} onClick={() => handleImageClick(timestamp)} style={{height: "100px"}} src={`/images/episode-59/${timestamp.image}`} />
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

export default PosterGallery;
