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

    if (!title || !price) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
    }

    // stripePriceId is left empty — checkout uses inline price_data so no Stripe Price ID is needed
    const product = await prisma.product.create({
      data: {
        title,
        description: description || null,
        price,
        imageUrl: imageUrl || null,
        category: category || null,
        stripePriceId: '',
        stockQuantity: stockQuantity ?? 0,
        inStock: inStock ?? true,
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