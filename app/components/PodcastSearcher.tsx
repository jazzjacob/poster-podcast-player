'use client';

import { useState, useRef } from "react";
import styles from './PodcastSearcher.module.css';
import Link from "next/link";
import { formatStringForItunesSearch } from "../helpers/functions";

function PodcastSearcher() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Add a state to track the input value
  const [searched, setSearched] = useState(false);

  const searchPlaceholderText = 'Search podcasts';

  async function fetchData(url: string) {
    const response = await fetch(url);
    const data = await response.json();
    setSearchResults(data.results);
    setSearched(true);
    console.log(data.results);
  }

  function search(term: string) {
    const formattedTerm = formatStringForItunesSearch(term);
    const url = `https://itunes.apple.com/search?term=${formattedTerm}&country=se&media=podcast&entity=podcast`;
    console.log(url);
    fetchData(url);
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    let textInput = event.target[0].value;
    if (textInput !== '') {
      search(textInput);
    } else {
      setSearchResults([]);
    }
  }

  function handleInputChange(event: any) {
    setSearchTerm(event.target.value); // Update the state as the input changes
    if (searched) {
      setSearched(false);
    }
  }



  return (
    <div className={styles.container}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input onChange={handleInputChange} value={searchTerm} placeholder={searchPlaceholderText} className={styles.textInput} type='text'></input>
        <button className={styles.searchButton} type='submit'>Search</button>
      </form>
      {searchResults.length > 0 ? (
        <ul className={styles.searchResultsList}>
          {searchResults.map((item: any) => (
            <li key={item.collectionId} className={styles.searchResultItem}>
              <Link href={`/podcasts/${item.collectionId}`} className={styles.titleSection}>
                <img alt={item.collectionName} src={item.artworkUrl100} className={styles.podcastImage} />
                <p className={styles.podcastName}>{item.collectionName}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
         searched && (
          <>
            <p className={styles.noFoundMessage}>No podcasts found.</p>
          </>
        )
      )}
    </div>
  );
}

export default PodcastSearcher;
