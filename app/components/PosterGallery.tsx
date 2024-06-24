import React from 'react';

/*
interface EpisodeData {
  episodeData: {
    episodeData: {
      timestamps: {
        start: number;
        end: number;// Assuming 'start' is a number
        image: string;
        // Add more properties as needed
      }[];
    }
  }
}

interface PosterGalleryProps extends EpisodeData {
  playFromSpecificTime: (start: number) => void;
}
*/

//const PosterGallery: React.FC<PosterGalleryProps> = ({ episodeData, playFromSpecificTime }) => {

const PosterGallery = ({ episodeData, playFromSpecificTime }) => {
  console.log("episode data from within PosterGallery");
  console.log(episodeData);

  function handleImageClick(timestamp) {
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
              (timestamp: any, index: number) => {
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
