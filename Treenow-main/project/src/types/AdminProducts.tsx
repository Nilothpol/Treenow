import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminProductsOrders = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: '',
    description: '',
    price: '',
    use: '',
  });
  const [view, setView] = useState<'products' | 'orders'>('products');

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Fetch Products & Orders
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const productsRes = await axios.get('http://localhost:5000/api/products', { headers });
      const ordersRes = await axios.get('http://localhost:5000/api/orders', { headers });

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // ✅ Add New Product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized: Please login as an admin.');
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/products', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      setProducts([...products, data]); // Update UI
      setFormData({ name: '', category: '', image: '', use: '', description: '', price: '' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // ✅ Delete Product
  const handleDeleteProduct = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>🛍️ Admin - Products & Orders</h2>

      {/* ✅ Toggle Buttons */}
      <div className='mb-6 flex space-x-4'>
        <button
          className={`px-4 py-2 rounded ${
            view === 'products' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setView('products')}
        >
          🛍️ Products
        </button>
        <button
          className={`px-4 py-2 rounded ${
            view === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setView('orders')}
        >
          📦 Orders
        </button>
      </div>

      {/* ✅ Show Products Section */}
      {view === 'products' && (
        <>
          <div className='bg-gray-100 p-4 mb-6 rounded'>
            <h3 className='font-semibold mb-2'>Add New Product</h3>
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
                placeholder='Category'
                className='border p-2 w-full mb-2'
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
              <input
                type='text'
                placeholder='use'
                className='border p-2 w-full mb-2'
                value={formData.use}
                onChange={(e) => setFormData({ ...formData, use: e.target.value })}
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
              <textarea
                placeholder='Description'
                className='border p-2 w-full mb-2'
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded'>
                Add Product
              </button>
            </form>
          </div>

          {/* ✅ Product List */}
          {products.map((product) => (
            <div key={product._id} className='p-4 bg-gray-100 rounded-lg mb-4'>
              <p>
                <strong>Name:</strong> {product.name}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className='bg-red-500 text-white px-3 py-1 rounded mt-2'
              >
                Delete
              </button>
            </div>
          ))}
        </>
      )}

      {/* ✅ Show Orders Section */}
      {view === 'orders' && (
        <>
          {orders.map((order) => (
            <div key={order._id} className='p-4 bg-gray-100 rounded-lg mb-4'>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Total Amount:</strong> ${order.totalAmount}
              </p>
              <p>
                <strong>Items:</strong>
              </p>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - {item.quantity} pcs
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AdminProductsOrders;
