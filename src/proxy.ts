import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes (no authentication required)
const publicRoutes = ['/', '/shop', '/login', '/register'];

const publicPrefixes = [
  '/product/',
  '/api/auth/',
  '/api/products',
];

// Protected routes (authentication required)
const protectedPrefixes = [
  '/cart',
  '/checkout',
  '/profile',
  '/orders',
  '/api/orders',
  '/api/checkout',
  '/api/user',
];

// Admin routes (admin only)
const adminPrefixes = ['/admin', '/api/admin'];

// Lightweight JWT decode (no verification, just payload extraction)
// Verification happens in the API routes using the full 'jsonwebtoken' library
function decodeJwt(token: string): { userId?: string; role?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  let user = null;
  if (token) {
    user = decodeJwt(token);
  }

  const matchesPrefix = (prefixes: string[]) =>
    prefixes.some(
      (prefix) =>
        pathname === prefix ||
        pathname.startsWith(prefix + '/') ||
        pathname.startsWith(prefix + '?')
    );

  const isPublicRoute = publicRoutes.includes(pathname) || matchesPrefix(publicPrefixes);
  const isAdminRoute = matchesPrefix(adminPrefixes);
  const isProtectedRoute = matchesPrefix(protectedPrefixes);

  // Admin route protection
  if (isAdminRoute) {
    if (!user) {
      if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'ADMIN') {
      if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protected route protection
  if (isProtectedRoute && !user) {
    if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Already logged in → redirect away from auth pages
  if (user && (pathname === '/login' || pathname === '/register')) {
    const redirectUrl = user.role === 'ADMIN' ? '/admin' : '/';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
  ],
};
