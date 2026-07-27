'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/stripe';
import { useCartStore } from '@/store/cartStore';
import { mockProducts } from '@/data/products';
import Button from '@/components/ui/Button';
import { ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
        } else {
          // Fallback to mock data
          const mockProduct = mockProducts.find((p) => p.id === params.id);
          setProduct(mockProduct || null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        const mockProduct = mockProducts.find((p) => p.id === params.id);
        setProduct(mockProduct || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="bg-gray-200 h-96 rounded-xl w-full md:w-1/2"></div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/shop" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Shop
      </Link>

      {/* Product Details */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image */}
        <div className="lg:w-1/2 relative">
          <div className="relative h-96 lg:h-[500px] bg-gray-100 rounded-xl overflow-hidden">
            <Image
              src={product.imageUrl ?? "/placeholder.png"}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-6 py-3 rounded-lg text-xl font-bold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <span className="inline-block mt-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Stock Status */}
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity Selector */}
          {product.inStock && (
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-gray-700 font-medium">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            size="lg"
            className="w-full lg:w-auto"
          >
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
}