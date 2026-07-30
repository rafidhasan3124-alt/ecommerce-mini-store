import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get cart items from request body
    const { items, email } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Get the app URL from environment
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price: item.product.stripePriceId,
      quantity: item.quantity,
    }));

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      customer_email: email || undefined,
      metadata: {
        // Store order data in metadata for webhook
        totalAmount: totalAmount.toString(),
        itemCount: items.length.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'AU'],
      },
    });

    // Create order in database with PENDING status
const order = await prisma.order.create({
  data: {
    customerEmail: email || "guest@example.com",
    total: totalAmount,
    status: "pending",
    stripeSessionId: session.id,

    items: JSON.stringify(
      items.map((item: any) => ({
        productId: item.product.id,
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
      }))
    ),
  },
});

    console.log(`✅ Order created: ${order.id} with session: ${session.id}`);

    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url,
      orderId: order.id,
    });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}