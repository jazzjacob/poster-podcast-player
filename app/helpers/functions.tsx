import { v4 as uuidv4 } from 'uuid';
import { Timestamp, OverlapDetails } from './customTypes';

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
    console.log(timestamp);
    console.log(id);

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
