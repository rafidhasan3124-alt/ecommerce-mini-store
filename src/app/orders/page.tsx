'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { ClipboardDocumentListIcon, ShoppingBagIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    title: string;
    imageUrl: string | null;
  } | null;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  email: string;
  items: OrderItem[];
}

const STATUS_STYLES: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-purple-100 text-purple-700',
  CANCELLED: 'bg-red-100 text-red-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders/all');
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
          <ClipboardDocumentListIcon className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h1>
          <p className="text-gray-500 mb-8">You haven&apos;t placed any orders yet. Start shopping!</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/shop" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
          Continue Shopping <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Order ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-800">#{order.id.slice(-12).toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </span>
                <span className="text-xl font-bold text-blue-600">{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-gray-500">
                <span>
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-gray-400">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  {order.items.length > 0 && (
                    <span className="text-gray-400"> · {order.items.map(i => i.product?.title || 'Product').slice(0, 2).join(', ')}{order.items.length > 2 ? ` +${order.items.length - 2} more` : ''}</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}