export const formatPrice = (cents: number) => {
  const value = cents / 100;
  return `৳${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
