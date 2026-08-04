import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            const response = NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
            response.cookies.delete('auth_token');
            return response;
        }

        const user = await prisma.user.findUnique({
            where: { id: currentUser.userId },
            include: {
                addresses: {
                    where: { isDefault: true },
                    take: 1
                },
            },
        });

        if (!user) {
            // User was deleted — clear the stale cookie
            const response = NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
            response.cookies.delete('auth_token');
            return response;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json({
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Failed to get user' },
            { status: 500 }
        );
    }
}