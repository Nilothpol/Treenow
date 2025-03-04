import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessages, setActionMessages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/admin/orders');
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusOptions = ['Slipped', 'On Going', 'Cancel', 'Ready', 'Arriving Today', 'Completed'];

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}`, { status: newStatus });
      setOrders(
        orders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)),
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleActionMessageChange = (orderId: string, message: string) => {
    setActionMessages({ ...actionMessages, [orderId]: message });
  };

  const handleActionMessageSubmit = async (orderId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}`, {
        actionMessage: actionMessages[orderId] || '',
      });
      alert('Action message updated successfully!');
    } catch (error) {
      console.error('Error updating action message:', error);
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/orders/${orderId}`);
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-4'>Admin Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className='w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border p-2'>Order ID</th>
              <th className='border p-2'>Customer</th>
              <th className='border p-2'>Total Amount</th>
              <th className='border p-2'>Status</th>
              <th className='border p-2'>Action Message</th>
              <th className='border p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className='text-center'>
                <td className='border p-2'>{order._id}</td>
                <td className='border p-2'>{order.user?.name || 'Guest'}</td>
                <td className='border p-2'>₹{order.totalAmount.toFixed(2)}</td>
                <td className='border p-2'>
                  <select
                    className='border p-2 rounded'
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className='border p-2'>
                  <input
                    type='text'
                    className='border p-2 rounded w-full'
                    value={actionMessages[order._id] || ''}
                    onChange={(e) => handleActionMessageChange(order._id, e.target.value)}
                    placeholder='Enter action message'
                  />
                  <button
                    onClick={() => handleActionMessageSubmit(order._id)}
                    className='bg-blue-500 text-white px-2 py-1 mt-2 rounded w-full'
                  >
                    Update Message
                  </button>
                </td>
                <td className='border p-2 space-x-2'>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className='bg-red-500 text-white px-2 py-1 rounded'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
