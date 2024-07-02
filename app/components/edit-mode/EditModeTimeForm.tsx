import React from 'react';
import { TimestampImage, EpisodeData, EditModeTime, EditModeData } from '@/app/helpers/customTypes';
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

  const handleInputChange = (
      timeType: 'startTime' | 'endTime',
      field: 'hours' | 'minutes' | 'seconds',
      value: string
    ) => {
      setUserIsEditing(true);
      // Allow empty input for user convenience, and handle it appropriately
      if (value === "") {
        setEditModeTime(prevState => ({
          ...prevState,
          [timeType]: {
            ...prevState[timeType],
            [field]: value
          }
        }));
        return;
      }
      const intValue = parseInt(value, 10);
      console.log(intValue);

      if (!isNaN(intValue)) {
        setEditModeTime(prevState => ({
          ...prevState,
          [timeType]: {
            ...prevState[timeType],
            [field]: intValue
          }
        }));
      }
    };

  const handleInputBlur = (
    timeType: 'startTime' | 'endTime',
    field: 'hours' | 'minutes' | 'seconds'
  ) => {
    setEditModeTime(prevState => ({
      ...prevState,
      [timeType]: {
        ...prevState[timeType],
        [field]: prevState[timeType][field] === '' ? 0 : prevState[timeType][field]
      }
    }));
  };

  const hoursValue = timeType === 'startTime' ? editModeTime.startTime.hours : editModeTime.endTime.hours;
  const minutesValue = timeType === 'startTime' ? editModeTime.startTime.minutes : editModeTime.endTime.minutes;
  const secondsValue = timeType === 'startTime' ? editModeTime.startTime.seconds : editModeTime.endTime.seconds;

  return (
    <div className={styles.container}>
        <p>{timeType == 'startTime'?  "Start time" : "End time" }:</p>
        <label>
          Hours:
          <input
            disabled={timeType == 'endTime' && !currentEditModeData.startTimeSaved}
            className={styles.timeInput}
            type="number"
            value={hoursValue}
            onChange={(e) => handleInputChange(timeType, 'hours', e.target.value)}
            onBlur={() => handleInputBlur(timeType, 'hours')}
            min={0}
            max={99}
          />
        </label>
        <label>
          Minutes:
          <input
            disabled={timeType == 'endTime' && !currentEditModeData.startTimeSaved}
            className={styles.timeInput}
            type="number"
            value={minutesValue}
            onChange={(e) => handleInputChange(timeType, 'minutes', e.target.value)}
            onBlur={() => handleInputBlur(timeType, 'minutes')}
            min={0}
            max={59}
          />
        </label>
        <label>
          Seconds:
          <input
            disabled={timeType == 'endTime' && !currentEditModeData.startTimeSaved}
            className={styles.timeInput}
            type="number"
            value={secondsValue}
            onChange={(e) => handleInputChange(timeType, 'seconds', e.target.value)}
            onBlur={() => handleInputBlur(timeType, 'seconds')}
            min={0}
            max={59}
          />
        </label>
    </div>
  );
}

export default EditModeTimeForm;
