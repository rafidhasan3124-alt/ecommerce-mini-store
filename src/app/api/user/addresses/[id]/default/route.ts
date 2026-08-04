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

    // Ensure address belongs to current user
    const existing = await prisma.address.findFirst({
      where: { id, userId: user.userId }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Clear all other defaults for this user, then set this one
    await prisma.address.updateMany({
      where: { userId: user.userId },
      data: { isDefault: false }
    });

    await prisma.address.update({
      where: { id },
      data: { isDefault: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Set default address error:', error);
    return NextResponse.json(
      { error: 'Failed to set default address' },
      { status: 500 }
    );
  }
}
