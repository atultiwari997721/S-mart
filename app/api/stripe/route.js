import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)  // Initialize Stripe with your secret key

export async function POST(request) {
    try {
        const body = await request.text()
        const sig = request.headers.get('stripe-signature')
        const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
        const handlePaymentIntent = async (paymentIntentId, isPaid) => {
           const session = await stripe.checkout.sessions.list({
                payment_intent: paymentIntentId,
                limit: 1
            })
            const{orderIds, userId, appId} = session.data[0].metadata
            if (appId !== 'S-Mart') {
            return NextResponse.json({ received: true, message: "Invalid App ID" }, { status: 400 })
        }
        const orderIdsArray = orderIds.split(',')
        if (isPaid) {
            await Promise.all(orderIdsArray.map(async (orderId) => {
                await prisma.order.update({
                    where: { id: orderId },
                    data: { isPaid: true}
                })
            }))
            // clear The Cart
            await prisma.user.update({
                where: { id: userId },
                data: { cart: {} }
            })
        }else {
            // Delete Order From Db
            await Promise.all(orderIdsArray.map(async (orderId) => {
                await prisma.order.delete({
                    where: { id: orderId }
                })
            }))
        }
    }
        
        switch (event.type) {
            case 'payment_intent.succeeded':{
                await handlePaymentIntent(event.data.object.id, true)
                break;
            }
             case 'payment_intent.canceled':{
                await handlePaymentIntent(event.data.object.id, false)
                break;
            }
             
            default:
                console.log(`Unhandled event type ${event.type}`);
                break;
        }
        return NextResponse.json({ received: true }, { status: 200 });
    }catch(error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export const config = {
    api: {
        bodyParser: false
    }
};