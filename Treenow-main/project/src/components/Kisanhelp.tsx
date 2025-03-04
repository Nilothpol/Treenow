import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Disease {
  _id: string;
  name: string;
  image: string;
  symptoms: string[];
  solutions: string[];
  products: { _id: string; name: string; image: string; description: string }[];
}

export default function CropDiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/diseases');
        setDiseases(response.data);
      } catch (error) {
        console.error('Error fetching diseases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiseases();
  }, []);

  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(response.data.imageUrl);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (loading) return <p className='text-center text-gray-600'>Loading diseases...</p>;

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <h2 className='text-3xl font-bold text-center text-red-700'>🦠 Crop Diseases</h2>

      <div className='flex justify-center my-4'>
        <label className='flex items-center gap-2 cursor-pointer bg-gray-200 p-2 rounded-lg'>
          <Camera />
          <span>Upload Image</span>
          <input type='file' accept='image/*' className='hidden' onChange={handleImageUpload} />
        </label>
      </div>
      {image && <img src={image} alt='Uploaded' className='w-full max-h-64 object-cover rounded' />}

      {selectedDisease ? (
        <div className='mt-6 bg-white shadow-lg rounded-lg p-6'>
          <button
            onClick={() => setSelectedDisease(null)}
            className='mb-4 bg-red-500 text-white px-4 py-2 rounded'
          >
            🔙 Back
          </button>
          <img
            src={selectedDisease.image}
            alt={selectedDisease.name}
            className='w-full h-60 object-cover rounded'
          />
          <h3 className='text-2xl font-semibold mt-3 text-red-700'>{selectedDisease.name}</h3>
          <h4 className='text-lg font-semibold mt-4 text-gray-700'>Symptoms:</h4>
          <ul className='list-disc pl-6 text-gray-600'>
            {selectedDisease.symptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>

          <h4 className='text-lg font-semibold mt-4 text-green-700'>Recommended Products:</h4>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-3'>
            {selectedDisease.products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`, { state: { product } })}
                className='cursor-pointer bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105'
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className='w-full h-32 object-cover rounded'
                />
                <p className='text-center font-semibold mt-2'>{product.name}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
          {diseases.map((disease) => (
            <div
              key={disease._id}
              onClick={() => setSelectedDisease(disease)}
              className='cursor-pointer bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-transform transform hover:scale-105'
            >
              <img
                src={disease.image}
                alt={disease.name}
                className='w-full h-40 object-cover rounded'
              />
              <h3 className='text-xl font-semibold mt-3 text-red-700'>{disease.name}</h3>
              <p className='text-gray-500 text-sm'>Click to view details</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
