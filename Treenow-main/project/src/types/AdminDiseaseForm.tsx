import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const AdminDiseaseForm = () => {
  const [name, setName] = useState('');
  const [treeId, setTreeId] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [trees, setTrees] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imageLinks, setImageLinks] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [treesRes, productsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/trees', config),
          axios.get('http://localhost:5000/api/products', config),
        ]);

        setTrees(treesRes.data);
        setProducts(productsRes.data);
        setCategories([...new Set(productsRes.data.map((p) => p.category))]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to load trees or products.');
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(
    () => (categoryId ? products.filter((p) => p.category === categoryId) : []),
    [categoryId, products],
  );

  const handleImageChange = (index, value) => {
    setImageLinks((prev) => prev.map((img, i) => (i === index ? value : img)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:5000/api/diseases',
        {
          name,
          tree: treeId,
          symptoms,
          solutions,
          products: productIds,
          images: imageLinks.filter((link) => link.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMessage('✅ Disease added successfully!');
      setName('');
      setTreeId('');
      setSymptoms([]);
      setSolutions([]);
      setProductIds([]);
      setCategoryId('');
      setImageLinks(['']);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.response?.data?.message || 'Failed to add disease.');
    }
    setLoading(false);
  };

  return (
    <div className='max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6'>
      <h2 className='text-2xl font-semibold text-center mb-4'>Add New Disease</h2>
      {message && (
        <p
          className={`text-center ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder='Disease Name'
          className='w-full p-2 border rounded'
        />
        <select
          value={treeId}
          onChange={(e) => setTreeId(e.target.value)}
          required
          className='w-full p-2 border rounded'
        >
          <option value=''>-- Select Tree --</option>
          {trees.map((tree) => (
            <option key={tree._id} value={tree._id}>
              {tree.name}
            </option>
          ))}
        </select>
        <input
          type='text'
          value={symptoms.join(', ')}
          onChange={(e) => setSymptoms(e.target.value.split(',').map((s) => s.trim()))}
          required
          placeholder='Symptoms'
          className='w-full p-2 border rounded'
        />
        <input
          type='text'
          value={solutions.join(', ')}
          onChange={(e) => setSolutions(e.target.value.split(',').map((s) => s.trim()))}
          required
          placeholder='Solutions'
          className='w-full p-2 border rounded'
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className='w-full p-2 border rounded'
        >
          <option value=''>-- Select Category --</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          multiple
          value={productIds}
          onChange={(e) =>
            setProductIds([...e.target.selectedOptions].map((option) => option.value))
          }
          className='w-full p-2 border rounded'
        >
          {filteredProducts.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
        {imageLinks.map((link, index) => (
          <div key={index} className='flex items-center space-x-2'>
            <input
              type='text'
              value={link}
              onChange={(e) => handleImageChange(index, e.target.value)}
              className='w-full p-2 border rounded'
            />
            {index > 0 && (
              <button
                type='button'
                onClick={() => setImageLinks((prev) => prev.filter((_, i) => i !== index))}
                className='p-2 bg-red-500 text-white rounded'
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <button
          type='button'
          onClick={() => setImageLinks([...imageLinks, ''])}
          className='mt-2 p-2 bg-blue-500 text-white rounded'
        >
          ➕ Add More Images
        </button>
        <button
          type='submit'
          className={`w-full p-2 rounded ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Disease'}
        </button>
      </form>
    </div>
  );
};

export default AdminDiseaseForm;
