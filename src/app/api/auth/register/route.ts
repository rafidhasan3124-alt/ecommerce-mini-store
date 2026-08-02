import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";


export async function POST(request: NextRequest){
    try{
        const { email, password, name, phone } = await request.json();

        // Validate input 
        if (!email || !password || !name){
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status:400}
            );
        }
        // Check if user exists 
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser){
            return NextResponse.json(
                { error: 'User already exists with this email' },
                { status: 400 }
            );
        }

        // Hash password 
        const hashedPassword = await hashPassword(password);

        // Check if this is an admin email 
        const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
        const role = adminEmails.includes(email)? 'ADMIN' :'USER';

        const user = await prisma.user.create({
            data:{
                email,
                password: hashedPassword,
                name,
                phone,
                role
            }
        });

        // Generate token 
        const token = generateToken({
            userId: user.id,
            email:user.email,
            role:user.role
        });

        // Set Cookie 
        const cookieStore = await cookies();
        cookieStore.set('auth_token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV=== 'production',
            sameSite: 'lax',
            maxAge: 60*60*24*7 //7 days
        });

        // Return user data (excluding password)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            user : userWithoutPassword,
            message: 'Registration successful'
        });
    } catch(error){
        console.error('Registration error:',error);
        return NextResponse.json(
            { error: 'Failed to register user' },
            { status: 500 }
        );
    }
}