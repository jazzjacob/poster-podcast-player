import { v4 as uuidv4 } from 'uuid';
import { Timestamp, OverlapDetails } from './customTypes';
import { fetchAllPodcasts, fetchEpisode, fetchPodcast } from '../firebase/firestoreOperations';
import useStore from './store';

export const generateId = (): string => {
  return uuidv4();
};


export function convertEditModeTimeToSeconds(time: {
    hours: number;
    minutes: number;
    seconds: number;
  }) {
    return time.hours * 60 * 60 + time.minutes * 60 + time.seconds;
  }

export function checkOverlap(startTime: number, endTime: number, id: string, existingTimestamps: Timestamp[]) {
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
