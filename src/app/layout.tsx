import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Nexora — Next Generation Shopping',
    template: '%s | Nexora',
  },
  description: 'Discover premium products at unbeatable prices. Electronics, accessories, lifestyle and more — delivered fast.',
  keywords: ['ecommerce', 'online store', 'shopping', 'nexora'],
  openGraph: {
    title: 'Nexora — Next Generation Shopping',
    description: 'Discover premium products at unbeatable prices.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="font-sans antialiased pb-16 md:pb-0">
        <Navbar />

        <main className="min-h-screen bg-[#f0f2f5]">
          {children}
        </main>

        <Footer />

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
