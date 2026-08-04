'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import {
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface NavUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const { totalItems } = useCartStore();
  const router = useRouter();
  const [user, setUser] = useState<NavUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch {
        // User not logged in — silently ignore
      }
    };
    fetchUser();
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setDropdownOpen(false);
      toast.success('Signed out successfully');
      router.refresh();
      router.push('/');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
      {/* 🚀 Top Announcement Marquee Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white overflow-hidden animate-gradient-x">
        <div className="flex whitespace-nowrap py-1.5 text-xs font-semibold tracking-wide">
          <div className="animate-marquee flex gap-12 pl-12">
            <span>🔥 FLASH SALE: Use code <span className="text-yellow-300">SUMMER20</span> for 20% off all Electronics!</span>
            <span>✨ FREE SHIPPING on all orders over $50</span>
            <span>⭐ Premium Quality Products Guaranteed</span>
            <span>🔥 FLASH SALE: Use code <span className="text-yellow-300">SUMMER20</span> for 20% off all Electronics!</span>
            <span>✨ FREE SHIPPING on all orders over $50</span>
            <span>⭐ Premium Quality Products Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 flex-shrink-0 group">
              <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-500">Shop</span>
              <span className="text-xl md:text-2xl font-light text-gray-700">Store</span>
            </Link>

            {/* Center Nav Links & Search (Desktop) */}
            <div className="hidden lg:flex flex-1 items-center justify-center gap-8 px-8">
              <div className="flex items-center gap-6">
                <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
                <Link href="/shop" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition">Shop All</Link>
                <Link href="/shop" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition">Deals <span className="ml-1 inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 animate-pulse">HOT</span></Link>
                <Link href="/shop" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition">Categories</Link>
              </div>

              {/* Desktop Search Bar */}
              <div className="relative w-full max-w-sm group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Right Side (Desktop only, mobile handled by BottomNav) */}
            <div className="hidden md:flex items-center gap-3">
              {/* Cart */}
              <Link href="/cart" className="relative p-2 rounded-full hover:bg-blue-50 transition group">
                <ShoppingCartIcon className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition animate-float" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 border-2 border-white animate-pulse-glow">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition border border-transparent hover:border-gray-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block max-w-[120px] truncate text-sm font-medium text-gray-700">{user.name}</span>
                    <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100/50">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {user.role === 'ADMIN' && (
                          <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            <ShieldCheckIcon className="h-3 w-3" /> ADMIN
                          </span>
                        )}
                      </div>

                      {/* Links */}
                      <div className="py-2 px-2">
                        {user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition"
                          >
                            <ShieldCheckIcon className="h-5 w-5 text-amber-500" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition"
                        >
                          <UserCircleIcon className="h-5 w-5 text-blue-500" />
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition"
                        >
                          <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500" />
                          Order History
                        </Link>
                        <Link
                          href="/profile/addresses"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition"
                        >
                          <Cog6ToothIcon className="h-5 w-5 text-blue-500" />
                          Saved Addresses
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100/50 py-2 px-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="hidden sm:block text-sm text-gray-600 hover:text-blue-600 font-medium transition px-3 py-2 rounded-xl hover:bg-gray-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
      </nav>
    </>
  );
}