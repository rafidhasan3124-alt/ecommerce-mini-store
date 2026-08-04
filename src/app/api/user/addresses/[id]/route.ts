import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Ensure address belongs to current user
    const existing = await prisma.address.findFirst({
      where: { id, userId: user.userId }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    const address = await prisma.address.update({
      where: { id },
      data: { street, city, state, zipCode, country: country || 'US' },
    });

    return NextResponse.json({ address });
  } catch (error) {
    console.error('Update address error:', error);
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure address belongs to current user
    const existing = await prisma.address.findFirst({
      where: { id, userId: user.userId }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });

    // If the deleted address was default, set the first remaining one as default
    if (existing.isDefault) {
      const firstAddress = await prisma.address.findFirst({
        where: { userId: user.userId },
        orderBy: { createdAt: 'asc' }
      });
      if (firstAddress) {
        await prisma.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete address error:', error);
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
