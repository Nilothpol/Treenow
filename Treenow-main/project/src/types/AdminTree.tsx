import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react'; // ✅ Import Delete Icon

const AdminTree = () => {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    image: '',
    description: '',
    watering: '',
    sunlight: '',
    specialCare: '',
    pruning: '',
    fertilization: '',
    price: '',
  });

  useEffect(() => {
    fetchTrees();
  }, []);

  // ✅ Fetch Trees from API
  const fetchTrees = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please login as an admin.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get('http://localhost:5000/api/trees', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTrees(data);
    } catch (error) {
      console.error('Error fetching trees:', error);
      setError('Failed to load trees.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add Tree
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please login as an admin.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/trees', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      setTrees((prev) => [...prev, data]);

      // ✅ Reset form after submission
      setFormData({
        name: '',
        scientificName: '',
        image: '',
        description: '',
        watering: '',
        sunlight: '',
        specialCare: '',
        pruning: '',
        fertilization: '',
        price: '',
      });
    } catch (error) {
      console.error('Error adding tree:', error);
      setError('Failed to add tree.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Tree
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please login as an admin.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/trees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTrees((prev) => prev.filter((tree) => tree._id !== id));
    } catch (error) {
      console.error('Error deleting tree:', error);
      setError('Failed to delete tree.');
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>🌳 Manage Trees</h2>

      {/* ✅ Error Message Display */}
      {error && <p className='text-red-500 mb-4'>{error}</p>}

      {/* ✅ Add Tree Form */}
      <div className='bg-gray-100 p-4 mb-6 rounded'>
        <h3 className='font-semibold mb-2'>Add New Tree</h3>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Name'
            className='border p-2 w-full mb-2'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Scientific Name'
            className='border p-2 w-full mb-2'
            value={formData.scientificName}
            onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Image URL'
            className='border p-2 w-full mb-2'
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
          />
          <a
            href='https://postimages.org/'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-blue-500 text-white px-4 py-2 mb-2 inline-block rounded'
          >
            📷 Upload Image
          </a>
          <textarea
            placeholder='Description'
            className='border p-2 w-full mb-2'
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Watering'
            className='border p-2 w-full mb-2'
            value={formData.watering}
            onChange={(e) => setFormData({ ...formData, watering: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Sunlight'
            className='border p-2 w-full mb-2'
            value={formData.sunlight}
            onChange={(e) => setFormData({ ...formData, sunlight: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Special Care'
            className='border p-2 w-full mb-2'
            value={formData.specialCare}
            onChange={(e) => setFormData({ ...formData, specialCare: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Pruning'
            className='border p-2 w-full mb-2'
            value={formData.pruning}
            onChange={(e) => setFormData({ ...formData, pruning: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Fertilization'
            className='border p-2 w-full mb-2'
            value={formData.fertilization}
            onChange={(e) => setFormData({ ...formData, fertilization: e.target.value })}
            required
          />
          <input
            type='number'
            placeholder='Price'
            className='border p-2 w-full mb-2'
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded' disabled={loading}>
            {loading ? 'Adding...' : 'Add Tree'}
          </button>
        </form>
      </div>

      {/* ✅ Display Trees */}
      <h3 className='text-lg font-semibold'>🌿 Trees</h3>
      {trees.map((tree) => (
        <div key={tree._id} className='p-4 bg-gray-100 rounded-lg mb-4 flex justify-between items-center'>
          <div>
            <p><strong>Name:</strong> {tree.name}</p>
            <p><strong>Scientific Name:</strong> {tree.scientificName}</p>
          </div>
          <button onClick={() => handleDelete(tree._id)} className='text-red-500 hover:text-red-700'>
            <Trash2 className='h-5 w-5' />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminTree;
