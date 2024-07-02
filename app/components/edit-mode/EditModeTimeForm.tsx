import React from 'react';
import { TimestampImage, EpisodeData, EditModeTime, EditModeData } from '@/app/helpers/customTypes';
import styles from "./EditModeTimeForm.module.css";

type FormType = 'startTime' | 'endTime';

interface EditModeTimeFormProps {
  editModeTime: EditModeTime,
  setEditModeTime: React.Dispatch<React.SetStateAction<EditModeTime>>,
  currentTime: number,
  setUserIsEditing: (userIsEditing: boolean) => void,
  formType: FormType,
  currentEditModeData: EditModeData
}

const EditModeTimeForm: React.FC<EditModeTimeFormProps> = ({ formType, editModeTime, setEditModeTime, currentTime, setUserIsEditing, currentEditModeData }) => {

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

  const hoursValue = formType === 'startTime' ? editModeTime.startTime.hours : editModeTime.endTime.hours;
  const minutesValue = formType === 'startTime' ? editModeTime.startTime.minutes : editModeTime.endTime.minutes;
  const secondsValue = formType === 'startTime' ? editModeTime.startTime.seconds : editModeTime.endTime.seconds;

  return (
    <div className={styles.container}>
        <p>{formType == 'startTime'?  "Start time" : "End time" }:</p>
        <label>
          Hours:
          <input
            disabled={formType == 'endTime' && !currentEditModeData.startTimeSaved}
            className={styles.timeInput}
            type="number"
            value={hoursValue}
            onChange={(e) => handleInputChange(formType, 'hours', e.target.value)}
            min={0}
            max={99}
          />
        </label>
        <label>
          Minutes:
          <input
            disabled={formType == 'endTime' && !currentEditModeData.startTimeSaved}
            className={styles.timeInput}
            type="number"
            value={minutesValue}
            onChange={(e) => handleInputChange(formType, 'minutes', e.target.value)}
            min={0}
            max={59}
          />
        </label>
        <label>
          Seconds:
          <input
            disabled={formType == 'endTime' && !currentEditModeData.startTimeSaved}
            className={styles.timeInput}
            type="number"
            value={secondsValue}
            onChange={(e) => handleInputChange(formType, 'seconds', e.target.value)}
            min={0}
            max={59}
          />
        </label>
    </div>
  );
}

export default EditModeTimeForm;
