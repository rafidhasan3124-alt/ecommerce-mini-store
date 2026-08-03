'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";


interface Address{
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
}


export default function AddressesPage(){
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
    });

    useEffect(() => {
        fetchAddresses();
    },[]);

    const fetchAddresses = async () => {
        try {
            const response = await fetch('/api/user/addresses');
            if (response.ok){
                const data = await response.json();
                setAddresses(data.addresses);
            }
        } catch(error){
            console.error('Error fetching addresses:',error);
        } finally{
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        const url = editingId 
        ? `/api/user/addresses/${editingId}`
        : '/api/user/addresses';
        const method = editingId ? 'PUT' : 'POST';

        try{
            const response = await fetch(url,{
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok){
                toast.success(editingId? 'Address updated' : 'Adress added');
                setShowForm(false);
                setEditingId(null);
                setFormData({ street: '', city: '', state: '', zipCode: '', country: 'US'});
                fetchAddresses();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to save address');

            }
        } catch (error){
            toast.error('Failed to save address');
        }

    };

    const handleDelete = async (id: string) =>{
        if(!confirm('Delete this address?')) return;

        try {
            const response = await fetch(`/api/user/addresses/${id}`,{
                method : 'DELETE'
            });

            if (response.ok){
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
        try{
            const response = await fetch(`/api/user/addresses/${id}/default`,{
                method: 'PUT'
            });


            if (response.ok){
                toast.success('Default address updated');
                fetchAddresses();
            } else{
                toast.error('Failed to update default address');
            }
        } catch (error) {
            toast.error('Failed to update default address');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
            <Button onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ street: '', city: '', state: '', zipCode: '', country: 'US' });
            }}>
            Add New Address
            </Button>
        </div>

        {/* Address Form */}
        {showForm && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Main St"
                />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="New York"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="NY"
                    />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="10001"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                    </label>
                    <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

                <div className="flex gap-4">
                <Button type="submit">
                    {editingId ? 'Update Address' : 'Add Address'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    }}
                >
                    Cancel
                </Button>
                </div>
            </form>
            </div>
        )}

        {/* Address List */}
        <div className="space-y-4">
            {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start">
                <div>
                    {address.isDefault && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mb-2">
                        Default
                    </span>
                    )}
                    <p className="font-medium">{address.street}</p>
                    <p className="text-gray-600">
                    {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                </div>
                <div className="flex gap-2">
                    {!address.isDefault && (
                    <button
                        onClick={() => setDefault(address.id)}
                        className="text-sm text-blue-600 hover:text-blue-700"
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
                    className="text-sm text-blue-600 hover:text-blue-700"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => handleDelete(address.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                    >
                    Delete
                    </button>
                </div>
                </div>
            </div>
            ))}

            {addresses.length === 0 && !showForm && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-600">No addresses saved yet.</p>
                <p className="text-sm text-gray-500 mt-1">
                Add your first address for faster checkout.
                </p>
            </div>
            )}
        </div>
        </div>
    );
    }