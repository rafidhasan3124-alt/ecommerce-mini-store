'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { ArrowLeftIcon, MapPinIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  AU: 'Australia',
};

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/user/addresses');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ street: '', city: '', state: '', zipCode: '', country: 'US' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const url = editingId
      ? `/api/user/addresses/${editingId}`
      : '/api/user/addresses';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingId ? 'Address updated' : 'Address added');
        resetForm();
        fetchAddresses();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save address');
      }
    } catch (error) {
      toast.error('Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this address? This cannot be undone.')) return;

    try {
      const response = await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Address deleted');
        fetchAddresses();
      } else {
        toast.error('Failed to delete address');
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const setDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/user/addresses/${id}/default`, { method: 'PUT' });
      if (response.ok) {
        toast.success('Default address updated');
        fetchAddresses();
      } else {
        toast.error('Failed to update default address');
      }
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="text-gray-500 hover:text-gray-700 transition">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your shipping addresses</p>
          </div>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-5 text-gray-900">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="123 Main St, Apt 4B"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State / Region *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP / Postal Code *</label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="10001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" isLoading={submitting}>
                {editingId ? 'Update Address' : 'Save Address'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.length === 0 && !showForm ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <MapPinIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No addresses saved yet.</p>
            <p className="text-sm text-gray-500 mt-1">Add an address for faster checkout.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="mt-4"
              variant="outline"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <MapPinIcon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${address.isDefault ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div>
                    {address.isDefault && (
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
                        ✓ Default
                      </span>
                    )}
                    <p className="font-semibold text-gray-900">{address.street}</p>
                    <p className="text-gray-600 text-sm">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-gray-500 text-sm">{COUNTRY_NAMES[address.country] || address.country}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  {!address.isDefault && (
                    <button
                      onClick={() => setDefault(address.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium transition"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(address.id);
                      setShowForm(true);
                      setFormData({
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        zipCode: address.zipCode,
                        country: address.country,
                      });
                    }}
                    className="text-gray-600 hover:text-gray-900 font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-500 hover:text-red-700 font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
