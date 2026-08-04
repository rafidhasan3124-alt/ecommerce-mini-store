'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBagIcon, StarIcon, TruckIcon, ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/format';
import { Product } from '@/types/product';
import Image from 'next/image';

const features = [
  {
    icon: TruckIcon,
    title: 'Free Shipping',
    desc: 'On all orders over $50',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Payments',
    desc: 'Powered by Stripe',
  },
  {
    icon: StarIcon,
    title: 'Quality Products',
    desc: 'Carefully curated items',
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        // Always use whatever came from the API (could be empty array)
        setFeaturedProducts((data.products || []).slice(0, 8));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
          <div className="max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-white/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live: New arrivals just dropped ✨
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6">
              Shop the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-yellow-300 animate-gradient-x">
                Best
              </span>{' '}
              Products
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-xl">
              Discover premium products at unbeatable prices. From electronics to lifestyle essentials — everything you need, delivered fast.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <ShoppingBagIcon className="h-6 w-6 animate-float" />
                Browse All Products
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white/40 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                Create Account
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
          
          {/* Floating Decorative Elements */}
          <div className="hidden lg:block relative w-full flex-1 min-h-[400px]">
            <div className="absolute top-10 right-20 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl animate-float">
              <StarIcon className="h-12 w-12 text-yellow-300 mb-2" />
              <p className="text-white font-bold text-lg">Top Rated</p>
              <p className="text-blue-100 text-sm">By 10k+ users</p>
            </div>
            <div className="absolute bottom-10 left-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl animate-float" style={{ animationDelay: '1.5s' }}>
              <ShieldCheckIcon className="h-12 w-12 text-green-300 mb-2" />
              <p className="text-white font-bold text-lg">Secure</p>
              <p className="text-blue-100 text-sm">100% Protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Live Features Marquee ─── */}
      <section className="bg-white border-b border-gray-200 overflow-hidden py-6">
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee flex gap-16 pl-16 items-center">
            {/* Repeat the features array a few times to create a seamless loop */}
            {[...features, ...features, ...features, ...features].map((f, i) => (
              <div key={`${f.title}-${i}`} className="flex items-center gap-4 min-w-max">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <f.icon className="h-6 w-6 text-blue-600 animate-pulse-glow" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{f.title}</p>
                  <p className="text-gray-500 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mobile Categories (Quick Links) ─── */}
      <section className="bg-white py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { name: 'Electronics', icon: '📱' },
              { name: 'Fashion', icon: '👕' },
              { name: 'Home', icon: '🏠' },
              { name: 'Beauty', icon: '💄' },
              { name: 'Sports', icon: '⚽' },
              { name: 'Toys', icon: '🧸' },
            ].map((cat, i) => (
              <Link key={i} href={`/shop?category=${cat.name}`} className="flex flex-col items-center gap-2 min-w-[72px]">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-2xl border border-gray-100 shadow-sm">
                  {cat.icon}
                </div>
                <span className="text-[11px] font-medium text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-1 text-xs sm:text-sm">Handpicked for you</p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
          >
            View all <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
                <div className="h-40 sm:h-52 bg-gray-200"></div>
                <div className="p-3 sm:p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 sm:h-9 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products available yet.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
              >
                <Link href={`/product/${product.id}`} className="block relative h-40 sm:h-52 bg-gray-100 overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBagIcon className="h-12 w-12 sm:h-16 sm:w-16" />
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </Link>

                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                  <div>
                    {product.category && (
                      <span className="text-[10px] sm:text-[11px] font-medium text-blue-600 uppercase tracking-wide line-clamp-1">
                        {product.category}
                      </span>
                    )}
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 mt-0.5 mb-1 hover:text-blue-600 transition line-clamp-2 text-xs sm:text-base leading-tight">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="hidden sm:block text-xs text-gray-400 line-clamp-2 mb-3">{product.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mt-2 sm:mt-0">
                    <span className="text-sm sm:text-lg font-bold text-gray-900 leading-none">{formatPrice(product.price)}</span>
                    <button
                      onClick={() => addItem(product)}
                      disabled={!product.inStock}
                      className="flex items-center justify-center gap-1 bg-blue-600 text-white text-[11px] sm:text-xs font-semibold px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      <ShoppingBagIcon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            Shop All Products
          </Link>
        </div>
      </section>
    </div>
  );
}