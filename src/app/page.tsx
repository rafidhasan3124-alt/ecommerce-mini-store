'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ui/ProductCard';
import Image from 'next/image';
import {
  TruckIcon, ShieldCheckIcon,
  PhoneIcon, GiftIcon, ArrowPathIcon, CheckBadgeIcon,
  ArrowRightIcon, ChevronRightIcon, ChevronLeftIcon,
  BoltIcon, ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { formatPrice } from '@/lib/format';

const features1 = [
  { icon: TruckIcon, title: 'Free Shipping', desc: 'On all orders over $50' },
  { icon: ArrowPathIcon, title: '30 Days Returns', desc: 'Hassle free returns' },
  { icon: ShieldCheckIcon, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: PhoneIcon, title: 'Premium Support', desc: '24/7 live support' },
  { icon: GiftIcon, title: 'Special Gifts', desc: 'On every order' },
];

const features2 = [
  { icon: TruckIcon, title: 'Fast Delivery', desc: 'Get your products fast' },
  { icon: ShieldCheckIcon, title: 'Secure Payments', desc: '100% secure checkout' },
  { icon: ArrowPathIcon, title: 'Easy Returns', desc: '30 days return policy' },
  { icon: CheckBadgeIcon, title: 'Price Guarantee', desc: 'Best price promise' },
  { icon: PhoneIcon, title: '24/7 Customer Support', desc: "We're here to help" },
];

const categories = [
  { name: 'Smartphones', icon: '📱' },
  { name: 'Laptops', icon: '💻' },
  { name: 'Smart Watch', icon: '⌚' },
  { name: 'Headphones', icon: '🎧' },
  { name: 'Speakers', icon: '🔊' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Accessories', icon: '🔌' },
  { name: 'Cameras', icon: '📷' },
  { name: 'Tablets', icon: '📱' },
  { name: 'More', icon: '⊞' },
];

const heroSlides = [
  {
    title: 'Sony WH-1000XM5',
    subtitle: 'Wireless Noise Cancelling Headphones',
    desc: 'Industry-leading noise cancellation, exceptionally clear calls, and up to 30 hours of battery life.',
    price: 299.00,
    oldPrice: 399.00,
    save: 100,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop',
    tag: 'Top Rated',
    bgColor: 'from-zinc-900 to-zinc-800',
  },
  {
    title: 'iPhone 15 Pro Max',
    subtitle: 'Titanium. So strong. So light.',
    desc: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a more versatile Pro camera system.',
    price: 1199.00,
    oldPrice: 1299.00,
    save: 100,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
    tag: 'Latest Release',
    bgColor: 'from-slate-900 to-blue-950',
  },
  {
    title: 'MacBook Air M3',
    subtitle: 'Lean. Mean. M3 machine.',
    desc: 'Supercharged by M3, the MacBook Air is up to 60 percent faster than the model with M1. Features a Liquid Retina display and up to 18 hours of battery life.',
    price: 1299.00,
    oldPrice: 1499.00,
    save: 200,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    tag: 'Best Seller',
    bgColor: 'from-gray-900 to-neutral-800',
  },
  {
    title: 'PlayStation 5 Console',
    subtitle: 'Play Has No Limits',
    desc: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
    price: 499.00,
    oldPrice: 549.00,
    save: 50,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800&auto=format&fit=crop',
    tag: 'Trending',
    bgColor: 'from-indigo-950 to-blue-900',
  },
  {
    title: 'Apple Watch Ultra 2',
    subtitle: 'Next-level adventure.',
    desc: 'The most rugged and capable Apple Watch. Designed for outdoor adventures and supercharged workouts with a lightweight titanium case.',
    price: 799.00,
    oldPrice: 899.00,
    save: 100,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=800&auto=format&fit=crop',
    tag: 'New Arrival',
    bgColor: 'from-orange-950 to-red-950',
  }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const flashSaleRef = useRef<HTMLDivElement>(null);
  
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, mins: 36, secs: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        if (secs > 0) secs--;
        else {
          secs = 59;
          if (mins > 0) mins--;
          else {
            mins = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setFeaturedProducts(data.products || []);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-slide hero section every 5 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);


  const trendingProducts = featuredProducts.slice(0, 10);
  const flashSaleProducts = featuredProducts.slice(4, 12); // Give it 8 items to slide through

  return (
    <div className="bg-gray-50 flex flex-col gap-10 pb-16">
      
      {/* ─── 1. Hero Section ─── */}
      <section className="max-w-[1920px] mx-auto mt-0 lg:mt-0 w-full relative group">
        <div className="relative bg-white overflow-hidden h-[550px] sm:h-[500px] lg:h-[550px] shadow-sm w-full">
          
          {/* Slides Container */}
          <div className="relative w-full h-full bg-gray-900">
            {heroSlides.map((slide, slideIdx) => (
              <div 
                key={slideIdx} 
                className={`absolute inset-0 w-full h-full md:transition-opacity md:duration-700 md:ease-in-out flex ${slideIdx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-95`}></div>
                
                {/* Decorative Elements */}
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent mix-blend-overlay"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

                {/* Content */}
                <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                  
                  {/* Text Content */}
                  <div className="w-full md:w-1/2 flex flex-col items-start gap-2 md:gap-4 text-white mt-8 md:mt-0">
                    <span className="bg-yellow-400 text-black text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 rounded-sm uppercase tracking-widest shadow-sm">
                      {slide.tag}
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                      {slide.title}
                    </h1>
                    <h2 className="text-lg md:text-xl font-medium text-gray-200">
                      {slide.subtitle}
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-md line-clamp-2 md:line-clamp-3 leading-relaxed mt-1 md:mt-2">
                      {slide.desc}
                    </p>
                    
                    <div className="flex items-end gap-2 md:gap-3 mt-2 md:mt-4">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-bold">${slide.price.toFixed(2)}</span>
                      <span className="text-base md:text-lg text-gray-400 line-through mb-1 md:mb-1.5">${slide.oldPrice.toFixed(2)}</span>
                    </div>

                    <Link href="/shop" className="mt-2 md:mt-4 bg-white text-black px-6 md:px-10 py-2.5 md:py-3.5 rounded-full text-sm md:text-base font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-xl">
                      Shop Now <ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </Link>
                  </div>
                  
                  {/* Image */}
                  <div className="w-full md:w-1/2 h-[200px] md:h-[400px] flex justify-center items-center mt-4 md:mt-0 pb-8 md:pb-0">
                    <div className="relative w-full h-full max-w-[300px] md:max-w-[450px] group-hover:scale-105 transition-transform duration-700 ease-out">
                      <Image 
                        src={slide.image} 
                        alt={slide.title} 
                        fill 
                        priority={slideIdx === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain drop-shadow-2xl"
                      />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={() => setCurrentSlide(prev => prev === 0 ? heroSlides.length - 1 : prev - 1)}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-30 opacity-0 group-hover:opacity-100 border border-white/20 shadow-lg"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => prev === heroSlides.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-30 opacity-0 group-hover:opacity-100 border border-white/20 shadow-lg"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Pagination Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-30 bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
            {heroSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/80'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 2. Features Row 1 ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap justify-between gap-6">
          {features1.map((f, i) => (
            <div key={i} className={`flex items-center gap-3 ${i !== features1.length-1 ? 'lg:border-r border-gray-100 lg:pr-8' : ''}`}>
              <f.icon className="w-8 h-8 text-blue-600 shrink-0" />
              <div>
                <h4 className="text-[13px] font-bold text-gray-900">{f.title}</h4>
                <p className="text-[11px] text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. Categories ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat, i) => (
            <Link key={i} href={`/shop?category=${cat.name}`} className="flex flex-col items-center gap-3 min-w-[80px] group">
              <div className="w-20 h-20 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-3xl group-hover:border-blue-600 group-hover:shadow-md transition">
                {cat.icon}
              </div>
              <span className="text-[12px] font-semibold text-gray-700 group-hover:text-blue-600">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 4. Trending Products ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">🔥</span>
            <h2 className="text-xl font-bold text-[#0b1b36]">Trending Products</h2>
          </div>
          <Link href="/shop" className="text-[13px] font-bold text-blue-600 flex items-center gap-1 hover:underline">
            View all products <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[300px] bg-white animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ─── 5. Promo Banners ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Banner 1 */}
          <div className="bg-[#0b1b36] rounded-2xl p-8 relative overflow-hidden text-white min-h-[220px] flex flex-col justify-center">
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity rounded-br-2xl"></div>
            <div className="relative z-10 max-w-[60%]">
              <p className="text-[12px] text-gray-300 mb-1">Up to 40% Off</p>
              <h3 className="text-2xl font-bold leading-tight mb-2">Smart Watch<br/>Series 9</h3>
              <p className="text-[13px] text-gray-400 mb-4">From $399.00</p>
              <Link href="/shop" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-blue-700 transition w-max">
                Shop Now <ArrowRightIcon className="w-3 h-3"/>
              </Link>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="bg-[#f0f5fa] rounded-2xl p-8 relative overflow-hidden min-h-[220px] flex flex-col justify-center border border-gray-100">
            <div className="absolute -right-4 -bottom-4 w-1/2 h-[120%] opacity-80 bg-[url('https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=400&auto=format&fit=crop')] bg-contain bg-no-repeat bg-right-bottom mix-blend-multiply"></div>
            <div className="relative z-10 max-w-[60%]">
              <p className="text-[12px] text-blue-600 font-bold mb-1">Premium Sound</p>
              <h3 className="text-[20px] font-bold text-[#0b1b36] leading-tight mb-2">Speakers Collection</h3>
              <p className="text-[13px] text-gray-500 mb-4">Up to 30% Off</p>
              <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-blue-600 border border-blue-200 px-5 py-2 rounded-full text-xs font-bold hover:border-blue-600 transition w-max">
                Shop Now <ArrowRightIcon className="w-3 h-3"/>
              </Link>
            </div>
          </div>

          {/* Banner 3 */}
          <div className="bg-[#f5f8ff] rounded-2xl p-8 relative overflow-hidden min-h-[220px] flex flex-col justify-center border border-blue-50">
            <div className="absolute -right-10 -bottom-10 w-2/3 h-full opacity-90 bg-[url('https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=400&auto=format&fit=crop')] bg-contain bg-no-repeat bg-right-bottom mix-blend-darken"></div>
            <div className="relative z-10 max-w-[60%]">
              <p className="text-[12px] text-blue-600 font-bold mb-1">Best Deals on</p>
              <h3 className="text-[20px] font-bold text-[#0b1b36] leading-tight mb-2">Gaming Accessories</h3>
              <p className="text-[13px] text-gray-500 mb-4">From $29.00</p>
              <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-blue-600 border border-blue-200 px-5 py-2 rounded-full text-xs font-bold hover:border-blue-600 transition w-max">
                Shop Now <ArrowRightIcon className="w-3 h-3"/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Flash Sale ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Timer Column */}
          <div className="w-full lg:w-1/4 flex flex-col justify-center bg-white border border-gray-100 rounded-2xl p-6 shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <BoltIcon className="w-6 h-6 text-blue-600 animate-pulse" />
              <h2 className="text-2xl font-black text-[#0b1b36]">Flash Sale</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6 relative z-10"><span className="font-bold text-gray-900">Limited time offer!</span> Grab it before it&apos;s gone.</p>
            
            <div className="flex justify-between items-start mb-8 relative z-10 max-w-[240px]">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center text-xl font-black mb-1">
                  {timeLeft.days.toString().padStart(2, '0')}
                </div>
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Days</span>
              </div>
              <span className="text-xl font-bold text-gray-300 mt-2">:</span>
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center text-xl font-black mb-1">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Hours</span>
              </div>
              <span className="text-xl font-bold text-gray-300 mt-2">:</span>
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center text-xl font-black mb-1">
                  {timeLeft.mins.toString().padStart(2, '0')}
                </div>
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Mins</span>
              </div>
              <span className="text-xl font-bold text-gray-300 mt-2">:</span>
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center text-xl font-black mb-1 animate-pulse">
                  {timeLeft.secs.toString().padStart(2, '0')}
                </div>
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Secs</span>
              </div>
            </div>

            <Link href="/shop" className="text-[13px] font-bold text-blue-600 flex items-center gap-1 hover:text-[#0b1b36] transition relative z-10 w-max">
              View All Deals <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {/* Flash Sale Products Row */}
          <div className="w-full lg:w-3/4 relative flex items-center group">
            {/* Scroll Buttons */}
            <button 
              onClick={() => flashSaleRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
              className="absolute left-0 -ml-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 hover:scale-110 transition opacity-0 group-hover:opacity-100"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <div ref={flashSaleRef} className="w-full flex gap-4 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide snap-x">

            {!loading && flashSaleProducts.map((p, index) => {
              const soldPercent = [40, 32, 41, 21, 37][index % 5];
              const oldPrice = p.price * 1.25;
              const discountPercent = 10 + ((index * 7) % 20);

              return (
                <div key={p.id} className="min-w-[220px] snap-start bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col p-4 relative group/card">
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm z-10 shadow-sm">
                    -{discountPercent}%
                  </span>
                  
                  <Link href={`/product/${p.id}`} className="block relative h-36 bg-gray-50 mb-3 rounded-lg overflow-hidden flex items-center justify-center p-2">
                    {p.imageUrl ? (
                      <Image src={p.imageUrl} alt={p.title} fill className="object-contain mix-blend-multiply hover:scale-105 transition" />
                    ) : (
                      <ShoppingCartIcon className="w-10 h-10 text-gray-300" />
                    )}
                  </Link>

                  <Link href={`/product/${p.id}`}>
                    <h3 className="text-[13px] font-semibold text-gray-900 line-clamp-1 mb-1">{p.title}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[15px] font-bold text-gray-900">{formatPrice(p.price)}</span>
                    <span className="text-[11px] text-gray-400 line-through">{formatPrice(oldPrice)}</span>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-50">
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1.5 uppercase">
                      <span>Available: {100 - soldPercent}</span>
                      <span className="text-[#ffaa00]">Sold: {soldPercent}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 relative overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full transition-all duration-1000" style={{ width: `${soldPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
            
            <button 
              onClick={() => flashSaleRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              className="absolute right-0 -mr-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 hover:scale-110 transition opacity-0 group-hover:opacity-100"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── 7. Features Row 2 ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-2">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features2.map((f, i) => (
            <div key={i} className={`flex items-center gap-3 ${i !== features2.length-1 ? 'lg:border-r border-gray-100 lg:pr-8' : ''}`}>
              <f.icon className="w-7 h-7 text-blue-600 shrink-0" />
              <div>
                <h4 className="text-[13px] font-bold text-gray-900">{f.title}</h4>
                <p className="text-[11px] text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. Top Brands Marquee ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-gray-200 pt-8 mt-4">
        <div className="flex items-center gap-6">
          <h3 className="text-sm font-bold text-gray-900 shrink-0 uppercase tracking-wide">Top Brands</h3>
          <div className="w-px h-6 bg-gray-300"></div>
          
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between opacity-50 grayscale hover:grayscale-0 transition duration-500">
              {/* Simulated Brand Logos using text since we don't have SVG images */}
              <span className="font-black text-xl tracking-tighter">SAMSUNG</span>
              <span className="font-bold text-2xl tracking-tighter">SONY</span>
              <span className="font-black text-xl italic tracking-tighter">JBL</span>
              <span className="font-bold text-xl tracking-widest">ASUS</span>
              <span className="font-black text-xl tracking-tighter text-blue-800">DELL</span>
              <span className="w-10 h-10 rounded-full border-4 border-blue-600 flex items-center justify-center font-bold text-blue-600">hp</span>
              <span className="font-bold text-2xl tracking-tight italic">BOSE</span>
              <span className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center font-bold rounded">mi</span>
              <span className="font-bold text-xl tracking-tighter text-red-600">ONEPLUS</span>
            </div>
          </div>
          
          <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600">
            <ChevronRightIcon className="w-5 h-5"/>
          </button>
        </div>
      </section>
      
    </div>
  );
}