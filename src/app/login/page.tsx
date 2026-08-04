'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      router.refresh();
      router.push(data.user.role === 'ADMIN' ? '/admin' : '/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px 80px', // bottom padding for mobile BottomNav
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            marginBottom: '16px',
          }}>
            <ShoppingBagIcon style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'white', margin: 0 }}>Nexora</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '6px', fontSize: '15px' }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        }}>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '12px 16px',
                  border: '2px solid #e5e7eb', borderRadius: '12px',
                  fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 44px 12px 16px',
                    border: '2px solid #e5e7eb', borderRadius: '12px',
                    fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#9ca3af', padding: '4px',
                  }}
                >
                  {showPassword
                    ? <EyeSlashIcon style={{ width: '20px', height: '20px' }} />
                    : <EyeIcon style={{ width: '20px', height: '20px' }} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white', border: 'none',
                borderRadius: '12px', fontSize: '16px',
                fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                letterSpacing: '0.3px',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                style={{
                  color: '#6366f1', fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Create one free →
              </Link>
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link
              href="/"
              style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}
            >
              ← Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}