import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';

export async function POST(request: NextRequest){
    try{
        const { email, password } = await request.json();


        // Validate input 
        if (!email || !password){
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user 
        const user = await prisma.user.findUnique({
            where:{ email }
        });

        if (!user){
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401}
            );
        }

        // verify password 
        const isValid = await verifyPassword(password,user.password);

        if (!isValid){
            return NextResponse.json(
                {error: 'Invalid email or password'},
                {status:401}
            );
        }

        // Generate token 
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        // Set cookie — mark as Secure whenever the request is over HTTPS (e.g. ngrok)
        const requestHeaders = await headers();
        const proto = requestHeaders.get('x-forwarded-proto') || 'http';
        const isHttps = proto === 'https';
        (await cookies()).set('auth_token', token, {
            httpOnly: true,
            secure: isHttps,
            sameSite: isHttps ? 'none' : 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Return user data (excluding password )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password:_, ...userWithoutPassword }= user;

        return NextResponse.json({
            user:userWithoutPassword,
            message: 'Login successful'
        });
    }catch (error){
        console.error('Login error:', error);
        return NextResponse.json(
            {error: 'Failed to login'},
            {status: 500}
        );
    }
}