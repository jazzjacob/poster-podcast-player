"use client"; // This is a client component 👈🏽

import styles from "./page.module.css";
import { useEffect } from 'react';
import xml2js from 'xml2js';

function fetchPodcast() {
	console.log("Gonna fetch me some podcasts!");
	fetchData();
}

async function fetchData() {
	const url = "https://feeds.libsyn.com/61238/rss";
	console.log(url);
	const response = await fetch(url);
	const xml = await response.text();
  
  console.log(xml)
  // const data = await response.json();
  console.log(response);
  
  const parsedData = await new Promise((resolve, reject) => {
		xml2js.parseString(xml, { trim: true }, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
	console.log(parsedData);
}

export default function Home() {
	useEffect(() => {
		fetchPodcast();
	}, []);
	
  return (
    <main className={styles.main}>
    	<p className={styles.greetingText}>Hello, this is <b>Poster Podcast Player</b>.</p>
    </main>
  );
}
