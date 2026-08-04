'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/format';
import {
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
  GlobeAltIcon,
  Bars3Icon,
  GiftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface NavUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const { totalItems, subtotal } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();
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

  const executeSearch = () => {
    if (searchQuery.trim()) {
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
  // If we are on an admin route, do not render the storefront navbar
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="w-full flex flex-col z-50 relative">
      {/* 1. Top Bar */}
      <div className="bg-[#0b1b36] text-white py-2 text-xs hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-sm">⚡</span>
            <span className="font-bold text-[13px]">Summer Sale is Live!</span>
            <span className="text-gray-300 ml-2 text-[13px]">Up to 40% OFF on selected products.</span>
          </div>
          <div className="flex items-center gap-6 text-gray-300 font-medium">
            <a href="#" className="flex items-center gap-1.5 hover:text-white transition">
              <MapPinIcon className="h-3.5 w-3.5" /> Track Order
            </a>
            <a href="#" className="flex items-center gap-1.5 hover:text-white transition">
              <QuestionMarkCircleIcon className="h-3.5 w-3.5" /> Help Center
            </a>
            <a href="#" className="flex items-center gap-1.5 hover:text-white transition">
              <GlobeAltIcon className="h-3.5 w-3.5" /> English <ChevronDownIcon className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl md:text-3xl font-black text-[#0b1b36] tracking-tight uppercase">ZYVO</span>
          </Link>

          {/* Search Section (Desktop) */}
          <div className="hidden lg:flex flex-1 items-center max-w-3xl">
            <button className="flex items-center gap-2 bg-[#0b1b36] text-white px-4 py-2.5 rounded-l text-sm font-semibold whitespace-nowrap hover:bg-[#1a2f52] transition">
              <Bars3Icon className="h-5 w-5" /> All Categories <ChevronDownIcon className="h-4 w-4 ml-1" />
            </button>
            <div className="relative flex-1 flex">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full px-4 py-2.5 border-y border-gray-200 text-sm focus:outline-none"
              />
              <button 
                onClick={executeSearch}
                className="bg-blue-600 text-white px-5 rounded-r hover:bg-blue-700 transition flex items-center justify-center border-y border-r border-blue-600"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-5 sm:gap-8">
            {/* Login / Register */}
            {user ? (
              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 group"
                >
                  <UserCircleIcon className="h-7 w-7 text-gray-700 group-hover:text-blue-600 transition" />
                  <div className="text-left hidden xl:block">
                    <p className="text-[11px] text-gray-500 leading-tight">Hello, {user.name.split(' ')[0]}</p>
                    <p className="text-[13px] font-bold text-gray-900 leading-tight flex items-center gap-1">My Account <ChevronDownIcon className="h-3 w-3"/></p>
                  </div>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      {user.role === 'ADMIN' && (
                        <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase tracking-wider">
                          <ShieldCheckIcon className="h-3 w-3" /> ADMIN
                        </span>
                      )}
                    </div>
                    <div className="py-2 px-2">
                      {user.role === 'ADMIN' && (
                        <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          <ShieldCheckIcon className="h-4 w-4" /> Admin Dashboard
                        </Link>
                      )}
                      <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                        <UserCircleIcon className="h-4 w-4" /> My Profile
                      </Link>
                      <Link href="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                        <ClipboardDocumentListIcon className="h-4 w-4" /> Order History
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-2 px-2">
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                        <ArrowRightOnRectangleIcon className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 group hidden sm:flex">
                <UserCircleIcon className="h-7 w-7 text-gray-700 group-hover:text-blue-600 transition" />
                <div className="text-left hidden xl:block">
                  <p className="text-[11px] text-gray-500 leading-tight">Welcome</p>
                  <p className="text-[13px] font-bold text-gray-900 leading-tight">Login / Register</p>
                </div>
              </Link>
            )}

            {/* Wishlist */}
            <Link href="/profile" className="flex items-center gap-2 group hidden sm:flex">
              <div className="relative">
                <HeartIcon className="h-7 w-7 text-gray-700 group-hover:text-blue-600 transition" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold rounded-full w-[15px] h-[15px] flex items-center justify-center">0</span>
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-[11px] text-transparent leading-tight select-none">.</p>
                <p className="text-[13px] font-bold text-gray-900 leading-tight">Wishlist</p>
              </div>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="flex items-center gap-2 group">
              <div className="relative">
                <ShoppingCartIcon className="h-7 w-7 text-gray-700 group-hover:text-blue-600 transition" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold rounded-full w-[15px] h-[15px] flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-[11px] text-gray-500 leading-tight">Cart</p>
                <p className="text-[13px] font-bold text-gray-900 leading-tight">{formatPrice(subtotal)}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 pb-4">
          <div className="relative flex">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full px-4 py-2 border border-gray-200 rounded-l text-sm focus:outline-none"
            />
            <button 
              onClick={executeSearch}
              className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 flex items-center justify-center"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Navigation Links Row */}
      <div className="bg-white border-b border-gray-200 hidden lg:block sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-8 h-full">
            <Link href="/" className="text-[14px] font-bold text-blue-600 h-full flex items-center border-b-[3px] border-blue-600">Home</Link>
            <Link href="/shop?category=Electronics" className="text-[14px] font-medium text-gray-700 hover:text-blue-600 h-full flex items-center gap-1 transition">Electronics <ChevronDownIcon className="h-3.5 w-3.5 text-gray-400" /></Link>
            <Link href="/shop" className="text-[14px] font-medium text-gray-700 hover:text-blue-600 h-full flex items-center transition">New Arrivals</Link>
            <Link href="/shop" className="text-[14px] font-medium text-gray-700 hover:text-blue-600 h-full flex items-center transition">Today's Deal</Link>
            <Link href="/shop" className="text-[14px] font-medium text-gray-700 hover:text-blue-600 h-full flex items-center transition">Best Sellers</Link>
            <Link href="/shop" className="text-[14px] font-medium text-gray-700 hover:text-blue-600 h-full flex items-center transition">Brands</Link>
            <Link href="#" className="text-[14px] font-medium text-gray-700 hover:text-blue-600 h-full flex items-center transition">Blog</Link>
          </div>
          <Link href="/shop" className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded text-[13px] font-bold hover:bg-blue-100 transition border border-blue-100">
            <GiftIcon className="h-4 w-4" /> Special Offers
          </Link>
        </div>
      </div>
    </header>
  );
}