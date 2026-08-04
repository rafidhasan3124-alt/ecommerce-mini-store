'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ShoppingBagIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/format';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    title: string;
    imageUrl: string | null;
  };
}

interface OrderDetails {
  id: string;
  total: number;
  email: string;
  status: string;
  createdAt: string;
  items?: OrderItem[];
}

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCartStore();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
    toast.success('🎉 Order placed successfully!');

    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setFetchError('No session ID found');
        setLoading(false);
        setTimeout(() => router.push('/'), 5000);
        return;
      }

      try {
        const response = await fetch(`/api/orders?sessionId=${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrderDetails(data.order);
      } catch (err) {
        console.error('Error fetching order:', err);
        setFetchError('Could not load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [clearCart, sessionId, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto"></div>
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (fetchError || !orderDetails) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">😅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-8">
          {fetchError || 'We could not find your order details. Please check your orders page.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
          <Link href="/orders">
            <Button>View Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircleIcon className="h-20 w-20 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4 text-lg">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono font-medium text-xs">{orderDetails.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{orderDetails.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-blue-600 text-base">{formatPrice(orderDetails.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {orderDetails.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">
                {new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button size="lg" className="w-full sm:w-auto">
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
              View All Orders
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500 text-center">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto"></div>
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
