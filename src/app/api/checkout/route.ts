import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { error } from "console";


export async function POST(request: NextRequest){
  try{
    const user = await getCurrentUser();

    if (!user){
      return NextResponse.json(
        { error: 'Authentication required'},
        { status: 401 }
      );
    }

    const { items, email, userId } = await request.json();

    if (!items || items.length === 0){
      return NextResponse.json(
        {error: 'Cart is empty'},
        {status: 400}
      );
    }

    // Get user's default address 
    const userData = await prisma.user.findUnique({
      where: { id: userId},
      include:{
        addresses:{
          where: {isDefault: true},
          take:1
        },
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const lineItems = items.map((item: any) => ({
      price: item.product.stripePriceId,
      quantity: item.quantity
    }));

    const totalAmount = items.reduce(
      (sum: number,item: any) => sum + item.product.price*item.quantity,
      0
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items:lineItems,
      mode: 'payment',
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      customer_email: email,
      metadata:{
        userId: userId,
        totalAmount: totalAmount.toString()
      },
      shipping_address_collection:{
        allowed_countries:['US',"CA",'GB','DE','FR','AU']
      } 
    });

    // Create order 
    const order = await prisma.order.create({
      data:{
        userId: userId,
        email:email,
        phone: userData?.phone || '',
        shippingAddress: JSON.stringify(userData?.adresses[0] || {}),
        total: totalAmount,
        currency: 'usd',
        status: 'PENDING',
        stripeSessionId: session.id,
        items:{
          create: items.map((item: any) => ({
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
  } catch(error){
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout'},
      { status: 500 }
    );
  }
}
