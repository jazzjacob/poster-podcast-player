import React, { useState } from 'react';
import { TimestampImage, EpisodeData, EditModeTime, EditModeData, OverlapDetails } from '@/app/helpers/customTypes';
import { convertEditModeTimeToSeconds, updateCurrentEdit } from '@/app/helpers/functions';
import useStore from '@/app/helpers/store';


import styles from "./EditModeTimeForm.module.css";

type TimeType = 'startTime' | 'endTime';

interface EditModeTimeFormProps {
  editModeTime: EditModeTime,
  setEditModeTime: React.Dispatch<React.SetStateAction<EditModeTime>>,
  currentTime: number,
  setUserIsEditing: (userIsEditing: boolean) => void,
  timeType: TimeType,
  currentEditModeData: EditModeData
}

const EditModeTimeForm: React.FC<EditModeTimeFormProps> = ({ timeType, editModeTime, setEditModeTime, currentTime, setUserIsEditing, currentEditModeData }) => {
  const [hours, setHours] = useState(-1);
  const [minutes, setMinutes] = useState(-1);
  const [seconds, setSeconds] = useState(-1);
  const currentEdit = useStore((state) => state.currentEdit);

  const handleInputChange = (
      timeType: 'startTime' | 'endTime',
      field: 'hours' | 'minutes' | 'seconds',
      value: string
    ) => {
      setUserIsEditing(true);
      // Allow empty input for user convenience, and handle it appropriately
      /*
      if (value === "" || value.length <= 2) {
        setEditModeTime(prevState => ({
          ...prevState,
          [timeType]: {
            ...prevState[timeType],
            [field]: value
          }
        }));
        return;
      }*/

      if (value === "") {
        setEditModeTime(prevState => ({
          ...prevState,
          [timeType]: {
            ...prevState[timeType],
            [field]: value
          }
        }));
        // Setting to global state
        if (currentEdit && currentEdit.timeDetails) {
          updateCurrentEdit('timeDetails', {
            [timeType]: {
              ...currentEdit.timeDetails[timeType],
              [field]: value
            }
          });
        }
        return;
      }

      // Truncate to two digits
      const truncatedValue = value.slice(0, 2);
      const intValue = parseInt(truncatedValue, 10);

      console.log("intValue:")
      console.log(intValue);

      if (!isNaN(intValue)) {
        setEditModeTime(prevState => ({
          ...prevState,
          [timeType]: {
            ...prevState[timeType],
            [field]: intValue
          }
        }));
        // Setting to global state
        if (currentEdit && currentEdit.timeDetails) {
          updateCurrentEdit('timeDetails', {
            [timeType]: {
              ...currentEdit.timeDetails[timeType],
              [field]: intValue
            }
          });
        }
      }
    };

  const handleInputBlur = (
    timeType: 'startTime' | 'endTime',
    field: 'hours' | 'minutes' | 'seconds',
    maxValue: number,
  ) => {

    setEditModeTime(prevState => {
      //let value = parseInt(prevState[timeType][field], 10);
      let value = prevState[timeType][field];
      if (isNaN(value)) value = 0;
      if (value > maxValue) value = maxValue;
      return {
        ...prevState,
        [timeType]: {
          ...prevState[timeType],
          [field]: value
        }
      };
    });

    // Setting to global state
    if (currentEdit && currentEdit.timeDetails) {
      let value = currentEdit.timeDetails[timeType][field];
      if (isNaN(value)) value = 0;
      if (value > maxValue) value = maxValue;

      updateCurrentEdit('timeDetails', {
        [timeType]: {
          ...currentEdit.timeDetails[timeType],
          [field]: value
        }
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  };


  const hoursValue = timeType === 'startTime' ? editModeTime.startTime.hours : editModeTime.endTime.hours;
  const minutesValue = timeType === 'startTime' ? editModeTime.startTime.minutes : editModeTime.endTime.minutes;
  const secondsValue = timeType === 'startTime' ? editModeTime.startTime.seconds : editModeTime.endTime.seconds;

  /*
  if (currentEdit && currentEdit.timeDetails) {
    setHours(timeType === 'startTime' ? currentEdit.timeDetails.startTime.hours : currentEdit.timeDetails.endTime.hours);
    setMinutes(timeType === 'startTime' ? currentEdit.timeDetails.startTime.minutes : currentEdit.timeDetails.endTime.minutes);
    setSeconds(timeType === 'startTime' ? currentEdit.timeDetails.startTime.seconds : currentEdit.timeDetails.endTime.seconds)
    }*/


  return (
    <div className={styles.container}>
        <p>{timeType == 'startTime'?  "Start time" : "End time" }:</p>
        <label>
          Hours:
          <input
            className={styles.timeInput}
            type="number"
            value={hoursValue !== undefined ? hoursValue : ''}
            onChange={(e) => handleInputChange(timeType, 'hours', e.target.value)}
            onBlur={() => handleInputBlur(timeType, 'hours', 99)}
            onKeyDown={handleKeyDown}
            min={0}
            max={99}
          />
        </label>
        <label>
          Minutes:
          <input
            className={styles.timeInput}
            type="number"
            value={minutesValue !== undefined ? minutesValue : ''}
            onChange={(e) => handleInputChange(timeType, 'minutes', e.target.value)}
            onBlur={() => handleInputBlur(timeType, 'minutes', 59)}
            onKeyDown={handleKeyDown}
            min={0}
            max={59}
          />
        </label>
        <label>
          Seconds:
          <input
            className={styles.timeInput}
            type="number"
            value={secondsValue !== undefined ? secondsValue : ''}
            onChange={(e) => handleInputChange(timeType, 'seconds', e.target.value)}
            onBlur={() => handleInputBlur(timeType, 'seconds', 59)}
            onKeyDown={handleKeyDown}
            min={0}
            max={59}
          />
        </label>
    </div>
  );
}

export default EditModeTimeForm;
