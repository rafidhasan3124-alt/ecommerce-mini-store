import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const JWT_SECRET = process.env.JWT_SECRET;

export interface TokenPayload{
    userId: string;
    email: string;
    role: string;
}


// Hash password 
export async function hashPassword(password: string): Promise<string>{
    return await bcrypt.hash(password,10);
}

// Verify PassWord 
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean>{
    return await bcrypt.compare(password,hashedPassword);
}

// Generate JWT token 
export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}


// Verify JWT token 
export function verifyToken(token: string): TokenPayload | null{
    try{
        return jwt.verify(token,JWT_SECRET) as TokenPayload;
    } catch{
        return null;
    }
}

// Get current user from session (Server Component)
export async function getCurrentUser(){
    const cookieStore = await  cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    return payload;
}


// check if user is admin 
export async function isAdmin(){
    const user = await getCurrentUser();
    return user?.role === 'ADMIN';
}