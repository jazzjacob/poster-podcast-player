'use client'

 import React, {useEffect, useState} from 'react';
 import Image from 'next/image';
 import { EpisodeData, Timestamp } from '../helpers/customTypes';
 import styles from "./PosterGallery.module.css"
 import useStore from '../helpers/store';

 interface PosterGalleryProps {
   episodeData: EpisodeData;
   playFromSpecificTime: (start: number) => void;
 }

 const PosterGallery: React.FC<PosterGalleryProps> = ({ episodeData, playFromSpecificTime }) => {
   const timestampState = useStore((state) => state.currentEpisode?.timestamps);
   const [sortedTimestamps, setSortedTimestamps] = useState<Timestamp[]>([]);

   const handleImageClick = (timestamp: Timestamp) => {
     console.log("Image is clicked");
     console.log(timestamp);
     playFromSpecificTime(timestamp.start);
   };

   useEffect(() => {
     if (timestampState) {
       // console.log("Sorting the timestamps...");
       const sortedTimestamps = timestampState.sort((a, b) => a.start - b.start);
       setSortedTimestamps(sortedTimestamps);
     }
   }, [timestampState]);

   return (
     <div>
       <h2>Poster gallery</h2>
       {/*episodeData && episodeData.timestamps && episodeData.timestamps.length > 0 ? (
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
           ))*/}
       {/* USING  DATA FROM DATABASE BELOW */}
       {sortedTimestamps &&  sortedTimestamps.length > 0 ? (
         <div className={styles.imagesContainer}>
           {sortedTimestamps.map((timestamp, timestampIndex) => (
             timestamp.images && timestamp.images.length > 0 && (
               <div key={timestamp.id} className={styles.posterGroup}>
                 {timestamp.images.map((image, imageIndex) => (
                   <img
                    key={`${timestampIndex}-${imageIndex}`}
                    style={{ width: "100px", cursor: "pointer" }}
                     onClick={() => handleImageClick(timestamp)}
                     src={image.image}
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
