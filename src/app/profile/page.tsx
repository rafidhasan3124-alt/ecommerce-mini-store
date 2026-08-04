'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import {
  UserCircleIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  addresses: {
    id: string;
    street: string;
    city: string;
    isDefault: boolean;
  }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Signed out successfully');
      router.refresh();
      router.push('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-gray-200 rounded-xl"></div>
            <div className="md:col-span-2 h-48 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const quickLinks = [
    {
      href: '/orders',
      icon: ClipboardDocumentListIcon,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      title: 'My Orders',
      desc: 'View your order history',
    },
    {
      href: '/profile/addresses',
      icon: MapPinIcon,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      title: 'Addresses',
      desc: 'Manage shipping addresses',
    },
    {
      href: '/profile/settings',
      icon: Cog6ToothIcon,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      title: 'Account Settings',
      desc: 'Update your name & phone',
    },
    {
      href: '/shop',
      icon: ShoppingBagIcon,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      title: 'Continue Shopping',
      desc: 'Browse our products',
    },
    ...(user.role === 'ADMIN' ? [{
      href: '/admin',
      icon: ShieldCheckIcon,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      title: 'Admin Panel',
      desc: 'Manage store',
    }] : []),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold text-white shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mt-4">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              {user.phone && (
                <p className="text-gray-400 text-sm mt-1">{user.phone}</p>
              )}
              <div className="mt-3">
                {user.role === 'ADMIN' ? (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                    <ShieldCheckIcon className="h-3.5 w-3.5" />
                    Admin
                  </span>
                ) : (
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Customer
                  </span>
                )}
              </div>
            </div>

            {/* Default address preview */}
            {user.addresses && user.addresses.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Default Address</p>
                <p className="text-sm font-medium text-gray-900">{user.addresses[0].street}</p>
                <p className="text-sm text-gray-500">{user.addresses[0].city}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block group">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between">
                    <div className={`${link.bg} p-3 rounded-xl`}>
                      <link.icon className={`h-6 w-6 ${link.color}`} />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition mt-1" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mt-4">{link.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}