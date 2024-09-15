import { useState } from "react";
import styles from './PodcastSearcher.module.css';
import { parseStringPromise } from 'xml2js';

function formatForItunesSearch(input: string): string {
    let formatted = input;
    formatted = formatted.toLowerCase();
    formatted = formatted.replace(/\s+/g, ' ');
    formatted = formatted.replace(/[^\p{L}\d\s]/gu, '');
    formatted = formatted.trim();
    formatted = formatted.replace(/\s/g, '%20');

    return formatted;
}

function PodcastSearcher() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState<{ index: number, podcast: any }>({index: - 1, podcast: {}});
  const [episodes, setEpisodes] = useState<any[]>([]);

  async function fetchData(url: string) {
    const response = await fetch(url);
    const data = await response.json();
    setSearchResults(data.results);
    console.log(data.results);
  }

  function search(term: string) {
    const formattedTerm = formatForItunesSearch(term);
    const url = `https://itunes.apple.com/search?term=${formattedTerm}&country=us&media=podcast&entity=podcast`;
    console.log(url);
    fetchData(url);
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    let textInput = event.target[0].value;
    if (textInput !== '') {
      console.log(textInput);
      // event.target[0].value = '';
      search(textInput);
    } else {
      console.log('Empty field!');
      setSearchResults([]);
    }
  }

  /*async function fetchRSSFeed(url: string): Promise<any[]> {
    try {
      const response = await fetch(url);
      //const response = await fetch('/api/rss-proxy'); // Fetch from the API route
      if (!response.ok) {
        throw new Error('Failed to fetch RSS feed');
      }

      console.log(response);

      const textData = await response.text();

      // Parse the XML using DOMParser
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(textData, "application/xml");

      // Check for parsing errors
      if (xmlDoc.querySelector('parsererror')) {
        throw new Error('Error parsing RSS feed');
      }

      // Extract the items from the RSS feed
      const items = Array.from(xmlDoc.querySelectorAll("item"));

      // Convert XML data to JS objects
      const parsedItems = items.map((item) => ({
        title: item.querySelector("title")?.textContent || "",
        link: item.querySelector("link")?.textContent || "",
        description: item.querySelector("description")?.textContent || "",
        pubDate: item.querySelector("pubDate")?.textContent || "",
      }));

      return parsedItems;

    } catch (error) {
      console.error("Error fetching RSS feed:", error);
      return [];
    }
  }*/

  async function fetchRSSFeed(url: string): Promise<any[]> {
    try {
      // Call the API route in the App Router
      const response = await fetch(`/api/rss-proxy?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch RSS feed');
      }

      const textData = await response.text();

      // Parse the XML using DOMParser
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(textData, 'application/xml');

      // Check for parsing errors
      if (xmlDoc.querySelector('parsererror')) {
        throw new Error('Error parsing RSS feed');
      }

      // Extract the items from the RSS feed
      const items = Array.from(xmlDoc.querySelectorAll('item'));

      // Convert XML data to JS objects
      const parsedItems = items.map((item) => {
        const image = item.querySelector('itunes\\:image') || item.querySelector('image');

        return {
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          description: item.querySelector('description')?.textContent?.trim() || '',
          pubDate: item.querySelector('pubDate')?.textContent || '',
          guid: item.querySelector('guid')?.textContent || '',
          image: image?.getAttribute('href') || '',
          enclosureUrl: item.querySelector('enclosure')?.getAttribute('url') || '',
          enclosureLength: item.querySelector('enclosure')?.getAttribute('length') || '',
          enclosureType: item.querySelector('enclosure')?.getAttribute('type') || '',
          duration: item.getElementsByTagName('itunes:duration')?.[0]?.textContent || '',  // Updated this line
          explicit: item.querySelector('itunes\\:explicit')?.textContent === 'true',
          subtitle: item.getElementsByTagName('itunes:subtitle')?.[0]?.textContent || '',
          episodeType: item.getElementsByTagName('itunes:episodeType')?.[0]?.textContent || ''
        }
      });



      return parsedItems;
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      return [];
    }
  }



  async function handlePodcastClick(podcast: any, index: number) {
    console.log(podcast);
    console.log(podcast.collectionName);
    console.log(podcast.collectionId);

    if (selectedPodcast.podcast == podcast || podcast == null) {
      setSelectedPodcast({ index: -1, podcast: {} });
    } else {
      setSelectedPodcast({index: index, podcast: podcast});
    }

    const rssEpisodes = await fetchRSSFeed(podcast.feedUrl);
    if (rssEpisodes.length > 0) {
      setEpisodes(rssEpisodes);
    }
    console.log(rssEpisodes);
  }

  return (
    <div className={styles.container}>
      <p>This is podcast searcher</p>
      <form onSubmit={handleSubmit}>
        <input type='text'></input>
        <button type='submit'>Search</button>
      </form>
      {searchResults.length > 0 && (
        <ul className={styles.searchResultsList}>
          {searchResults.map((item: any, index: number) => (
            <li key={item.collectionId} className={styles.searchResultItem}>
              <div className={styles.titleSection} onClick={() => handlePodcastClick(item, index)}>
                <img alt={item.collectionName} src={item.artworkUrl60} height={40} />
                <p className={styles.podcastName}>{item.collectionName}</p>
              </div>
              {selectedPodcast.index == index && (
                <ul className={styles.episodes}>
                  {episodes.map((episode, index) => (
                    <li key={`${episode.title}-${index}`} className={styles.episode}>
                      <button onClick={() => {console.log(episode)}}>{episode.title}</button>
                    </li>
                  ))}
                  <p>{selectedPodcast.podcast.collectionName}</p>
                  <p>{selectedPodcast.podcast.feedUrl}</p>
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PodcastSearcher;
