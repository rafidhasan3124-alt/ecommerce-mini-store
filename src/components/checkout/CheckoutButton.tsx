'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface CheckoutButtonProps {
  className?: string;
}

export default function CheckoutButton({ className = '' }: CheckoutButtonProps) {
  const { items, totalItems, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Preparing your checkout...');

    try {
      // Check authentication before proceeding
      const meResponse = await fetch('/api/auth/me');
      if (!meResponse.ok) {
        toast.dismiss(loadingToast);
        toast.error('Please sign in to checkout');
        router.push('/login');
        return;
      }

      const cartData = {
        items: items.map((item) => ({
          product: {
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            imageUrl: item.product.imageUrl || null,
          },
          quantity: item.quantity,
        })),
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      toast.dismiss(loadingToast);
      toast.success('Redirecting to secure checkout...');

      if (data.sessionUrl) {
        setTimeout(() => {
          window.location.href = data.sessionUrl;
        }, 800);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || items.length === 0}
      size="lg"
      className={`w-full mt-4 ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <LockClosedIcon className="h-4 w-4" />
          Secure Checkout · {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      )}
    </Button>
  );
}