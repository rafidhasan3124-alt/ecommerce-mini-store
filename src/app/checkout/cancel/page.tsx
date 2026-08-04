'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CancelPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <XCircleIcon className="h-20 w-20 text-red-400" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges were made. Your cart items are still saved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/cart">
            <Button size="lg" className="w-full sm:w-auto">
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Return to Cart
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Need help? Contact our support team.
        </p>
      </div>
    </div>
  );
}
