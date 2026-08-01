'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { mockProducts } from '@/data/products';
import toast from 'react-hot-toast';

export default function TestStripePage() {
  const { addItem } = useCartStore();
  const [loading, setLoading] = useState(false);

  const addTestItems = () => {
    mockProducts.forEach(product => {
      addItem(product, 1);
    });
    toast.success('Added test products to cart');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">🧪 Stripe Test Mode</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-yellow-800 mb-2">Test Card Numbers</h2>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>✅ Success: <code className="bg-yellow-100 px-2 py-1 rounded">4242 4242 4242 4242</code></li>
          <li>❌ Decline: <code className="bg-yellow-100 px-2 py-1 rounded">4000 0000 0000 0002</code></li>
          <li>⚠️ Insufficient Funds: <code className="bg-yellow-100 px-2 py-1 rounded">4000 0000 0000 9995</code></li>
        </ul>
      </div>

      <div className="flex gap-4">
        <Button onClick={addTestItems} disabled={loading}>
          Add Test Products to Cart
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/cart'}
        >
          Go to Cart
        </Button>
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Quick Checkout Test</h3>
        <p className="text-sm text-gray-600 mb-4">
          Click the button below to test the Stripe checkout flow with test products.
        </p>
        <Button 
          onClick={() => {
            addTestItems();
            setTimeout(() => {
              window.location.href = '/cart';
            }, 500);
          }}
          size="lg"
        >
          Quick Test Flow
        </Button>
      </div>
    </div>
  );
}