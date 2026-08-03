'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { error } from "console";

interface User{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    adresses: any[];
}

export default function ProfilePage(){
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/me');

                if (!response.ok){
                    throw new Error('Not authenticated');
                }

                const data = await response.json();
                setUser(data.user);
            } catch (error){
                router.push('/login');
            } finally {
                setLoading(false)
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout',{ method: 'POST' });
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error){
            toast.error('Logout failed');
        }
    };
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-3xl font-bold text-blue-600">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Role: <span className="font-medium">{user.role}</span>
              </p>
              {user.phone && (
                <p className="text-sm text-gray-600 mt-1">{user.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/orders" className="block">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="font-semibold">My Orders</h3>
                <p className="text-sm text-gray-600">View your order history</p>
              </div>
            </Link>

            <Link href="/profile/addresses" className="block">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="text-3xl mb-2">📍</div>
                <h3 className="font-semibold">Addresses</h3>
                <p className="text-sm text-gray-600">Manage your shipping addresses</p>
              </div>
            </Link>

            <Link href="/profile/settings" className="block">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="text-3xl mb-2">⚙️</div>
                <h3 className="font-semibold">Settings</h3>
                <p className="text-sm text-gray-600">Update your profile</p>
              </div>
            </Link>

            <Link href="/shop" className="block">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="text-3xl mb-2">🛍️</div>
                <h3 className="font-semibold">Continue Shopping</h3>
                <p className="text-sm text-gray-600">Browse our products</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}