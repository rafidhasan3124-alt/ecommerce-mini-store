import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, price, imageUrl, category, stockQuantity, inStock } = await request.json();

    // Create Stripe product and price (simplified)
    // For MVP, we'll use a placeholder stripePriceId
    const stripePriceId = `price_${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        imageUrl,
        category,
        stripePriceId,
        stockQuantity,
        inStock,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}