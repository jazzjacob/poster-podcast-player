import { v4 as uuidv4 } from 'uuid';
import { Timestamp, OverlapDetails, UploadedImage, TimestampImage, EditModeData } from './customTypes';
import { fetchAllPodcasts, fetchEpisode, fetchPodcast } from '../firebase/firestoreOperations';
import useStore from './store';
import FastXMLParser from 'fast-xml-parser';  // Import the default export

export const generateId = (): string => {
  return uuidv4();
};

export async function fetchEpisodeByGUID(rssFeedUrl: string, episodeGuid: string): Promise<any | null> {
  try {
    // Fetch the RSS feed data
    const episodes = await fetchRSSFeed(rssFeedUrl);
    console.log('Yes');

    // Find the episode with the matching GUID
    const matchingEpisode = episodes.find((episode: any) => episode.guid['#text'] === episodeGuid);

    // If no matching episode is found, return null
    if (!matchingEpisode) {
      throw new Error(`Episode with GUID: ${episodeGuid} not found`);
    }

    // Return the found episode
    return matchingEpisode;

  } catch (error) {
    console.error('Error fetching episode by GUID:', error);
    return null;
  }
}

export async function fetchData(url: string): Promise<any> {
  try {
    // Setting up a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, { signal: controller.signal });

    // Clear the timeout once the request completes successfully
    clearTimeout(timeoutId);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Ensure the expected data structure is present
    if (!data || !Array.isArray(data.results)) {
      throw new Error('Invalid data structure: results not found');
    }

    return data.results;
  } catch (error: any) {
    // Handle specific fetch errors or default to a generic error
    if (error.name === 'AbortError') {
      console.error('Request timed out');
    } else {
      console.error('Error fetching data:', error.message || error);
    }

    // Return an empty array or handle the failure gracefully
    return [];
  }
}


export async function fetchRSSFeed(url: string): Promise<any[]> {
  try {
    // Call the API route in the App Router
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch RSS feed');
    }

    const textData = await response.text();

    // Parse the XML using fast-xml-parser
    const parser = new FastXMLParser.XMLParser({
      ignoreAttributes: false,  // Ensure attributes (like image href) are parsed
      attributeNamePrefix: '',  // Remove the default @ prefix for attributes
    });

    const parsedData = parser.parse(textData);

    // Navigate to the correct part of the RSS data
    const items = parsedData.rss?.channel?.item || [];

    // Convert XML data to JS objects
    const parsedItems = items.map((item: any) => {
      const image = item['itunes:image'] || item.image;

      return {
        title: item.title || '',
        link: item.link || '',
        description: item.description?.trim() || '',
        pubDate: item.pubDate || '',
        guid: item.guid || '',
        image: image?.href || '',
        enclosureUrl: item.enclosure?.url || '',
        enclosureLength: item.enclosure?.length || '',
        enclosureType: item.enclosure?.type || '',
        duration: item['itunes:duration'] || '',
        explicit: item['itunes:explicit'] === 'true',
        subtitle: item['itunes:subtitle'] || '',
        episodeType: item['itunes:episodeType'] || ''
      };
    });

    return parsedItems;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return [];
  }
}



export function convertEditModeTimeToSeconds(time: {
    hours: number;
    minutes: number;
    seconds: number;
  }) {
    return time.hours * 60 * 60 + time.minutes * 60 + time.seconds;
  }

export function checkOverlapWithExisitingTimestamp(startTime: number, endTime: number, id: string, existingTimestamps: Timestamp[]) {
  let overlapDetails = {
    isOverlap: false,
    startTimeOverlap: false,
    endTimeOverlap: false,
    closestStartTime: -1,
    closestEndTime: -1,
    overlapId: "",
  };

  for (let timestamp of existingTimestamps) {
    //console.log(timestamp);
    //console.log(id);

    // Check if there is an overlap
    if (
      (timestamp.start <= startTime && startTime <= timestamp.end) ||
      (timestamp.start <= endTime && endTime <= timestamp.end) ||
      (startTime <= timestamp.start && timestamp.end <= endTime)
    ) {
      // Checks that it is not self-overlapping
      // Self overlapping leads to isOverlap = false;
      if (id !== timestamp.id) {
        overlapDetails.isOverlap = true;
        overlapDetails.overlapId = timestamp.id;



        // Check if start time is overlapping
        if (startTime >= timestamp.start && startTime <= timestamp.end) {
          overlapDetails.startTimeOverlap = true;
          overlapDetails.closestStartTime = timestamp.start;
        }

        // Check if end time is overlapping
        if (endTime >= timestamp.start && endTime <= timestamp.end) {
          overlapDetails.endTimeOverlap = true;
          overlapDetails.closestEndTime = timestamp.end;
        }

        break; // Stop checking further if overlap is found
      }
    }
  }

  return overlapDetails;
}

export function checkOverlapWithNewTimestamp(startTime: number, endTime: number, existingTimestamps: Timestamp[]) {
  let overlapDetails = {
    isOverlap: false,
    startTimeOverlap: false,
    endTimeOverlap: false,
    closestStartTime: -1,
    closestEndTime: -1,
  };

  for (let timestamp of existingTimestamps) {
    //console.log(timestamp);
    //console.log(id);

    // Check if there is an overlap
    if (
      (timestamp.start <= startTime && startTime <= timestamp.end) ||
      (timestamp.start <= endTime && endTime <= timestamp.end) ||
      (startTime <= timestamp.start && timestamp.end <= endTime)
    ) {
      overlapDetails.isOverlap = true;

      // Check if start time is overlapping
      if (startTime >= timestamp.start && startTime <= timestamp.end) {
        overlapDetails.startTimeOverlap = true;
        overlapDetails.closestStartTime = timestamp.start;
      }

      // Check if end time is overlapping
      if (endTime >= timestamp.start && endTime <= timestamp.end) {
        overlapDetails.endTimeOverlap = true;
        overlapDetails.closestEndTime = timestamp.end;
      }

      break; // Stop checking further if overlap is found
    }
  }

  return overlapDetails;
}

export function removeObjectFromArrayByKey(array: any[], key: string, value: string) {
  const itemIndex = array.findIndex(item => item[key] === value);
  if (itemIndex > -1) {
    array.splice(itemIndex, 1);
  }
  return array;
}


export async function setGlobalStateFromFirebase(podcastId: string, episodeId: string) {
  const setPodcast = useStore.getState().setPodcast;
  const setEpisode = useStore.getState().setCurrentEpisode;
  const setPodcasts = useStore.getState().setPodcasts;
  //const setPodcast = useStore((state) => state.setPodcast);
  //const setEpisode = useStore((state) => state.setCurrentEpisode);
  const setCurrentEdit = useStore.getState().setCurrentEdit;

  try {
    if (podcastId !== "") {
      const podcastDocument = await fetchPodcast(podcastId);
      if (podcastDocument) {
        setPodcast(podcastDocument)
      };
    }
    if (podcastId !== "" && episodeId !== "") {
      const episodeDocument = await fetchEpisode(podcastId, episodeId);
      if (episodeDocument) {
        setEpisode(episodeDocument);
      }

    }
    const podcastsDocument = await fetchAllPodcasts();

    // const episodeDocument = await readDocument(episodeId);
    //
    if (podcastsDocument) {
          setPodcasts(podcastsDocument);
        }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


export async function fetchAndSetPodcasts() {
  const setPodcasts = useStore.getState().setPodcasts;

  try {
    const podcastsDocument = await fetchAllPodcasts();
    setPodcasts(podcastsDocument);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export function addImageToCurrentEdit(uploadedImage: UploadedImage) {
  // Get the current edit state and the setter function
  const currentEdit = useStore.getState().currentEdit;
  const setCurrentEdit = useStore.getState().setCurrentEdit;

  console.log("Adding image to current edit: ", uploadedImage);

  // Create a new TimestampImage object
  const newTimestampImage: TimestampImage = {
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    image: uploadedImage.url,
    id: uploadedImage.id
  };

  // Initialize the images array
  let images: TimestampImage[] = [];

  // If currentEdit exists, spread the current images into the new array
  if (currentEdit && currentEdit.images) {
    images = [...currentEdit.images];
  }

  // Add the new image to the images array
  images.push(newTimestampImage);

  // Update the current edit state with the new images array
  setCurrentEdit({ ...currentEdit, images } as EditModeData);
}

export function removeImageFromCurrentEdit(uploadedImageId: string) {
  // Get the current edit state and the setter function
  const currentEdit = useStore.getState().currentEdit;
  const setCurrentEdit = useStore.getState().setCurrentEdit;

  console.log("Removing image with ID from current edit: ", uploadedImageId);

  // If currentEdit exists and has images
  if (currentEdit && currentEdit.images) {
    // Filter out the image with the matching uploadedImageId
    const updatedImages = currentEdit.images.filter(image => image.id !== uploadedImageId);

    // Update the current edit state with the updated images array
    setCurrentEdit({ ...currentEdit, images: updatedImages });
  } else {
    console.error("No current edit or images to remove from");
  }
}

/*
export function updateCurrentEdit(field: keyof EditModeData, value: any) {
  const currentEdit = useStore.getState().currentEdit;
  const setCurrentEdit = useStore.getState().setCurrentEdit;

  if (!currentEdit) {
    console.error('Current edit is undefined or null');
    return;
  }

  if (field === 'timeDetails') {
    setCurrentEdit({ ...currentEdit, timeDetails: { ...(currentEdit.timeDetails || {}), ...value } });
  } else {
    setCurrentEdit({ ...currentEdit, [field]: value } as EditModeData);
  }
  }*/

  export function updateCurrentEdit(field: keyof EditModeData, value: any) {
    const currentEdit = useStore.getState().currentEdit;
    const setCurrentEdit = useStore.getState().setCurrentEdit;

    if (!currentEdit) {
      console.error('Current edit is undefined or null');
      return;
    }

    let updatedEdit: EditModeData;

    if (field === 'timeDetails') {
      updatedEdit = {
        ...currentEdit,
        timeDetails: {
          ...(currentEdit.timeDetails || {}),
          ...value
        }
      };
    } else {
      updatedEdit = {
        ...currentEdit,
        [field]: value
      } as EditModeData;
    }

    setCurrentEdit(updatedEdit);
  }
