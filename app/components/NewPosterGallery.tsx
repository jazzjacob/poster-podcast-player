import React from 'react';
import styles from "./PosterGallery.module.css"
import { fetchEpisode } from '../firebase/firestoreOperations';
import CurrentTimeComponent from './CurrentTimeComponent';

async function PosterGallery({ podcastId, episodeId }: {podcastId: string, episodeId: string}) {
   const episode = await fetchEpisode(podcastId, episodeId);
   const sortedTimestamps = episode?.timestamps.sort((a, b) => a.start - b.start);

   return (
     <div>
       <h2>This is the poster gallery</h2>
       <CurrentTimeComponent />
       {/* USING  DATA FROM DATABASE BELOW */}
       {sortedTimestamps && sortedTimestamps.length > 0 ? (
         <div className={styles.imagesContainer}>
           {sortedTimestamps.map((timestamp, timestampIndex) => (
             timestamp.images && timestamp.images.length > 0 && (
               <div key={timestamp.id} className={styles.posterGroup}>
                 {timestamp.images.map((image, imageIndex) => (
                   <img
                    key={`${timestampIndex}-${imageIndex}`}
                    style={{ width: "100px", cursor: "pointer" }}
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
