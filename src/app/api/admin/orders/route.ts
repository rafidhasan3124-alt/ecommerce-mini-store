import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        total: true,
        status: true,
        currency: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: { id: true, name: true, email: true }
        },
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: { id: true, title: true, imageUrl: true }
            }
          }
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}