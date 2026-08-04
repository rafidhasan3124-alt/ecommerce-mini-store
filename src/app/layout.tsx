import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ShopStore — Premium E-Commerce',
    template: '%s | ShopStore',
  },
  description: 'Discover premium products at unbeatable prices. Electronics, accessories, lifestyle and more — delivered fast.',
  keywords: ['ecommerce', 'online store', 'shopping', 'shopstore'],
  openGraph: {
    title: 'ShopStore — Premium E-Commerce',
    description: 'Discover premium products at unbeatable prices.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased pb-16 md:pb-0">
        <Navbar />

        <main className="min-h-screen bg-gray-50">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-2xl text-blue-600">Shop</span>
                  <span className="font-light text-2xl text-gray-600">Store</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Discover premium products at unbeatable prices. Electronics, accessories, lifestyle and more — delivered fast.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Shop</h3>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-blue-600 transition-colors">New Arrivals</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Best Sellers</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Electronics</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Accessories</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Track Order</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Returns & Refunds</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} ShopStore. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
                <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
                <a href="#" className="hover:text-gray-600 transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </footer>

        <BottomNav />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: '#1f2937',
              color: '#fff',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              duration: 3000,
              style: {
                background: '#16a34a',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#16a34a',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#dc2626',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#dc2626',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
