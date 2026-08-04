/**
 * Formats a price in cents to a BDT (৳) currency string.
 * Safe to import from both client and server components.
 */
export function formatPrice(amount: number): string {
  const value = amount / 100;
  return `৳${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
