import Stripe from 'stripe';

/**
 * Lazily creates and caches the Stripe instance.
 * Only use this in server-side code (API routes / server actions).
 */
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}

// Re-export formatPrice so existing server-side imports keep working
export { formatPrice } from './format';
