import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const addresses = await prisma.address.findMany({
            where: { userId: user.userId },
            orderBy: { isDefault: 'desc' }
        });

        return NextResponse.json({ addresses });
    } catch (error) {
        console.error('Get addresses error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch addresses' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { street, city, state, zipCode, country } = await request.json();

        if (!street || !city || !state || !zipCode) {
            return NextResponse.json(
                { error: 'Street, city, state, and zip code are required' },
                { status: 400 }
            );
        }

        // Check if this is the first address
        const addressCount = await prisma.address.count({
            where: { userId: user.userId }
        });

        const address = await prisma.address.create({
            data: {
                userId: user.userId,
                street,
                city,
                state,
                zipCode,
                country: country || 'US',
                isDefault: addressCount === 0, // first address is default
            },
        });

        return NextResponse.json({ address });
    } catch (error) {
        console.error('Create address error:', error);
        return NextResponse.json(
            { error: 'Failed to create address' },
            { status: 500 }
        );
    }
}