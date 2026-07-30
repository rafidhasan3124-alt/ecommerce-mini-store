'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function CancelPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <XCircleIcon className="h-20 w-20 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-8">
          Your payment was not completed. No charges have been made to your account.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-amber-800 mb-2">What happened?</h3>
          <ul className="text-sm text-amber-700 space-y-2">
            <li>• You cancelled the payment process</li>
            <li>• No payment was processed</li>
            <li>• Your cart items have been saved</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/cart">
            <Button size="lg" className="w-full sm:w-auto">
              Return to Cart
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}