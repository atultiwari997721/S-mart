import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Create a new rating
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { orderId, productId, rating, review } = await request.json();

        // Check if the order exists and belongs to the user
        const order = await prisma.order.findUnique({ where: { id: orderId, userId } });
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Check if the user has already rated this product for this order
        const isAlreadyRated = await prisma.rating.findFirst({
            where: { userId, productId, orderId }
        });
        if (isAlreadyRated) {
            return NextResponse.json({ error: "Product already rated" }, { status: 400 });
        }

        // Create the rating
        const response = await prisma.rating.create({
            data: {
                userId,
                productId,
                orderId,
                rating,
                review
            }
        });

        return NextResponse.json({ message: "Rating submitted successfully", rating: response });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

// Get all ratings from the user
export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        const ratings = await prisma.rating.findMany({
            where: { userId },
            include: {
                product: true,
                order: true
            }
        });

        return NextResponse.json({ ratings });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}
