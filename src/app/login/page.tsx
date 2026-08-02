'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function LoginPage(){
    const router = useRouter();
    const [loading,setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit= async (e: React.FormEvent) =>{
        e.preventDefault();
        setLoading(true);

        try{
            const response = await fetch('/api/auth/login',{
                method : 'POST',
                headers: { 'Content-Type':'application/json'},
                body: JSON.stringify(formData)
            });

            const  data = await response.json();

            if (!response.ok){
                throw new Error(data.error|| 'Login failed');
                
            }

            toast.success('Welcome back!');

            // Redirect based on role 
            if(data.user.role === 'ADMIN'){
                router.push('/admin');
            } else {
                router.push('/profile');
            }
        } catch(error){
            toast.error(error instanceof Error? error.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
                </label>
                <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
                </label>
                <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                />
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={loading}>
                Sign In
            </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign Up
            </Link>
            </p>
        </div>
        </div>
    );
}