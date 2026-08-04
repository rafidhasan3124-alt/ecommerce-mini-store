'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  MagnifyingGlassIcon as SearchSolid,
  ShoppingCartIcon as CartSolid,
  UserIcon as UserSolid,
} from '@heroicons/react/24/solid';
import { useCartStore } from '@/store/cartStore';

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCartStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Re-check auth on every navigation
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => setIsLoggedIn(r.ok))
      .catch(() => setIsLoggedIn(false));
  }, [pathname]);

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: HomeIcon,
      activeIcon: HomeSolid,
      badge: undefined as number | undefined,
    },
    {
      label: 'Shop',
      href: '/shop',
      icon: MagnifyingGlassIcon,
      activeIcon: SearchSolid,
      badge: undefined as number | undefined,
    },
    {
      label: 'Cart',
      href: '/cart',
      icon: ShoppingCartIcon,
      activeIcon: CartSolid,
      badge: totalItems || undefined,
    },
    {
      label: isLoggedIn ? 'Account' : 'Sign In',
      href: isLoggedIn ? '/profile' : '/login',
      icon: isLoggedIn ? UserIcon : ArrowRightOnRectangleIcon,
      activeIcon: isLoggedIn ? UserSolid : ArrowRightOnRectangleIcon,
      badge: undefined as number | undefined,
    },
  ];

  // Do not render BottomNav on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border border-white">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
