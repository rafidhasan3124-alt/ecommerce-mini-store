import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";
import { redirect } from "next/dist/server/api-utils";

// Public routes ( no authentication required )
const publicRoutes = [
    '/',
    '/shop',
    '/product/:path*',
    '/api/auth/login',
    '/api/auth/register',
    '/api/products',
    '/api/products/:path*'
];


// Protected routes (authentication required)
const protectedRoutes = [
    '/cart',
    '/checkout',
    '/profile',
    '/orders',
    '/api/orders',
    '/api/checkout'
];


// Admin routes (admin only)
const adminRoutes = [
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*'
];

export function middleware(request: NextRequest){
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    // Check if user is logged in 
    let user = null;
    if (token){
        user = verifyToken(token);
    }

    // check if route is admin 
    const isAdminRoute = adminRoutes.some(route=>{
        const pattern = new RegExp('^'+ route.replace(':path*','.*')+'$');
        return pattern.test(pathname);
    });

    // Check if route is protected 
    const isProtectedRoute = protectedRoutes.some(route=>{
        const pattern = new RegExp('^'+ route.replace(':path*','.*')+'$');
        return pattern.test(pathname);
    });

    // Check if route is public 
    const isPublicRoute = publicRoutes.some(route=>{
        const pattern = new RegExp('^'+route.replace(':path*','.*')+'$');
        return pattern.test(pathname);
    });


    // Admin route protection 
    if (isAdminRoute){
        if (!user){
            return NextResponse.redirect(new URL('/login',request.url));
        }

        if (user.role !== 'ADMIN'){
            return NextResponse.redirect(new URL('/profile',request.url));
        }
        return NextResponse.next();
    }

    // Protected route protection 
    if (isProtectedRoute && !user){
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If user is logged in and trying to access login/register, redirect to home 
    if (user && (pathname === '/login'|| pathname === '/register')){
        const redirectUrl = user.role === 'ADMIN' ? '/admin' : '/profile';
        return NextResponse.redirect(new URL(redirectUrl,request.url));
    }

    // check if user has access to public routes 
    if (isPublicRoute){
        // User is logged in but trying to access public route - allow 
        return NextResponse.next();
    }

    return NextResponse.next();

}

export const config = {
    matcher: [
        '/((?!api/_next/static|_next/image|favicon.ico|.*\\.png$).*)'
    ]
};
