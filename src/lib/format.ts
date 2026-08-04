/**
 * Formats a price in cents to a USD currency string.
 * Safe to import from both client and server components.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);
}
