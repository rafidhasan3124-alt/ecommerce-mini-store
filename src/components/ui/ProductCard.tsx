'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/format';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page if clicking button
    addItem(product);
    toast.success(`${product.title} added to cart`);
  };

  // Mock data for things missing in Product model
  const discount = Math.floor(Math.random() * 30) + 10;
  const oldPrice = product.price * (1 + (discount / 100));
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5 to 5.0
  const reviews = Math.floor(Math.random() * 200) + 10;

  return (
    <div className="group bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(6,81,237,0.15)] transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col relative h-full">
      
      {/* Badges & Actions */}
      <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
          -{discount}%
        </span>
        <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
          <HeartIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block relative h-48 bg-[#f8f9fa] rounded-lg mx-3 mt-3 overflow-hidden group/image">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain group-hover/image:scale-105 transition-transform duration-500 p-4 mix-blend-multiply"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCartIcon className="h-12 w-12 text-gray-300" />
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 border-t border-gray-50">
        <Link href={`/product/${product.id}`} className="flex-1">
          <h3 className="text-[14px] font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2 mb-3">
          <StarIconSolid className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-[12px] font-bold text-blue-600">{rating}</span>
          <span className="text-[11px] text-gray-400">({reviews})</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-end justify-between mt-auto pt-2">
          <div>
            <div className="text-[16px] font-bold text-gray-900 leading-none">
              {formatPrice(product.price)}
            </div>
            <div className="text-[12px] text-gray-400 line-through mt-1">
              {formatPrice(oldPrice)}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}