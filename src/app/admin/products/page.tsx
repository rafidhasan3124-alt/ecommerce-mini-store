'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/format';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  oldPrice?: number | null;
  imageUrl: string | null;
  category: string | null;
  inStock: boolean;
  stockQuantity: number;
  isHero?: boolean;
  heroTag?: string | null;
  heroSubtitle?: string | null;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    oldPrice: '',
    imageUrl: '',
    category: '',
    stockQuantity: '0',
    inStock: true,
    isHero: false,
    heroTag: '',
    heroSubtitle: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct 
      ? `/api/admin/products/${editingProduct.id}`
      : '/api/admin/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Math.round(parseFloat(formData.price) * 100),
          oldPrice: formData.oldPrice ? Math.round(parseFloat(formData.oldPrice) * 100) : null,
          stockQuantity: parseInt(formData.stockQuantity),
        }),
      });

      if (response.ok) {
        toast.success(editingProduct ? 'Product updated' : 'Product created');
        setShowForm(false);
        setEditingProduct(null);
        setFormData({
          title: '',
          description: '',
          price: '',
          oldPrice: '',
          imageUrl: '',
          category: '',
          stockQuantity: '0',
          inStock: true,
          isHero: false,
          heroTag: '',
          heroSubtitle: '',
        });
        fetchProducts();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save product');
      }
    } catch {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const toggleStock = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !currentStatus }),
      });

      if (response.ok) {
        toast.success(`Product ${!currentStatus ? 'in' : 'out of'} stock`);
        fetchProducts();
      } else {
        toast.error('Failed to update stock');
      }
    } catch {
      toast.error('Failed to update stock');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="bg-white rounded-xl h-64"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products</p>
        </div>
        <Button onClick={() => {
          setShowForm(true);
          setEditingProduct(null);
          setFormData({
            title: '',
            description: '',
            price: '',
            oldPrice: '',
            imageUrl: '',
            category: '',
            stockQuantity: '0',
            inStock: true,
            isHero: false,
            heroTag: '',
            heroSubtitle: '',
          });
        }} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (BDT) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="1999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Old Original Price (BDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="2499 (Optional for discount badge)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ─── Hero Banner Settings ─── */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isHero"
                    checked={formData.isHero}
                    onChange={(e) => setFormData({ ...formData, isHero: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isHero" className="ml-2 text-sm font-bold text-gray-900 flex items-center gap-1.5 cursor-pointer">
                    ⭐ Show in Homepage Hero Slider
                  </label>
                </div>
                <span className="text-xs text-blue-600 font-medium">Controls homepage top banner</span>
              </div>

              {formData.isHero && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-blue-100">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Hero Badge Tag
                    </label>
                    <input
                      type="text"
                      value={formData.heroTag}
                      onChange={(e) => setFormData({ ...formData, heroTag: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="e.g. LATEST RELEASE, TOP RATED, BEST SELLER"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Hero Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.heroSubtitle}
                      onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="e.g. Titanium. So strong. So light."
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                In Stock
              </label>
            </div>

            <div className="flex gap-4">
              <Button type="submit">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                      )}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">{product.title}</span>
                          {product.isHero && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              ⭐ Hero
                            </span>
                          )}
                        </div>
                        {product.heroTag && (
                          <span className="text-[11px] text-gray-400">Tag: {product.heroTag}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{product.category}</td>
                  <td className="py-3 px-4 text-sm font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-3 px-4 text-sm">{product.stockQuantity}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStock(product.id, product.inStock)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {product.inStock ? 'Mark Out' : 'Mark In'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                          setFormData({
                            title: product.title,
                            description: product.description || '',
                            price: (product.price / 100).toString(),
                            oldPrice: product.oldPrice ? (product.oldPrice / 100).toString() : '',
                            imageUrl: product.imageUrl || '',
                            category: product.category || '',
                            stockQuantity: product.stockQuantity.toString(),
                            inStock: product.inStock,
                            isHero: Boolean(product.isHero),
                            heroTag: product.heroTag || '',
                            heroSubtitle: product.heroSubtitle || '',
                          });
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}