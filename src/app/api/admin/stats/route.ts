import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalProducts, totalUsers, totalOrders, recentOrders] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          email: true,
          total: true,
          status: true,
          createdAt: true,
          user: {
            select: { name: true, email: true }
          },
        },
      }),
    ]);

    const totalRevenue = await prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { total: true },
    });

    return NextResponse.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}