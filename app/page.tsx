"use client"; // This is a client component 👈🏽

import styles from "./page.module.css";
import { useEffect, useState, useRef } from 'react';
import xml2js from 'xml2js';

export default function Home() {
  const [rssFeed, setRssFeed] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const [currentTime, setCurrentTime] = useState(-1);
  const [currentEndTime, setCurrentEndTime] = useState(-1);
  const [lowestTime, setLowestTime] = useState(-1);
  const [highestTime, setHighestTime] = useState(-1);
  const [currentImage, setCurrentImage] = useState(null);
  const [episodeData, setEpisodeData] = useState(null);
  const audioRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const url = "https://feeds.libsyn.com/61238/rss";
      const response = await fetch(url);
      const xml = await response.text();

      const parsedData = await new Promise((resolve, reject) => {
        xml2js.parseString(xml, { trim: true }, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      const items = parsedData.rss.channel[0].item;
      setRssFeed(items);
      console.log(items)
    }

    fetchData();
  }, []);
  
  useEffect(() => {
  	const imageElement = imageRef.current;
  
  	if (-1 < currentTime) {
  		console.log(`Current time in state: ${currentTime}`);
  		console.log(`Current endTime in state: ${currentEndTime}`);
  		console.log(`Current image in state: ${currentImage}`);
  		
  		if (imageElement) {
  			// console.log(imageElement);
  			//imageElement.className = "blueExampleImage"

  			if (episodeData) {
  				console.log(`Lowest: ${lowestTime}`);
  				console.log(`Highest: ${highestTime}`);
  				
  				if (lowestTime <= currentTime && currentTime <= highestTime) {
  					if (currentTime >= currentEndTime) {
							episodeData.timestamps.forEach((timestamp, index) => {
								console.log(timestamp);
								if (timestamp.start == currentTime) {
									console.log(`timestamp start: ${timestamp.start} = current time: ${currentTime}`);
									setCurrentImage(`/images/episode-59/${timestamp.image}`);
									setCurrentEndTime(timestamp.end);
								} else if (timestamp.end == currentTime) {
									setCurrentImage(null);
									setCurrentEndTime(-1);
								}
							});
  					}	
  				} else {
  					setCurrentEndTime(-1);
  				}
  				
  			} else {
  				console.error("No episode data saved.");
  			}
  			
  			
  			if (currentTime <= 5) {
  				imageElement.classList.add(styles.blueExampleImage);
  			} else if (currentTime <= 10) {
  				console.log("Hello")
  			  imageElement.className = "";
					imageElement.classList.add(styles.goldExampleImage);  				
  			} else {
  				imageElement.className = "";
  				imageElement.classList.add(styles.exampleImage);  		
  			}
  		}
  	}
  	
  	
  }, [currentTime]);

  useEffect(() => {
    const audioElement = audioRef.current;
    const imageElement = imageRef.current;

    const handleTimeUpdate = () => {
      if (audioElement) {
        // console.log(`Current time: ${Math.floor(audioElement.currentTime)}`);
        const audioElementTime = Math.floor(audioElement.currentTime);
        // console.log(`AudioElementTime: ${audioElementTime}`);
        // console.log(`State currentTime: ${currentTime}`)
        if (currentTime !== audioElementTime) {
        	// console.log("SETTING CURRENT TIME TO STATE...")
        	setCurrentTime(audioElementTime);
        	

        	// setCurrentTime(audioElementTime => audioElementTime);
        }
      }
    };

    if (audioElement) {
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [audioRef.current, currentTime]);

  const handlePlayFromSpecificTime = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 62; // 1 minute and 2 seconds
      audioRef.current.play();
    }
  };
  
	useEffect(() => {
		// Fetch the JSON file from the public directory
		fetch('/episodes.json')
			.then(response => response.json())
			.then(data => {
				console.log(data); // Log the contents of the JSON file
				setEpisodeData(data.episodes[0]);
				// setCurrentImage(`/images/episode-59/${data.episodes[0].timestamps[1].image}`);
				console.log("Hello")
				const timestamps = data.episodes[0].timestamps;
				setLowestTime(data.episodes[0].timestamps[0].start);
				setHighestTime(timestamps[Object.keys(timestamps)[Object.keys(timestamps).length - 1]].end);
			})
			.catch(error => {
				console.error('Error fetching the JSON file:', error);
		});
	}, []);
	
	useEffect(() => {
		if (episodeData) {
			console.log("Episode data:");
			console.log(episodeData)
		} 
	}, [episodeData]);

  return (
    <main className={styles.main}>
      <p className={styles.greetingText}>Hello, this is <b>Poster Podcast Player</b>.</p>
      <audio ref={audioRef} controls src="/podcasts/posterboys-059-2019inreview.mp3" type="audio/mpeg"></audio>
      <div>
				<button onClick={handlePlayFromSpecificTime}>Play from 1:02</button>
				<div className={styles.exampleImageContainer}>
					<p>The image will be blue for the first five seconds, gold for the next five, and then be gray again.</p>
					<div ref={imageRef} className={styles.exampleImage}></div>
					<img className={styles.imageStyle} src="/images/episode-59/last-black-man-1.jpg" />
					<div>
						{currentImage ? (
							<img className={styles.imageStyle} src={currentImage} />
						) : (
							<div className={styles.posterPlaceholder}></div>
						)}
					</div>
				</div>
			</div>
      
      {false && rssFeed && (
        <div>
          <p>{rssFeed[0].title}</p>
          <audio ref={audioRef} controls src={rssFeed[0].enclosure[0].$.url}></audio>
          <button onClick={handlePlayFromSpecificTime}>Play from 1:02</button>
          <div className={styles.exampleImageContainer}>
	          <p>The image will be blue for the first five seconds, gold for the next five, and then be gray again.</p>
  	        <div ref={imageRef} className={styles.exampleImage}></div>
  	      </div>
        </div>
      )}
    </main>
  );
}






