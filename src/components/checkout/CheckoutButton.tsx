'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface CheckoutButtonProps {
  className?: string;
}

export default function CheckoutButton({ className = '' }: CheckoutButtonProps) {
  const { items, totalItems } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    // Validate cart is not empty
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Preparing your checkout...');

    try {
      // Prepare cart data for API
      const cartData = {
        items: items.map((item) => ({
          product: {
            id: item.product.id,
            stripePriceId: item.product.stripePriceId,
            price: item.product.price,
            title: item.product.title,
          },
          quantity: item.quantity,
        })),
        email: '', // You can add email input later
      };

      // Call the checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Clear loading toast
      toast.dismiss(loadingToast);

      // Show success message
      toast.success('Redirecting to checkout...');

      // Redirect to Stripe Checkout
      if (data.sessionUrl) {
        // Small delay to show the toast before redirect
        setTimeout(() => {
          window.location.href = data.sessionUrl;
        }, 1000);
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
      className={`w-full ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        `Proceed to Checkout (${totalItems} items)`
      )}
    </Button>
  );
}