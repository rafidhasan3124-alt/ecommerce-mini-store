'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#0b1b36] text-white pt-16 pb-8 mt-auto hidden md:block border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Logo & Info */}
          <div className="space-y-4 pr-4">
            <div className="flex items-center gap-1 mb-6">
              <span className="font-black text-2xl tracking-tight uppercase">ZYVO</span>
            </div>
            <p className="text-gray-400 text-[13px] leading-relaxed">
              Your one-stop destination for premium electronics. Quality products, best prices, and excellent service.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="text-sm font-bold">f</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="text-sm font-bold">X</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="text-sm font-bold">ig</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="text-sm font-bold">in</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold mb-6 text-[15px]">Quick Links</h3>
            <ul className="space-y-3 text-gray-400 text-[13px]">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-blue-400 transition-colors">Shop All</Link></li>
              <li><Link href="/shop?category=Electronics" className="hover:text-blue-400 transition-colors">Electronics</Link></li>
              <li><Link href="/shop" className="hover:text-blue-400 transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop" className="hover:text-blue-400 transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="font-bold mb-6 text-[15px]">Customer Service</h3>
            <ul className="space-y-3 text-gray-400 text-[13px]">
              <li><Link href="/profile" className="hover:text-blue-400 transition-colors">My Account</Link></li>
              <li><Link href="/orders" className="hover:text-blue-400 transition-colors">Track Order</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="font-bold mb-6 text-[15px]">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-[13px]">
              <li className="flex gap-3">
                <span className="text-blue-500">📍</span>
                <span>123 Commerce St, Tech City, TC 10100, United States</span>
              </li>
              <li className="flex gap-3 items-center">
                <span className="text-blue-500">📞</span>
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex gap-3 items-center">
                <span className="text-blue-500">✉️</span>
                <span>support@zyvo.com</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div>
            <h3 className="font-bold mb-6 text-[15px]">Newsletter</h3>
            <p className="text-gray-400 text-[13px] mb-4 leading-relaxed">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 transition-colors text-white"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded transition-colors text-[13px]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 relative">
          <div className="flex gap-6 text-gray-400 text-[12px]">
            <a href="#" className="hover:text-blue-400 transition-colors">About Us</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Careers</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Blog</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms & Conditions</a>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 relative">
          <p className="text-gray-400 text-[13px]">
            © {new Date().getFullYear()} Zyvo. All rights reserved.
          </p>
          <div className="flex gap-2">
            <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">VISA</div>
            <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">MC</div>
            <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">PayPal</div>
            <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">Pay</div>
          </div>
          <a href="#" className="absolute right-0 -top-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition shadow-lg text-white">
            ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
