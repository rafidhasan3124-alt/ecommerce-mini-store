import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockProducts } from '@/data/products';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      // Fallback to mock data
      const mockProduct = mockProducts.find((p) => p.id === id);
      if (mockProduct) {
        return NextResponse.json({ product: mockProduct });
      }
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}