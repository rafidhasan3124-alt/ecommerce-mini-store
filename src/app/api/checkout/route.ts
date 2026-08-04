import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { items } = await request.json();
    const userId = user.userId;
    const email = user.email;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Get user's default address
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: {
          where: { isDefault: true },
          take: 1
        },
      },
    });

    // Try to get the origin from the request headers first, as it's the most reliable for proxies
    const originUrl = request.headers.get('origin') || request.nextUrl.origin || 'http://localhost:3000';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || originUrl;

    // Use price_data (inline pricing) instead of pre-created Stripe Price IDs.
    // This works for ALL products regardless of whether they have a stripePriceId.
    const lineItems = items.map((item: { product: { title: string; price: number; imageUrl?: string | null }; quantity: number }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.title,
          ...(item.product.imageUrl ? { images: [item.product.imageUrl] } : {}),
        },
        // Stripe prices are in cents; our DB stores in cents already
        unit_amount: item.product.price,
      },
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce(
      (sum: number, item: { product: { price: number }; quantity: number }) =>
        sum + item.product.price * item.quantity,
      0
    );

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      customer_email: email,
      metadata: {
        userId: userId,
        totalAmount: totalAmount.toString()
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'BD', 'IN', 'PK', 'SG', 'AE']
      }
    });

    // Create order record in database
    const order = await prisma.order.create({
      data: {
        userId: userId,
        email: email,
        phone: userData?.phone || '',
        shippingAddress: JSON.stringify(userData?.addresses[0] || {}),
        total: totalAmount,
        currency: 'usd',
        status: 'PENDING',
        stripeSessionId: session.id,
        items: {
          create: items.map((item: { product: { id: string; price: number }; quantity: number }) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          })),
        },
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url,
      orderId: order.id
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}

