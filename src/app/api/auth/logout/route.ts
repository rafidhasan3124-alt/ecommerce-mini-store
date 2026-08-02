import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST() {
    try{
        // Delete auth token cookie 
        const cookieStore = await cookies();
        cookieStore.delete('auth_token');

        return NextResponse.json({
            message: 'Logout successful'
        });
    } catch (error){
        console.error('Logout error:',error);
        return NextResponse.json(
            {error: 'Failed to logout'},
            {status:500}
        );
    }
}