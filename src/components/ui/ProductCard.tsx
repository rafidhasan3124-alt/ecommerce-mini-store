'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/format';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.title} added to cart`);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block relative h-60 overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBagIcon className="h-16 w-16 text-gray-200" />
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {product.category && (
          <span className="text-[11px] font-medium text-blue-600 uppercase tracking-wide">
            {product.category}
          </span>
        )}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-1 mt-0.5">
            {product.title}
          </h3>
        </Link>

        {product.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBagIcon className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}