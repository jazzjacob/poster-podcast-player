import React from 'react';
import { TimestampImage, EpisodeData, EditModeTime } from '@/app/helpers/customTypes';
import styles from "./EditModeTimeForm.module.css";


interface EditModeTimeFormProps {
  editModeTime: EditModeTime,
  setEditModeTime: React.Dispatch<React.SetStateAction<EditModeTime>>,
  currentTime: number,
  setUserIsEditing: (userIsEditing: boolean) => void,
}

const EditModeTimeForm: React.FC<EditModeTimeFormProps> = ({ editModeTime, setEditModeTime, currentTime, setUserIsEditing }) => {

  const handleInputChange = (
      timeType: 'startTime' | 'endTime',
      field: 'hours' | 'minutes' | 'seconds',
      value: string
    ) => {
      setUserIsEditing(true);
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

  return (
    <div>
      <label>
        Hours:
        <input
          className={styles.timeInput}
          type="number"
          value={editModeTime.startTime.hours}
          onChange={(e) => handleInputChange('startTime', 'hours', e.target.value)}
          min={0}
          max={99}
        />
      </label>
      <label>
        Minutes:
        <input
          className={styles.timeInput}
          type="number"
          value={editModeTime.startTime.minutes}
          onChange={(e) => handleInputChange('startTime', 'minutes', e.target.value)}
          min={0}
          max={59}
        />
      </label>
      <label>
        Seconds:
        <input
          className={styles.timeInput}
          type="number"
          value={editModeTime.startTime.seconds}
          onChange={(e) => handleInputChange('startTime', 'seconds', e.target.value)}
          min={0}
          max={59}
        />
      </label>
    </div>
  );
}

export default EditModeTimeForm;
