'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addItem, totalItems, subtotal } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');

        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          E-Commerce Mini-Store
        </h1>

        <p className="text-gray-500">Loading products...</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        E-Commerce Mini-Store
      </h1>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p>🛒 Cart: {totalItems} items</p>
        <p>Total: {formatPrice(subtotal)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <Image
              src={product.imageUrl || 'https://via.placeholder.com/500'}
              alt={product.title}
              width={500}
              height={500}
              className="w-full h-48 object-cover rounded"
            />

            <h2 className="text-lg font-semibold mt-3">
              {product.title}
            </h2>

            <p className="text-gray-600 mt-1">
              {formatPrice(product.price)}
            </p>

            <button
              onClick={() => addItem(product)}
              disabled={!product.inStock}
              className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}