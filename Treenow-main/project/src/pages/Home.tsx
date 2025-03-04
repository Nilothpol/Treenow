import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import ProductCard from '../components/Product';
import { Product } from '../types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product: Product, type: 'wait' | 'packet') => {
    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        productId: product.id,
        type,
        quantity: 1,
      });
      console.log('Added to cart:', product.name);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart.');
    }
  };

  return (
    <div>
      <Hero />

      <div className='max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold text-gray-900 mb-8'>Featured Products</h2>

        {loading && <p className='text-center text-gray-600'>Loading products...</p>}
        {error && <p className='text-center text-red-500'>{error}</p>}

        {!loading && !error && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>

      <section className='bg-emerald-50 py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Expert Plant Diagnosis</h2>
            <p className='text-lg text-gray-600 mb-8'>
              Use our AI-powered tool to identify plant issues and get personalized care
              recommendations.
            </p>
            <img
              src='https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200'
              alt='Plant diagnosis'
              className='rounded-lg shadow-lg mx-auto'
            />
          </div>
        </div>
      </section>
    </div>
  );
}
