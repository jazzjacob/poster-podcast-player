import React, { useState } from 'react';
import { storage, db } from '@/app/firebase/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import useStore from '@/app/helpers/store';
import { UploadedImage } from '@/app/helpers/customTypes';
import { setGlobalStateFromFirebase } from '@/app/helpers/functions';

interface ImageUploadComponentProps {
  podcastId: string;
  episodeId: string;
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({ podcastId, episodeId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const setEpisode = useStore((state) => state.setCurrentEpisode);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    //const storageRef = ref(storage, `podcasts/${podcastId}/episodes/${episodeId}/uploadedImages/${file.name}`);
    const storageRef = ref(storage, `podcasts/the-poster-boys/episode-59/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error('Error uploading file:', error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const imageData: UploadedImage = {
          id: "",
          timestampIds: [],
          name: file.name,
          url: downloadURL,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          // Add the image data to the uploadedImages sub-collection
          const imagesRef = collection(db, 'podcasts', podcastId, 'episodes', episodeId, 'uploadedImages');
          const imageDocRef = await addDoc(imagesRef, imageData);
          imageData.id = imageDocRef.id;

          // Update the current episode in the global state
          await setGlobalStateFromFirebase(podcastId, episodeId);
        } catch (e) {
          console.error('Error adding image document:', e);
        }

        setUploading(false);
        setFile(null);
        setProgress(0);
      }
    );
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" onChange={handleFileChange} />
      {file && (
        <div>
          <p>File: {file.name}</p>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? `Uploading (${progress.toFixed(0)}%)` : 'Upload'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadComponent;
