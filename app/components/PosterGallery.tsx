 import React, {useEffect} from 'react';
 import Image from 'next/image';
 import { EpisodeData, Timestamp } from '../helpers/customTypes';
 import styles from "./PosterGallery.module.css"

 interface PosterGalleryProps {
   episodeData: EpisodeData;
   playFromSpecificTime: (start: number) => void;
 }

 const PosterGallery: React.FC<PosterGalleryProps> = ({ episodeData, playFromSpecificTime }) => {
   const handleImageClick = (timestamp: Timestamp) => {
     console.log("Image is clicked");
     console.log(timestamp);
     playFromSpecificTime(timestamp.start);
   };

   useEffect(() => {
     console.log("Episode data inside poster gallery");
     console.log(episodeData);
   }, [episodeData]);

   return (
     <div>
       <h2>This is the poster gallery</h2>
       {episodeData && episodeData.timestamps && episodeData.timestamps.length > 0 ? (
         <div className={styles.imagesContainer}>
           {episodeData.timestamps.map((timestamp, timestampIndex) => (
             timestamp.images && timestamp.images.length > 0 && (
               <div key={timestampIndex} className={styles.posterGroup}>
                 {timestamp.images.map((image, imageIndex) => (
                   <img
                    key={`${timestampIndex}-${imageIndex}`}
                    style={{ width: "100px", cursor: "pointer" }}
                     onClick={() => handleImageClick(timestamp)}
                     src={`/images/episode-59/${image.image}`}
                     alt={`Episode image ${image.image}`}
                   />
                 ))}
               </div>
             )
           ))}
         </div>
       ) : (
         <p>No images</p>
       )}
     </div>
   );
 };

 export default PosterGallery;



















/*import React from 'react';
import { EpisodeData, Timestamp } from '../helpers/customTypes';


interface PosterGalleryProps {
  episodeData: EpisodeData;
  playFromSpecificTime: (start: number) => void;
}



const PosterGallery: React.FC<PosterGalleryProps> = ({ episodeData, playFromSpecificTime }) => {

  //const PosterGallery = ({episodeData, playFromSpecificTime}) => {
  //console.log("episode data from within PosterGallery");
  //console.log(episodeData);

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
                return timestamp.images.map((image) => {
                  return  <img key={index} onClick={() => handleImageClick(timestamp)} style={{height: "100px"}} src={`/images/episode-59/${image}`} />
                })
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

export default PosterGallery;*/
