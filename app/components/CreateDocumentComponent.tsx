import React, { useState } from 'react';
import { createDocument } from '../firebase/firestoreOperations';

interface Image {
  id: string;
  image: string;
  description: string;
}

interface DocumentData {
  id: string;
  start: number;
  end: number;
  images: Image[];
}

const CreateDocumentComponent: React.FC = () => {
  const [formData, setFormData] = useState<DocumentData>({
    id: '',
    start: 0,
    end: 0,
    images: [{ id: '', image: '', description: '' }],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'start' || name === 'end' ? Number(value) : value,
    }));
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const images = [...formData.images];
    images[index] = { ...images[index], [name]: value };
    setFormData(prevData => ({
      ...prevData,
      images,
    }));
  };

  const addImageField = () => {
    setFormData(prevData => ({
      ...prevData,
      images: [...prevData.images, { id: '', image: '', description: '' }],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDocument(formData);
      setSuccess(true);
    } catch (error) {
      console.error("Error creating document:", error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "3rem 0" }}>
      <h1>Create Document</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            ID:
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Start:
            <input
              type="number"
              name="start"
              value={formData.start}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            End:
            <input
              type="number"
              name="end"
              value={formData.end}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        {formData.images.map((image, index) => (
          <div key={index}>
            <h3>Image {index + 1}</h3>
            <label>
              Image ID:
              <input
                type="text"
                name="id"
                value={image.id}
                onChange={(e) => handleImageChange(index, e)}
                required
              />
            </label>
            <label>
              Image:
              <input
                type="text"
                name="image"
                value={image.image}
                onChange={(e) => handleImageChange(index, e)}
                required
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={image.description}
                onChange={(e) => handleImageChange(index, e)}
                required
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addImageField}>
          Add Another Image
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Document'}
        </button>
      </form>
      {success === true && <p>Document created successfully!</p>}
      {success === false && <p>Error creating document.</p>}
    </div >
  );
};

export default CreateDocumentComponent;
