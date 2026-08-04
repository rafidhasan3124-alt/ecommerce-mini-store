'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  orders: { id: string }[];
}

const ROLE_STYLES: Record<string, string> = {
  ADMIN: 'bg-amber-100 text-amber-700',
  USER: 'bg-blue-100 text-blue-700',
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        toast.success('User role updated');
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      } else {
        toast.error('Failed to update role');
      }
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user and all their data? This cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('User deleted');
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete user');
      }
    } catch {
      toast.error('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
        <div className="bg-white rounded-xl h-64"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {users.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-lg font-medium">No users yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['User', 'Email', 'Phone', 'Orders', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 truncate max-w-[160px]">{user.email}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{user.phone || '—'}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 font-medium">{user.orders?.length ?? 0}</td>
                    <td className="py-4 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        disabled={updatingId === user.id}
                        className={`text-xs font-semibold border-0 rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 ${ROLE_STYLES[user.role] || 'bg-gray-100 text-gray-600'}`}
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
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