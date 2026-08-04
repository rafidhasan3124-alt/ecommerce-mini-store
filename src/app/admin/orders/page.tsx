'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/format';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

interface Order {
  id: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
  user: { name: string };
  items: { id: string; quantity: number; product: { title: string } | null }[];
}

const STATUS_STYLES: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700 border-green-200',
  SHIPPED: 'bg-blue-100 text-blue-700 border-blue-200',
  DELIVERED: 'bg-purple-100 text-purple-700 border-purple-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success('Order status updated');
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      } else {
        toast.error('Failed to update order');
      }
    } catch {
      toast.error('Failed to update order');
    } finally {
      setUpdating(null);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Delete this order? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Order deleted');
        setOrders(prev => prev.filter(o => o.id !== id));
      } else {
        toast.error('Failed to delete order');
      }
    } catch {
      toast.error('Failed to delete order');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="bg-white rounded-xl h-64"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-lg font-medium">No orders yet.</p>
            <p className="text-sm mt-1">Orders will appear here once customers start buying.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs text-gray-500 font-medium">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-semibold text-gray-900">{order.user?.name || 'Guest'}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[160px]">{order.email}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className={`text-xs font-semibold border rounded-lg px-2.5 py-1.5 pr-6 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                          ))}
                        </select>
                        <ChevronUpDownIcon className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}